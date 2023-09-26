// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ISuperfluidClub} from "./ISuperfluidClub.sol";

interface IClubFactory {
    function createNewClub(string calldata name, string calldata symbol) external returns (ISuperfluidClub newClub);
    function initialize() external;
}
