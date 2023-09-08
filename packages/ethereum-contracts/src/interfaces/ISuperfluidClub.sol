// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ISuperToken} from "@superfluid-finance/custom-supertokens/contracts/base/SuperTokenBase.sol";

interface IOwnable {
    /**
     * @dev Returns the address of the current owner.
     */
    function owner() external view returns (address);

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() external;

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) external;
}

interface ISuperfluidClub is ISuperToken, IOwnable {
    /// Events
    event PROTEGE_UPDATED(
        address indexed sponsor,
        address indexed protege,
        uint8 level,
        uint32 totalProtegeCount,
        uint32 directTotalProtegeCount
    );

    /// Constants
    function MAX_SPONSORSHIP_LEVEL() external pure returns (uint256);
    function MAX_SPONSORSHIP_PATH_OUTFLOW() external pure returns (uint256);
    function SECONDS_IN_A_DAY() external pure returns (uint256);

    /**
     * @dev A structure that represents a protege in the superfluid club.
     * @notice: https://english.stackexchange.com/questions/206479/i-am-a-sponsor-do-i-call-the-person-i-sponsor-a-sponsee
     */
    struct Protege {
        address sponsor; // address of the sponsor
        uint8 level; // The level of the protege. Level 0 protege is also called the "root protege"
        uint32 totalProtegeCount; // number of proteges under this protege
        uint32 directTotalProtegeCount; // number of direct proteges under this sponsor
        int96 desiredFlowRate; // desired flow rate for the protege
    }

    /**
     * @notice checks if an address is a protege
     * @param protege The address to check
     * @return True if the address is a protege, false otherwise
     */
    function isProtege(address protege) external view returns (bool);
    /**
     * @notice gets the chain of sponsors for a protege
     * @param protege The protege's address
     * @return sponsors array of Protege structures representing the sponsors
     */
    function getChainOfSponsors(address protege) external view returns (Protege[] memory sponsors);

    /**
     * @notice gets the protege for a given address
     * @param protege The protege's address
     * @return Protege structure representing the protege
     */
    function getProtege(address protege) external view returns (Protege memory);

    /**
     * @dev internal function to create or update a stream
     * @notice this function requires that sender send amount of coin to the contract
     * @param newProtege The address of the new protege
     */
    function sponsor(address payable newProtege) external payable;

    /// @dev test function
    function remove(address oldProtege) external;

    /**
     * @notice restart a stream to a protege
     */
    function restartStream() external;
    /**
     * @notice calculates the flow rate based on level and number of proteges
     * @param totalProtegeCount The number of proteges under the sponsor
     * @return flowRate calculated flow rate
     */
    function calculateFlowRate(uint32 totalProtegeCount) external pure returns (int96 flowRate);
    /**
     * @notice gets the allocation for a given level
     * @param level The sponsorship level
     * @return allocation amount for the given level
     */
    function getAllocationForLevel(uint8 level) external pure returns (uint256 allocation);

    /**
     * @notice gets the fee amount for a given protege level
     * @param directProtegeCount count of direct proteges
     * @return feeAmount amount needed to be paid
     */
    function fee(uint32 directProtegeCount) external pure returns (uint256 feeAmount);

    /**
     * @dev withdraws the fees from the contract
     * @notice only the owner can call this function
     */
    function withdraw(address receiver, uint256 amount) external;

    /**
     * @dev mint club tokens to the contract
     * @notice only the owner can call this function
     */
    function mint(uint256 amount) external;

    /**
     * @dev initialize the contract
     * @param superTokenFactory superfluid token factory
     */
    function initialize(address superTokenFactory) external;
}
