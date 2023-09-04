// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {
    ISuperfluid
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    SuperTokenV1Library
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

import {
    SuperTokenBase
} from "@superfluid-finance/custom-supertokens/contracts/base/SuperTokenBase.sol";

/**
 *
 */
contract SuperfluidClub is SuperTokenBase {

    constructor() {
    }

    uint public constant MAX_SPONSORSHIP_LEVEL = 6;

    /** Reference:
     *
     * - https://english.stackexchange.com/questions/206479/i-am-a-sponsor-do-i-call-the-person-i-sponsor-a-sponsee
     */
    struct Protege {
        /// The protege that sponsored you.
        address sponsor;
        /// The level of protege (Level 0 protege is also called the "root protege").
        uint8 level;
        /// Number of proteges created by your proteges.
        uint32 nProteges;
    }

    mapping (address => Protege) internal _proteges;

    function isProtege(address protege) public view returns (bool) {
        return _proteges[protege].sponsor != address(0);
    }

    function getChainOfSponsors(address protege) external view
        returns (Protege[MAX_SPONSORSHIP_LEVEL] memory sponsors)
    {
        address p = protege;
        uint i = 0;
        while (isProtege(p)) {
            sponsors[i++] = _proteges[p];
            p = _proteges[p].sponsor;
        }
    }

    function sponsor(address newProtege) external payable {
        require(!isProtege(msg.sender), "You are not a protege!");
        require(!isProtege(newProtege), "Already a protege!");

        // Protege[MAX_SPONSORSHIP_LEVEL] memory sponsors = getChainOfSponsors(msg.sender);

        // update nProteges for all my sponsors
        {
            address p = msg.sender;
            while (isProtege(p)) {
                _proteges[p].nProteges++;
                // increase flow rate for the sponsor, except the root protege.
                // TODO
                p = _proteges[p].sponsor;
            }
        }
    }
}
