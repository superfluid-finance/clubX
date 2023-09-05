// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {SuperfluidClub} from "../src/SuperfluidClub.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "@superfluid-finance/ethereum-contracts/test/foundry/FoundrySuperfluidTester.sol";

contract SuperfluidClubTest is FoundrySuperfluidTester(10) {
    using SuperTokenV1Library for ISuperToken;

    uint256 public constant SECONDS_IN_A_DAY = 86400;

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

    function testWithdraw() public {
        vm.startPrank(alice);
        vm.expectRevert("Ownable: caller is not the owner");
        club.withdraw(alice, 1000);
        vm.stopPrank();

        vm.expectRevert("Invalid receiver");
        club.withdraw(address(0), 1000);

        vm.expectRevert("Invalid amount");
        club.withdraw(bob, 0);

        vm.expectRevert("Not enough balance");
        club.withdraw(bob, 10000);

        // fund the club contract
        address payable clubAsPayable = payable(address(club));
        clubAsPayable.transfer(1000);

        // withdraw to alice account
        uint256 balanceBefore = address(alice).balance;
        club.withdraw(alice, 1000);
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

    function testAddProtegesL0() public {
        uint256 balanceBefore = address(alice).balance;
        address payable aliceAsPayable = payable(address(alice));
        club.sponsor{value: 0.1 ether}(aliceAsPayable);

        uint256 aliceReceivingFlow = uint256(uint96(clubAsToken.getFlowRate(address(club), alice)));
        uint256 aliceExpectedFlow = 0.1 ether / SECONDS_IN_A_DAY;
        assertEq(aliceReceivingFlow, aliceExpectedFlow);
        assertEq(address(alice).balance, balanceBefore  + 0.09 ether);
        assertEq(address(club).balance, 0.01 ether);
    }
}
