// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {SuperfluidClub} from "../src/SuperfluidClub.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

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

    function testDeployment() public {
        assertEq(clubAsToken.name(), "ClubX");
        assertEq(clubAsToken.symbol(), "ClubX");
        assertEq(clubAsToken.totalSupply(), 100000000000000000000000 ether);
        assertEq(clubAsToken.balanceOf(address(club)), 100000000000000000000000 ether);
        // test owner for club
        assertEq(club.owner(), address(this));
    }

    function testInitOnlyOnce() public {
        vm.expectRevert("Already initialized");
        club.initialize(address(sf.superTokenFactory));
    }

    function testOnlyOwnerCanTransferOwnership() public {
        vm.startPrank(alice);
        vm.expectRevert("Ownable: caller is not the owner");
        club.transferOwnership(bob);
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

    function testAllocation() public {
        for (uint8 i = 0; i < 7; i++) {
            assertEq(club.getAllocation(i), 365.93 ether / (2 ** i));
        }
    }

    function testGetMaxFlowRateByLevel() public {
        assertEq(club.getMaxFlowRateByLevel(1), 0.1 ether);
        assertEq(club.getMaxFlowRateByLevel(2), 0.05 ether);
        assertEq(club.getMaxFlowRateByLevel(3), 0.02 ether);
        assertEq(club.getMaxFlowRateByLevel(4), 0.01 ether);
        assertEq(club.getMaxFlowRateByLevel(5), 0.005 ether);
        assertEq(club.getMaxFlowRateByLevel(6), 0.001 ether);
    }

    function testGetFlowRateAmount() public {
        for (uint8 i = 0; i < 7; i++) {
            for (uint32 j = 0; j < 9; j++) {
                club.getFlowRateAmount(i, j);
            }
        }
    }

    function testWithdrawFees() public {
        vm.startPrank(alice);
        vm.expectRevert("Ownable: caller is not the owner");
        club.withdrawFees(alice, 1000);
        vm.stopPrank();

        vm.expectRevert("Invalid receiver");
        club.withdrawFees(address(0), 1000);

        vm.expectRevert("Invalid amount");
        club.withdrawFees(bob, 0);

        vm.expectRevert("Not enough balance");
        club.withdrawFees(bob, 10000);

        // fund the club contract
        address payable clubAsPayable = payable(address(club));
        clubAsPayable.transfer(1000);

        // withdrawFees to alice account
        uint256 balanceBefore = address(alice).balance;
        club.withdrawFees(alice, 1000);
        assertEq(address(alice).balance, balanceBefore + 1000);
    }

    function testMint() public {
        vm.startPrank(alice);
        vm.expectRevert("Ownable: caller is not the owner");
        club.mint(1000);
        vm.stopPrank();

        // mint 1000 tokens to the contract
        club.mint(1000 ether);
        assertEq(clubAsToken.totalSupply(), 100000000000000000000000 ether + 1000 ether);
        assertEq(clubAsToken.balanceOf(address(club)), 100000000000000000000000 ether + 1000 ether);
    }
}
