// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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

    /// @dev ISuperfluidClub.initialize implementation
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
    uint256 internal constant SECONDS_IN_A_DAY = 86400;
    uint256 public constant FIRST_ELEMENT_PROGRESSION = 365.93 ether; // geometric progression to calculate the allocation

    /// @dev ISuperfluidClub.Protege implementation
    struct Protege {
        address sponsor; // address of the sponsor
        uint8 level; // The level of the protege. Level 0 protege is also called the "root protege"
        uint32 protegeCount; // number of proteges under this protege.
    }

    // State variables
    mapping(address => Protege) internal _proteges;

    /// @dev ISuperfluidClub.isProtege implementation
    function isProtege(address protege) public view returns (bool) {
        return _proteges[protege].sponsor != address(0);
    }

    /// @dev ISuperfluidClub.getChainOfSponsors implementation
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

    /// @dev ISuperfluidClub.getProtege
    function getProtege(address protege) external view returns (Protege memory) {
        return _proteges[protege];
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

    /// @dev ISuperfluidClub.sponsor implementation
    function sponsor(address payable newProtege) external payable {
        require(!isProtege(newProtege), "Already a protege!");
        (address actualSponsor, bool root) = (msg.sender == owner()) ? (address(this), true) : (msg.sender, false);
        require(isProtege(actualSponsor) || root, "You are not a protege!");

        uint256 coinAmount = msg.value;
        uint8 sponsorLvl = _proteges[actualSponsor].level;
        require(coinAmount >= FLAT_COST_SPONSORSHIP, "Not enough coin!");
        coinAmount -= FLAT_COST_SPONSORSHIP;
        require(sponsorLvl < MAX_SPONSORSHIP_LEVEL, "Max sponsorship level reached!");

        /// @notice: we update always the messiah node
        _proteges[address(this)].protegeCount++;

        // @notice: we update storage already because when open a stream, that can trigger a callback from the new protege
        _proteges[newProtege] = Protege({sponsor: actualSponsor, level: sponsorLvl + 1, protegeCount: 0});

        uint256 totalAllocation = 0;
        uint8 totalAllocationLvl = sponsorLvl;

        address s = actualSponsor;
        while (isProtege(s)) {
            // storage "pointer"
            Protege storage sponsorInfo = _proteges[s];
            sponsorInfo.protegeCount++;
            totalAllocation += getAllocation(totalAllocationLvl);
            totalAllocationLvl--;

            // @notice: this can also trigger a callback from sponsor
            _createOrUpdateStream(s, calculateSponsorAmount(sponsorInfo.level, sponsorInfo.protegeCount, totalAllocation));
            s = sponsorInfo.sponsor; // traversal link structure
        }

        // @notice: this can trigger a callback
        ISuperToken(address(this)).createFlow(newProtege, getFlowRateAmount(sponsorLvl + 1));
        if (coinAmount > 0) {
            // @notice: this can trigger a fallback
            newProtege.transfer(coinAmount);
        }
    }

    /// @dev ISuperfluidClub.sponsor implementation
    function restartStream() external {
        require(isProtege(msg.sender), "Not a protege!");
        int96 flowRate = ISuperToken(address(this)).getFlowRate(address(this), msg.sender);
        require(flowRate == 0, "Stream running");
        ISuperToken(address(this)).createFlow(msg.sender, getFlowRateAmount(_proteges[msg.sender].level));
    }

    /// @dev ISuperfluidClub.calculateSponsorAmount implementation
    function calculateSponsorAmount(uint8 level, uint32 protegeCount, uint256 totalWeightedFactor)
        public
        pure
        returns (int96 flow)
    {
        uint256 weightedFactor = getAllocation(level) * protegeCount;
        flow = toInt96(((MAX_SPONSORSHIP_PATH_OUTFLOW * weightedFactor) / totalWeightedFactor) / SECONDS_IN_A_DAY);
    }

    /// @dev ISuperfluidClub.getAllocation implementation
    function getAllocation(uint8 level) public pure returns (uint256 allocation) {
        allocation = FIRST_ELEMENT_PROGRESSION / (2 ** level);
    }

    /// @dev ISuperfluidClub.getMaxFlowRateByLevel implementation
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

    /// @dev ISuperfluidClub.getFlowRateAmount implementation
    function getFlowRateAmount(uint8 protegeLvl) public pure returns (int96 flowRate) {
        int96 maxFlowRate = getMaxFlowRateByLevel(protegeLvl);
        uint256 baseRate = (MAX_SPONSORSHIP_PATH_OUTFLOW * getProtegeLevelWeight(protegeLvl)) / 100;
        uint256 totalRate = baseRate > toUint256(maxFlowRate) ? toUint256(maxFlowRate) : baseRate;
        return toInt96(totalRate / SECONDS_IN_A_DAY);
    }

    /// @dev ISuperfluidClub.getProtegeLevelWeight implementation
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

    /// @dev ISuperfluidClub.withdraw implementation
    function withdraw(address receiver, uint256 amount) external onlyOwner {
        require(receiver != address(0), "Invalid receiver");
        require(amount > 0, "Invalid amount");
        require(address(this).balance >= amount, "Not enough balance");
        payable(receiver).transfer(amount);
    }

    /// @dev ISuperfluidClub.mint implementation
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
