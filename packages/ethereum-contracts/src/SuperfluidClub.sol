// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {SuperTokenBase, ISuperToken} from "@superfluid-finance/custom-supertokens/contracts/base/SuperTokenBase.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Superfluid Club
 * @dev Contract that facilitates the operations of a superfluid club.
 */

contract SuperfluidClub is SuperTokenBase, Ownable {
    using SuperTokenV1Library for ISuperToken;

    bool private init;

    constructor() {}

    // initialize
    function initialize(address superTokenFactory) public {
        require(!init, "Already initialized");
        init = true;
        _initialize(superTokenFactory, "ClubX", "ClubX");
        _mint(address(this), 100000000000000000000000 ether, new bytes(0));
    }

    // Constants
    uint256 public constant MAX_SPONSORSHIP_LEVEL = 6;
    uint256 public constant FLAT_COST_SPONSORSHIP = 0.01 ether;
    uint256 public constant MAX_SPONSORSHIP_PATH_OUTFLOW = 720 ether;
    uint256 public constant SECONDS_IN_A_DAY = 86400;
    uint256 public constant FIRST_ELEMENT_PROGRESSION = 365.93 ether; // geometric progression to calculate the allocation

    /**
     * @dev A structure that represents a protege in the superfluid club.
     * @notice: https://english.stackexchange.com/questions/206479/i-am-a-sponsor-do-i-call-the-person-i-sponsor-a-sponsee
     */

    struct Protege {
        address sponsor; // address of the sponsor
        uint8 level; // The level of the protege. Level 0 protege is also called the "root protege"
        uint32 protegeCount; // number of proteges under this protege.
    }

    // State variables
    mapping(address => Protege) internal _proteges;

    /**
     * @notice checks if an address is a protege
     * @param protege The address to check
     * @return True if the address is a protege, false otherwise
     */
    function isProtege(address protege) public view returns (bool) {
        return _proteges[protege].sponsor != address(0);
    }

    /**
     * @notice gets the chain of sponsors for a protege
     * @param protege The protege's address
     * @return sponsors array of Protege structures representing the sponsors
     */
    function getChainOfSponsors(address protege)
        external
        view
        returns (Protege[MAX_SPONSORSHIP_LEVEL] memory sponsors)
    {
        address p = protege;
        uint256 i = 0;
        while (isProtege(p)) {
            sponsors[i++] = _proteges[p];
            p = _proteges[p].sponsor;
        }
    }

    /**
     * @dev internal function to create or update a stream
     * @param receiver The address of the stream receiver
     * @param flowRate The rate of the stream
     */
    function _createOrUpdateStream(address receiver, int96 flowRate) internal {
        if (ISuperToken(address(this)).getFlowRate(address(this), receiver) > 0) {
            ISuperToken(address(this)).updateFlow(receiver, flowRate);
        } else {
            ISuperToken(address(this)).createFlow(receiver, flowRate);
        }
    }

    /**
     * @dev internal function to create or update a stream
     * @notice this function requires that sender send amount of coin to the contract
     * @param newProtege The address of the new protege
     */
    function sponsorship(address payable newProtege) external payable {
        require(!isProtege(newProtege), "Already a protege!");
        (address actualSponsor, bool root) = (msg.sender == owner()) ? (address(this), true) : (msg.sender, false);
        require(isProtege(actualSponsor) || root, "You are not a protege!");

        uint256 coinAmount = msg.value;
        uint8 sponsorLvl = _proteges[actualSponsor].level;
        require(coinAmount >= FLAT_COST_SPONSORSHIP, "Not enough coin!");
        coinAmount -= FLAT_COST_SPONSORSHIP;
        require(sponsorLvl < MAX_SPONSORSHIP_LEVEL, "Max sponsorship level reached!");

        // @notice: we update storage already because when open a stream, that can trigger a callback from the new protege
        _proteges[newProtege] = Protege({sponsor: actualSponsor, level: sponsorLvl + 1, protegeCount: 0});

        uint256 totalAllocation = 0;
        uint8 totalAllocationLvl = sponsorLvl;

        address s = actualSponsor;
        while (isProtege(s)) {
            // storage "pointer"
            Protege storage sponsor = _proteges[s];
            sponsor.protegeCount++;
            totalAllocation += getAllocation(totalAllocationLvl);
            totalAllocationLvl--;

            // @notice: this can also trigger a callback from sponsor
            _createOrUpdateStream(s, calculateSponsorAmount(sponsor.level, sponsor.protegeCount, totalAllocation));
            s = sponsor.sponsor; // traversal link structure
        }

        // @notice: this can trigger a callback
        ISuperToken(address(this)).createFlow(newProtege, getFlowRateAmount(sponsorLvl + 1));
        if (coinAmount > 0) {
            // @notice: this can trigger a fallback
            newProtege.transfer(coinAmount);
        }
    }

    /**
     * @notice restart a stream to a protege
     */
    function restartStream() external {
        require(isProtege(msg.sender), "Not a protege!");
        int96 flowRate = ISuperToken(address(this)).getFlowRate(address(this), msg.sender);
        require(flowRate == 0, "Stream running");
        ISuperToken(address(this)).createFlow(msg.sender, getFlowRateAmount(_proteges[msg.sender].level));
    }

    /**
     * @notice calculates the flow rate based on level and number of proteges
     * @param level The level of the sponsor
     * @param protegeCount The number of proteges under the sponsor
     * @param totalWeightedFactor The total weighted factor for the sponsor
     * @return flow calculated flow rate
     */
    function calculateSponsorAmount(uint8 level, uint32 protegeCount, uint256 totalWeightedFactor)
        public
        pure
        returns (int96 flow)
    {
        uint256 weightedFactor = getAllocation(level) * protegeCount;
        flow = toInt96(((MAX_SPONSORSHIP_PATH_OUTFLOW * weightedFactor) / totalWeightedFactor) / SECONDS_IN_A_DAY);
    }

    /**
     * @notice gets the allocation for a given level
     * @param level The sponsorship level
     * @return allocation amount for the given level
     */
    function getAllocation(uint8 level) public pure returns (uint256 allocation) {
        allocation = FIRST_ELEMENT_PROGRESSION / (2 ** level);
    }

    /**
     * @notice gets the flow rate amount for a given sponsorship level
     * @param sponsorLvl The sponsorship level
     * @return maxFlowRate amount for the given level
     */
    function getMaxFlowRateByLevel(uint8 sponsorLvl) public pure returns (int96 maxFlowRate) {
        if (sponsorLvl == 1) {
            return 0.1 ether;
        } else if (sponsorLvl == 2) {
            return 0.05 ether;
        } else if (sponsorLvl == 3) {
            return 0.02 ether;
        } else if (sponsorLvl == 4) {
            return 0.01 ether;
        } else if (sponsorLvl == 5) {
            return 0.005 ether;
        } else {
            return 0.001 ether;
        }
    }

    function getFlowRateAmount(uint8 protegeLvl) public pure returns (int96 flowRate) {
        int96 maxFlowRate = getMaxFlowRateByLevel(protegeLvl);
        uint256 baseRate = (MAX_SPONSORSHIP_PATH_OUTFLOW * getProtegeLevelWeight(protegeLvl)) / 100;
        uint256 totalRate = baseRate > toUint256(maxFlowRate) ? toUint256(maxFlowRate) : baseRate;
        return toInt96(totalRate / SECONDS_IN_A_DAY);
    }

    function getProtegeLevelWeight(uint8 protegeLvl) public pure returns (uint256 levelWeight) {
        if (protegeLvl == 1) {
            return 50;
        } else if (protegeLvl == 2) {
            return 25;
        } else if (protegeLvl == 3) {
            return 12;
        } else if (protegeLvl == 4) {
            return 6;
        } else if (protegeLvl == 5) {
            return 3;
        } else {
            return 1;
        }
    }

    /**
     * @dev withdraws the fees from the contract
     * @notice only the owner can call this function
     */
    function withdraw(address receiver, uint256 amount) external onlyOwner {
        require(receiver != address(0), "Invalid receiver");
        require(amount > 0, "Invalid amount");
        require(address(this).balance >= amount, "Not enough balance");
        payable(receiver).transfer(amount);
    }

    /**
     * @dev mint club tokens to the contract
     * @notice only the owner can call this function
     */
    function mint(uint256 amount) external onlyOwner {
        _mint(address(this), amount, new bytes(0));
    }

    /**
     * @dev receive ethers
     */
    receive() external payable override {}

    /**
     * @dev converts a uint256 to int96
     * @param value The uint256 value to convert
     * @return The converted int96 value
     */
    function toInt96(uint256 value) internal pure returns (int96) {
        require(value <= uint256(uint96(type(int96).max)), "overflow");
        return int96(uint96(value));
    }

    /**
     * @dev converts a int96 to uint256
     * @param value The int96 value to convert
     * @return The converted uint256 value
     */
    function toUint256(int96 value) internal pure returns (uint256) {
        return uint256(uint96(value));
    }
}
