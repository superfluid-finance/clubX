// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {SuperfluidClub, ISuperfluid, IConstantOutflowNFT, IConstantInflowNFT} from "../src/SuperfluidClub.sol";
import {ISuperfluidClub} from "../src/interfaces/ISuperfluidClub.sol";
import {ClubFactory} from "../src/ClubFactory.sol";
import {UUPSProxy} from "@superfluid-finance/ethereum-contracts/contracts/upgradability/UUPSProxy.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        ISuperfluid host = ISuperfluid(vm.envAddress("SUPERFLUID_HOST"));
        IConstantOutflowNFT outNFT = IConstantOutflowNFT(vm.envAddress("OUT_NFT"));
        IConstantInflowNFT inNFT = IConstantInflowNFT(vm.envAddress("IN_NFT"));

        console.log("host: ", address(host));
        console.log("outNFT: ", address(outNFT));
        console.log("inNFT: ", address(inNFT));

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SuperfluidClub clubLogic = new SuperfluidClub(host, outNFT, inNFT);

        address payable clubAsPayable = payable(address(clubLogic));
        console.log("clubLogic address: ", clubAsPayable);

        // deploy club factory
        ClubFactory factoryLogic = new ClubFactory(
            host,
            ISuperfluidClub(clubAsPayable),
            outNFT,
            inNFT
        );

        UUPSProxy proxy = new UUPSProxy();
        proxy.initializeProxy(address(factoryLogic));
        //ClubFactory factory = ClubFactory(address(0xF44540fB8Cd497d499b9782c5B4C20b4A2fAC821));
        ClubFactory factory = ClubFactory(address(proxy));
        factory.initialize();
        //factory.updateCode(address(factoryLogic));

        // deploy club
        ISuperfluidClub club = factory.createNewClub("ClubX", "ClubX");
        console.log("club address: ", address(club));

        //0xE0537ea8F1d5A304635ce05D6F6b0D71fCfAB3a1

        vm.stopBroadcast();
    }
}
