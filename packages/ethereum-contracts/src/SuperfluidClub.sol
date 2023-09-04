// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {SuperTokenBase, ISuperToken} from "@superfluid-finance/custom-supertokens/contracts/base/SuperTokenBase.sol";

/**
 * @title Superfluid Club
 * @dev Contract that facilitates the operations of a superfluid club.
 */

contract SuperfluidClub is SuperTokenBase {
    using SuperTokenV1Library for ISuperToken;
    bool private init;
    constructor() {
        //_initialize(superTokenFactory, "ClubX", "ClubX");
       // _mint(address(this), 10000000 ether, new bytes(0));
    }

    // initialize
    function initialize(address superTokenFactory) public {
        require(!init, "Already initialized");
        init = true;
        _initialize(superTokenFactory, "ClubX", "ClubX");
        _mint(address(this), 100000000000000000000000 ether, new bytes(0));
    }

    // Constants
    uint256 public constant MAX_SPONSORSHIP_LEVEL = 6;
    uint256 public constant FLAT_FEE_SPONSORSHIP = 0.1 ether;
    uint256 public constant MAX_SPONSORSHIP_PATH_OUTFLOW = 720 ether;
    uint256 private constant ALPHA = 1; // this can be removed if we don't want to use weighted factor

    /**
     * @dev A structure that represents a protege in the superfluid club.
     * @notice: https://english.stackexchange.com/questions/206479/i-am-a-sponsor-do-i-call-the-person-i-sponsor-a-sponsee
     */
    struct Protege {
        address sponsor; // address of the sponsor
        uint8 level; // The level of the protege. Level 0 protege is also called the "root protege"
        uint32 nProteges; // number of proteges under this protege.
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
    function sponsor(address payable newProtege, bool transferCoinToProtege) external payable {
        require(isProtege(msg.sender), "You are not a protege!");
        require(!isProtege(newProtege), "Already a protege!");

        uint256 coinAmount = msg.value;
        uint8 sponsorLvl = _proteges[msg.sender].level;
        uint256 transferToNewProtege = fees(sponsorLvl);

        require((!transferCoinToProtege && coinAmount >= FLAT_FEE_SPONSORSHIP)
            || coinAmount >= transferToNewProtege + FLAT_FEE_SPONSORSHIP, "Not enough coin!");
        require(sponsorLvl < MAX_SPONSORSHIP_LEVEL, "Max sponsorship level reached!");

        // @notice: we update storage already because when open a stream, that can trigger a callback from the new protege
        _proteges[newProtege] = Protege({sponsor: msg.sender, level: sponsorLvl + 1, nProteges: 0});

        uint256 totalAllocation = 0;
        uint8 totalAllocationLvl = sponsorLvl;

        {
            address s = msg.sender;
            while (isProtege(s)) {
                _proteges[s].nProteges++;
                totalAllocation += getAllocation(totalAllocationLvl);
                totalAllocationLvl--;
                // @notice: this can also trigger a callback from sponsor
                _createOrUpdateStream(
                    s, calculateSponsorAmount(_proteges[s].level, _proteges[s].nProteges, totalAllocation)
                );
                s = _proteges[s].sponsor; // traversal link structure
            }
        }

        // WIP - How to know the flow rate of the new protege? this is bound to level max output
        // @notice: this can trigger a callback
        ISuperToken(address(this)).createFlow(newProtege, getFlowRateAmount(sponsorLvl));
        if(transferCoinToProtege) {
            // @notice: this can trigger a fallback
            newProtege.transfer(transferToNewProtege);
        }
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
        uint256 weightedFactor = getAllocation(level) + ALPHA * protegeCount;
        flow = toInt96(((MAX_SPONSORSHIP_PATH_OUTFLOW * weightedFactor) / totalWeightedFactor) / 86400);
    }

    /**
     * @notice gets the allocation for a given level
     * @param level The sponsorship level
     * @return The allocation amount for the given level
     */
    function getAllocation(uint8 level) public pure returns (uint256) {
        // magic number - we have a total amount for each sponsorship branch, we don't need to calculate it each time.
        uint256 a = 365.93 ether;
        return a / (2 ** (level - 1));
    }

    /**
     * @notice gets the fees based on sponsorship level
     * @param sponsorLvl The sponsorship level
     * @return The fee amount for the given level
     */
    function fees(uint8 sponsorLvl) public pure returns (uint256) {
        if (sponsorLvl == 1) {
            return 0.3 ether;
        } else if (sponsorLvl == 2) {
            return 0.1 ether;
        } else if (sponsorLvl == 3) {
            return 0.05 ether;
        } else if (sponsorLvl == 4) {
            return 0.02 ether;
        } else if (sponsorLvl == 5) {
            return 0.01 ether;
        } else {
            return 10 ether;
        }
    }

    /**
     * @notice gets the flow rate amount for a given sponsorship level - WIP this must take into account the number of proteges of that sponsor
     * @param sponsorLvl The sponsorship level
     * @return The flow rate amount for the given level
     */
    function getFlowRateAmount(uint8 sponsorLvl) public pure returns (int96) {
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
        require(value > uint256(uint96(type(int96).max)), "overflow");
        return int96(uint96(value));
    }
}
