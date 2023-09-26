// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {UUPSProxiable} from "@superfluid-finance/ethereum-contracts/contracts/upgradability/UUPSProxiable.sol";
import {UUPSProxy} from "@superfluid-finance/ethereum-contracts/contracts/upgradability/UUPSProxy.sol";
import {SuperfluidClub, ISuperfluid, IConstantOutflowNFT, IConstantInflowNFT} from "../src/SuperfluidClub.sol";
import {ISuperfluidClub} from "./interfaces/ISuperfluidClub.sol";
import {IClubFactory} from "./interfaces/IClubFactory.sol";

contract PayableUUPSProxy is UUPSProxy {
    // allow proxy to receive ether
    receive() external payable override {}
}

contract ClubFactory is UUPSProxiable, IClubFactory {

    error CLUB_FACTORY_ONLY_MESSIAH();

    ISuperfluid public immutable host;
    ISuperfluidClub public immutable CLUB_LOGIC;
    IConstantOutflowNFT public immutable CONSTANT_OUTFLOW_NFT_LOGIC;
    IConstantInflowNFT public immutable CONSTANT_INFLOW_NFT_LOGIC;

    address public theGreatMessiah;

    constructor(
        ISuperfluid host_,
        IConstantOutflowNFT constantOutflowNFTLogic_,
        IConstantInflowNFT constantInflowNFTLogic_
    ) {
        host = host_;
        CLUB_LOGIC = new SuperfluidClub(host_, constantOutflowNFTLogic_, constantInflowNFTLogic_);
        try UUPSProxiable(address(CLUB_LOGIC)).castrate() {} catch {}

        CONSTANT_OUTFLOW_NFT_LOGIC = constantOutflowNFTLogic_;
        CONSTANT_INFLOW_NFT_LOGIC = constantInflowNFTLogic_;

        theGreatMessiah = msg.sender;
        // emit ClubLogicCreated(_SUPER_TOKEN_LOGIC);
    }

    function initialize()
        external
        initializer // OpenZeppelin Initializable
            // solhint-disable-next-line no-empty-blocks
    {}

    function proxiableUUID() public pure override returns (bytes32) {
        return keccak256("org.superfluid-finance.contracts.club.implementation");
    }

    function updateCode(address newAddress) external override {
        if (msg.sender != theGreatMessiah) {
            revert CLUB_FACTORY_ONLY_MESSIAH();
        }
        _updateCodeAddress(newAddress);

        ClubFactory newFactory = ClubFactory(newAddress);
        address newConstantOutflowLogic = address(newFactory.CONSTANT_OUTFLOW_NFT_LOGIC());
        address newConstantInflowLogic = address(newFactory.CONSTANT_INFLOW_NFT_LOGIC());

        if (address(CONSTANT_OUTFLOW_NFT_LOGIC) != newConstantOutflowLogic) {
            UUPSProxiable(address(CLUB_LOGIC.CONSTANT_OUTFLOW_NFT())).updateCode(newConstantOutflowLogic);
        }

        if (address(CONSTANT_INFLOW_NFT_LOGIC) != newConstantInflowLogic) {
            UUPSProxiable(address(CLUB_LOGIC.CONSTANT_INFLOW_NFT())).updateCode(newConstantInflowLogic);
        }
    }

    function createNewClub(string calldata name, string calldata symbol)
        external
        override
        returns (ISuperfluidClub newClub)
    {
        PayableUUPSProxy proxy = new PayableUUPSProxy();
        proxy.initializeProxy(address(CLUB_LOGIC));
        address payable proxyAsPayable = payable(address(proxy));
        newClub = ISuperfluidClub(proxyAsPayable);
        newClub.initialize(name, symbol, msg.sender);
       // newClub.transferOwnership(msg.sender);
        //emit ClubCreated(address(club), name, symbol);
    }
}
