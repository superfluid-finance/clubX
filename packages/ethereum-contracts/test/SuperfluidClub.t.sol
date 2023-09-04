// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import { SuperfluidClub } from "../src/SuperfluidClub.sol";
import { ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import "@superfluid-finance/ethereum-contracts/test/foundry/FoundrySuperfluidTester.sol";

contract SuperfluidClubTest is FoundrySuperfluidTester(10) {

    SuperfluidClub public club;
    ISuperToken public clubAsToken;

    function setUp() public override {
        super.setUp();
        club = new SuperfluidClub();
        club.initialize(address(sf.superTokenFactory));
        clubAsToken = ISuperToken(address(club));
    }

    function testInit() public {
        assertEq(clubAsToken.name(), "ClubX");
        assertEq(clubAsToken.symbol(), "ClubX");
        assertEq(clubAsToken.totalSupply(), 100000000000000000000000 ether);
        assertEq(clubAsToken.balanceOf(address(club)), 100000000000000000000000 ether);
    }

	   function testReceiveEther() public {
		   uint256 balanceBefore = address(club).balance;
		   address payable clubAsPayable = payable(address(club));
		   clubAsPayable.transfer(1000);
		   assertEq(address(club).balance, balanceBefore + 1000);
	   }


	  function testFees() public {
		   assertEq(club.fees(0), 10 ether);
		   assertEq(club.fees(1), 0.3 ether);
		   assertEq(club.fees(2), 0.1 ether);
		   assertEq(club.fees(3), 0.05 ether);
		   assertEq(club.fees(4), 0.02 ether);
		   assertEq(club.fees(5), 0.01 ether);
		   assertEq(club.fees(6), 10 ether);
	   }



}
