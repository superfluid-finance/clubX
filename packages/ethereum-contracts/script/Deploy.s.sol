// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SuperfluidClub} from "../src/SuperfluidClub.sol";

contract DeployScript is Script {
    SuperfluidClub club;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        club = new SuperfluidClub();
        // mumbai factory address
        club.initialize(address(0xB798553db6EB3D3C56912378409370145E97324B));
        address payable mikkAddr = payable(address(0x8a546EC33fc88BC01211A9b025F1AC6d4E5790a7));
        club.sponsor{value: 0.1 ether}(mikkAddr);
        vm.stopBroadcast();
    }
}