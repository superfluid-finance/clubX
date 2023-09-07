// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {SuperfluidClub} from "../src/SuperfluidClub.sol";
import {ISuperfluidClub} from "../src/interfaces/ISuperfluidClub.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "@superfluid-finance/ethereum-contracts/test/foundry/FoundrySuperfluidTester.sol";

contract SuperfluidClubTest is FoundrySuperfluidTester(10) {
    using SuperTokenV1Library for ISuperfluidClub;

    uint256 public constant SECONDS_IN_A_DAY = 86400;
    uint256 public constant MAX_SPONSOR_LEVEL = 6;
    uint256 public constant FLAT_COST_sponsor = 0.01 ether;

    ISuperfluidClub public club;

    function setUp() public override {
        super.setUp();
        club = ISuperfluidClub(address(new SuperfluidClub()));
        club.initialize(address(sf.superTokenFactory));
    }

    function testDeployment() public {
        assertEq(club.name(), "ClubX");
        assertEq(club.symbol(), "ClubX");
        assertEq(club.totalSupply(), 100000000000000000000000 ether);
        assertEq(club.balanceOf(address(club)), 100000000000000000000000 ether);
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
            assertTrue(club.getFlowRateAmount(i) > 0);
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
        assertEq(club.totalSupply(), 100000000000000000000000 ether + 1000 ether);
        assertEq(club.balanceOf(address(club)), 100000000000000000000000 ether + 1000 ether);
    }

    function testAddProtegeL0() public {
        uint256 balanceBefore = address(alice).balance;
        address payable aliceAsPayable = payable(address(alice));
        club.sponsor{value: 0.1 ether}(aliceAsPayable);

        uint256 aliceReceivingFlow = uint256(uint96(club.getFlowRate(address(club), alice)));
        uint256 aliceExpectedFlow = 0.1 ether / SECONDS_IN_A_DAY;
        assertEq(aliceReceivingFlow, aliceExpectedFlow);
        assertEq(address(alice).balance, balanceBefore + 0.09 ether);
        assertEq(address(club).balance, 0.01 ether);
        assertEq(club.getProtege(address(club)).totalProtegeCount, 1);
        assertEq(club.getProtege(address(club)).directTotalProtegeCount, 1);
    }

    function testAddProtegeL1() public {
        uint256 balanceBefore = address(bob).balance;
        address payable aliceAsPayable = payable(address(alice));
        address payable bobAsPayable = payable(address(bob));
        club.sponsor{value: 0.1 ether}(aliceAsPayable);
        vm.startPrank(alice);
        club.sponsor{value: 0.01 ether}(bobAsPayable);

        uint256 bobReceivingFlow = uint256(uint96(club.getFlowRate(address(club), bob)));
        uint256 bobExpectedFlow = 0.05 ether / SECONDS_IN_A_DAY;
        assertEq(bobReceivingFlow, bobExpectedFlow);
        assertEq(address(bob).balance, balanceBefore);
        assertEq(club.getProtege(address(club)).totalProtegeCount, 2);
        assertEq(club.getProtege(address(club)).directTotalProtegeCount, 1);
    }

    function testAddMultiProtegesL0() public {
        uint256 baseAddress = uint256(0x421);
        for (uint256 i = 1; i <= 100; i++) {
            address payable protege = payable(address(uint160(baseAddress + i)));
            club.sponsor{value: 0.1 ether}(protege);
            uint256 protegeReceivingFlow = uint256(uint96(club.getFlowRate(address(club), protege)));
            assertEq(protegeReceivingFlow, protegeReceivingFlow);
        }
        assertEq(club.getProtege(address(club)).totalProtegeCount, 100);
        assertEq(club.getProtege(address(club)).directTotalProtegeCount, 100);
    }

    function testFillTree() public {
        uint256 baseAddress = uint256(0x421);
        uint256 currentAddress = baseAddress;

        address payable[(3 ** MAX_SPONSOR_LEVEL) * 3] memory sponsors;
        sponsors[0] = payable(address(club.owner()));

        uint256 currentSponsorIdx = 0;
        uint256 nextSponsorIdx = 1;

        uint256 totalLoopRun = 0;

        for (uint256 level = 0; level < MAX_SPONSOR_LEVEL; level++) {
            uint256 sponsorsInCurrentLevel = 3 ** level;

            for (uint256 s = 0; s < sponsorsInCurrentLevel; s++) {
                address payable currentSponsor = sponsors[currentSponsorIdx++];

                for (uint256 j = 0; j < 3; j++) {
                    address payable protege = payable(address(uint160(currentAddress)));
                    vm.startPrank(club.owner());
                    if (club.owner() != currentSponsor) {
                        currentSponsor.transfer(10 ether);
                        protege.transfer(10 ether);
                    } else {
                        protege.transfer(100 ether);
                    }
                    vm.stopPrank();
                    vm.startPrank(currentSponsor);
                    club.sponsor{value: 0.01 ether}(protege);
                    totalLoopRun += 1;
                    uint256 protegeReceivingFlow = uint256(uint96(club.getFlowRate(address(club), protege)));
                    assertTrue(protegeReceivingFlow > 0);
                    currentAddress += 1;
                    vm.stopPrank();
                    sponsors[nextSponsorIdx++] = protege; // protege as potential sponsor for the next level
                }
            }
        }
        assertEq(club.getProtege(address(club)).totalProtegeCount, totalLoopRun);
        assertEq(club.getProtege(address(club)).directTotalProtegeCount, 3);
    }

    function testRestartStream() public {
        address payable aliceAsPayable = payable(address(alice));
        club.sponsor{value: 0.1 ether}(aliceAsPayable);
        int96 initialFlowRate = club.getFlowRate(address(club), alice);
        assertTrue(initialFlowRate > 0);
        vm.startPrank(alice);
        club.deleteFlow(address(club), alice);
        assertTrue(club.getFlowRate(address(club), alice) == 0);
        club.restartStream();
        assertEq(club.getFlowRate(address(club), alice), initialFlowRate);
        vm.stopPrank();
    }
}
