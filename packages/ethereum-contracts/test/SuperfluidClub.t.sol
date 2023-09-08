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

    ISuperfluidClub public club;

    function setUp() public override {
        super.setUp();
        club = ISuperfluidClub(address(new SuperfluidClub()));
        club.initialize(address(sf.superTokenFactory));
    }

    function _getFee(address sponsor) internal returns (uint256) {
        ISuperfluidClub.Protege memory protege = club.getProtege(sponsor);
        return club.fee(protege.directTotalProtegeCount);
    }

    function _getFlowRate(address sponsor) internal returns (int96) {
        ISuperfluidClub.Protege memory sponsor = club.getProtege(sponsor);
        bool messiah = sponsor.sponsor == address(0);
        if(messiah) {
            return club.calculateFlowRate(sponsor.totalProtegeCount);
        }
        return club.calculateFlowRate(sponsor.totalProtegeCount + 1);
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
            assertEq(club.getAllocationForLevel(i), 720 ether / (2 ** i));
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
        uint256 messiahFee = _getFee(address(club));
        uint256 messiahIsNice = 0.09 ether;
        club.sponsor{value: messiahFee + messiahIsNice}(aliceAsPayable);

        uint256 aliceReceivingFlow = uint256(uint96(club.getFlowRate(address(club), alice)));
        uint256 aliceExpectedFlow = uint256(uint96(_getFlowRate((address(club)))));

        assertEq(aliceReceivingFlow,aliceExpectedFlow);
        assertEq(address(alice).balance, balanceBefore + messiahIsNice);
        assertEq(address(club).balance, messiahFee);
        assertEq(club.getProtege(address(club)).totalProtegeCount, 1);
        assertEq(club.getProtege(address(club)).directTotalProtegeCount, 1);
    }

    function testAddProtegeL1() public {
        uint256 balanceBefore = address(bob).balance;
        address payable aliceAsPayable = payable(address(alice));
        address payable bobAsPayable = payable(address(bob));

        uint256 messiahFee = _getFee(address(club));
        uint256 messiahIsNice = 0.09 ether;

        club.sponsor{value: messiahFee + messiahIsNice}(aliceAsPayable);
        vm.startPrank(alice);
        uint256 aliceFee = _getFee(alice);
        club.sponsor{value: aliceFee}(bobAsPayable);

        uint256 bobReceivingFlow = uint256(uint96(club.getFlowRate(address(club), bob)));
        uint256 bobExpectedFlow = uint256(uint96(_getFlowRate(alice)));

        assertEq(bobReceivingFlow, bobExpectedFlow);
        assertEq(address(bob).balance, balanceBefore);
        assertEq(club.getProtege(address(club)).totalProtegeCount, 2);
        assertEq(club.getProtege(address(club)).directTotalProtegeCount, 1);
        assertEq(club.getProtege(alice).totalProtegeCount, 1);
        assertEq(club.getProtege(alice).totalProtegeCount, 1);
    }

    function testAddMultiProtegesL0() public {
        uint256 baseAddress = uint256(0x421);
        for (uint256 i = 1; i <= 100; i++) {
            address payable protege = payable(address(uint160(baseAddress + i)));
            club.sponsor{value: _getFee(address(club))}(protege);
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
                    club.sponsor{value: _getFee(address(currentSponsor))}(protege);
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
