// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {SuperToken, ISuperfluid, IConstantOutflowNFT, IConstantInflowNFT, IERC20} from "./superToken/SuperToken.sol";
import {ISuperfluidClub, ISuperToken} from "./interfaces/ISuperfluidClub.sol";
import {UUPSProxiable} from "@superfluid-finance/ethereum-contracts/contracts/upgradability/UUPSProxiable.sol";

/**
 * @title Superfluid Club
 * @dev Contract that facilitates the operations of a superfluid club.
 */

contract SuperfluidClub is ISuperfluidClub, SuperToken, UUPSProxiable {
    using SuperTokenV1Library for ISuperToken;

    error NOT_OWNER();
    error NOT_PROTEGE();
    error ALREADY_PROTEGE();
    error MAX_SPONSORSHIP_LEVEL_REACHED();
    error NOT_ENOUGH_COIN();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NOT_OWNER();
        }
        _;
    }

    // Constants
    uint256 public constant MAX_SPONSORSHIP_LEVEL = 5;
    uint256 public constant MAX_SPONSORSHIP_PATH_OUTFLOW = 720 ether;

    // State variables
    address public  owner;
    mapping(address => ISuperfluidClub.Protege) internal proteges;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(ISuperfluid host, IConstantOutflowNFT constantOutflowNFT, IConstantInflowNFT constantInflowNFT)
        SuperToken(host, constantOutflowNFT, constantInflowNFT)
    {}

    /// @dev ISuperfluidClub.initialize implementation
    function initialize(string calldata name, string calldata symbol, address newOwner) public override {
        owner = newOwner;
        this.castrate();
        this.initialize(IERC20(address(0)), 0, name, symbol);
        this.selfMint(address(this), 100000000000000000000000 ether, new bytes(0));
    }

    /// @dev ISuperfluidClub.isProtege implementation
    function isProtege(address protege) public view override returns (bool) {
        return proteges[protege].sponsor != address(0);
    }

    /// @dev ISuperfluidClub.getProtege
    function getProtege(address protege) external view override returns (ISuperfluidClub.Protege memory) {
        return proteges[protege];
    }

    /// @dev ISuperfluidClub.getChainOfSponsors implementation
    function getChainOfSponsors(address protege)
        external
        view
        override
        returns (ISuperfluidClub.Protege[5] memory sponsors)
    {
        uint256 i;
        while (isProtege(protege)) {
            sponsors[i++] = (proteges[protege]);
            protege = proteges[protege].sponsor;
        }
    }

    /**
     * @dev internal function to create or update a stream
     * @param receiver The address of the stream receiver
     * @param flowRate The rate of the stream
     */
    function _createOrUpdateStream(address receiver, int96 flowRate) internal {
        if (ISuperToken(address(this)).getFlowRate(address(this), receiver) != 0) {
            ISuperToken(address(this)).updateFlow(receiver, flowRate);
        } else {
            ISuperToken(address(this)).createFlow(receiver, flowRate);
        }
    }

    /// @dev ISuperfluidClub.sponsor implementation
    function sponsor(address payable newProtege) external payable override {
        if (isProtege(newProtege)) {
            revert ALREADY_PROTEGE();
        }
        // the path of The One, is made of the many
        (address actualSponsor, bool messiah) = (msg.sender == owner) ? (address(this), true) : (msg.sender, false);
        // use if and avoid next require
        if (!isProtege(actualSponsor) && !messiah) {
            revert NOT_PROTEGE();
        }

        uint256 coinAmount = msg.value;
        uint256 feeAmount = fee(proteges[actualSponsor].directTotalProtegeCount);
        if (coinAmount < feeAmount) {
            revert NOT_ENOUGH_COIN();
        }

        coinAmount -= feeAmount;
        uint8 actualSponsorLevel = proteges[actualSponsor].level;
        if (actualSponsorLevel == MAX_SPONSORSHIP_LEVEL) {
            revert MAX_SPONSORSHIP_LEVEL_REACHED();
        }

        /// @notice: we update always the messiah total counter
        proteges[address(this)].totalProtegeCount++;

        proteges[actualSponsor].directTotalProtegeCount++;

        uint8 level = actualSponsorLevel + 1;
        int96 protegeDesiredFlowRate = toInt96((MAX_SPONSORSHIP_PATH_OUTFLOW / level) / 86400);
        // how much can we distribute to the sponsor chain
        int96 distributableAmount = toInt96((MAX_SPONSORSHIP_PATH_OUTFLOW / 86400)) - protegeDesiredFlowRate;
        proteges[newProtege] = Protege({
            sponsor: actualSponsor,
            level: level,
            totalProtegeCount: 0,
            directTotalProtegeCount: 0,
            desiredFlowRate: protegeDesiredFlowRate
        });

        address s = actualSponsor;
        while (isProtege(s)) {
            // storage "pointer"
            Protege storage sponsorChainInfo = proteges[s];
            sponsorChainInfo.totalProtegeCount++;
            int96 sponsorDesiredFlowRate =
                sponsorChainInfo.level == 1 ? distributableAmount : (distributableAmount * 50000) / 100000;
            sponsorChainInfo.desiredFlowRate += sponsorDesiredFlowRate;
            distributableAmount -= sponsorDesiredFlowRate;
            // @notice: this can also trigger a callback from sponsor
            _createOrUpdateStream(s, sponsorChainInfo.desiredFlowRate);

            emit PROTEGE_UPDATED(
                proteges[actualSponsor].sponsor,
                s,
                proteges[address(this)].level,
                proteges[address(this)].totalProtegeCount,
                proteges[address(this)].directTotalProtegeCount
            );
            s = sponsorChainInfo.sponsor; // traversal link structure
        }

        // @notice: this can trigger a callback
        ISuperToken(address(this)).createFlow(newProtege, proteges[newProtege].desiredFlowRate);
        if (coinAmount > 0) {
            // @notice: this can trigger a fallback
            newProtege.transfer(coinAmount);
        }
    }

    /// @dev ISuperfluidClub.sponsor implementation
    function restartStream() external {
       _createOrUpdateStream(msg.sender, proteges[msg.sender].desiredFlowRate);
    }

    /// @dev ISuperfluidClub.withdraw implementation
    function withdraw(address receiver, uint256 amount) external override onlyOwner {
        payable(receiver).transfer(amount);
    }

    /// @dev ISuperfluidClub.fee implementation
    function fee(uint32 directProtegeCount) public pure override returns (uint256 feeAmount) {
        if (directProtegeCount <= 12) {
            return 0.01 ether;
        } else if (directProtegeCount <= 24) {
            return 0.1 ether;
        } else if (directProtegeCount <= 36) {
            return 0.2 ether;
        } else if (directProtegeCount <= 48) {
            return 0.3 ether;
        } else if (directProtegeCount <= 60) {
            return 0.4 ether;
        }

        return 1 ether; // 61+
    }

    /// @dev ISuperfluidClub.mint implementation
    function mint(uint256 amount) external onlyOwner {
        this.selfMint(address(this), amount, new bytes(0));
    }

    function proxiableUUID() public pure virtual override returns (bytes32) {
        return keccak256("org.superfluid-finance.contracts.club.implementation");
    }

    function updateCode(address newAddress) external override onlyOwner {
        UUPSProxiable._updateCodeAddress(newAddress);
    }

    /**
     * @dev receive ethers
     */
    receive() external payable override {}

    /**
     * @dev converts a uint256 to int96
     * @param value The uint256 value to convert
     * @return The converted int96 value
     */
    function toInt96(uint256 value) internal pure returns (int96) {
        require(value <= uint256(uint96(type(int96).max)));
        return int96(uint96(value));
    }
}
