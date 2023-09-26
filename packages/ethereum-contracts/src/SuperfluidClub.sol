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

    error CLUB_NFT_PROXY_ADDRESS_CHANGED();
    error NOT_OWNER();
    error NOT_PROTEGE();
    error ALREADY_PROTEGE();
    error CLUB_PROTEGE_CANNOT_BE_OWNER();
    error NOT_ENOUGH_COIN();
    error MAX_SPONSORSHIP_LEVEL_REACHED();
    error INVALID_AMOUNT();
    error NOT_ENOUGH_BALANCE();
    error ZERO_ADDRESS();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NOT_OWNER();
        }
        _;
    }

    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(ISuperfluid host, IConstantOutflowNFT constantOutflowNFT, IConstantInflowNFT constantInflowNFT)
        SuperToken(host, constantOutflowNFT, constantInflowNFT)
    {}

    /// @dev ISuperfluidClub.initialize implementation
    function initialize(string calldata name, string calldata symbol, address newOwner) public override {
        _transferOwnership(newOwner);
        this.castrate();
        this.initialize(IERC20(address(0)), 0, name, symbol);
        this.selfMint(address(this), 100000000000000000000000 ether, new bytes(0));
    }

    // Constants
    uint256 public constant MAX_SPONSORSHIP_LEVEL = 6;
    uint256 public constant FLAT_COST_SPONSORSHIP = 0.01 ether;
    uint256 public constant MAX_SPONSORSHIP_PATH_OUTFLOW = 720 ether;

    // State variables
    mapping(address => ISuperfluidClub.Protege) internal _proteges;

    /// @dev ISuperfluidClub.isProtege implementation
    function isProtege(address protege) public view override returns (bool) {
        return _proteges[protege].sponsor != address(0);
    }

    /// @dev ISuperfluidClub.getChainOfSponsors implementation
    function getChainOfSponsors(address protege)
        external
        view
        override
        returns (ISuperfluidClub.Protege[] memory sponsors)
    {
        address p = protege;
        uint256 i = 0;
        while (isProtege(p)) {
            sponsors[i++] = _proteges[p];
            p = _proteges[p].sponsor;
        }
    }

    /// @dev ISuperfluidClub.getProtege
    function getProtege(address protege) external view override returns (ISuperfluidClub.Protege memory) {
        return _proteges[protege];
    }

    /**
     * @dev internal function to create or update a stream
     * @param receiver The address of the stream receiver
     * @param flowRate The rate of the stream
     */
    function _createOrUpdateStream(address receiver, int96 flowRate) internal {
        if (ISuperToken(address(this)).getFlowRate(address(this), receiver) > 0) {
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
        uint256 feeAmount = fee(_proteges[actualSponsor].directTotalProtegeCount);
        if (coinAmount < feeAmount) {
            revert NOT_ENOUGH_COIN();
        }

        coinAmount -= feeAmount;
        if (_proteges[actualSponsor].level >= MAX_SPONSORSHIP_LEVEL) {
            revert MAX_SPONSORSHIP_LEVEL_REACHED();
        }

        /// @notice: we update always the messiah total counter
        _proteges[address(this)].totalProtegeCount++;

        _proteges[actualSponsor].directTotalProtegeCount++;

        uint32 lastSponsorProtegeCount = _proteges[actualSponsor].totalProtegeCount;
        address s = actualSponsor;
        while (isProtege(s)) {
            // storage "pointer"
            Protege storage sponsorChainInfo = _proteges[s];
            sponsorChainInfo.totalProtegeCount++;
            sponsorChainInfo.desiredFlowRate += calculateFlowRate(sponsorChainInfo.totalProtegeCount);
            // @notice: this can also trigger a callback from sponsor
            _createOrUpdateStream(s, sponsorChainInfo.desiredFlowRate);

            emit PROTEGE_UPDATED(
                _proteges[actualSponsor].sponsor,
                s,
                _proteges[address(this)].level,
                _proteges[address(this)].totalProtegeCount,
                _proteges[address(this)].directTotalProtegeCount
            );
            lastSponsorProtegeCount = sponsorChainInfo.totalProtegeCount;
            s = sponsorChainInfo.sponsor; // traversal link structure
        }

        // last sponsor protege count is the total protege count of the last sponsor + itself
        lastSponsorProtegeCount = messiah ? lastSponsorProtegeCount : lastSponsorProtegeCount + 1;
        _proteges[newProtege] = Protege({
            sponsor: actualSponsor,
            level: _proteges[actualSponsor].level + 1,
            totalProtegeCount: 0,
            directTotalProtegeCount: 0,
            desiredFlowRate: calculateFlowRate(lastSponsorProtegeCount)
        });

        // @notice: this can trigger a callback
        ISuperToken(address(this)).createFlow(newProtege, _proteges[newProtege].desiredFlowRate);
        if (coinAmount > 0) {
            // @notice: this can trigger a fallback
            newProtege.transfer(coinAmount);
        }
    }

    function remove(address oldProtege) external override {
        if (!isProtege(oldProtege)) {
            revert NOT_PROTEGE();
        }
        address actualSponsor = (msg.sender == owner) ? address(this) : msg.sender;
        Protege memory protegeInfo = _proteges[oldProtege];
        delete _proteges[oldProtege];

        // stop flow
        if (ISuperToken(address(this)).getFlowRate(address(this), oldProtege) > 0) {
            ISuperToken(address(this)).deleteFlow(address(this), oldProtege);
        }

        // remove from global counter
        _proteges[address(this)].totalProtegeCount--;

        _proteges[protegeInfo.sponsor].directTotalProtegeCount--;

        uint32 totalProtegeCount = _proteges[actualSponsor].totalProtegeCount;
        address s = protegeInfo.sponsor;
        while (isProtege(s)) {
            // storage "pointer"
            Protege storage sponsorChainInfo = _proteges[s];
            sponsorChainInfo.totalProtegeCount--;
            sponsorChainInfo.desiredFlowRate -= calculateFlowRate(totalProtegeCount);
            // if flowRate is 0, delete flow
            if (sponsorChainInfo.desiredFlowRate == 0) {
                ISuperToken(address(this)).deleteFlow(s, oldProtege);
            } else {
                _createOrUpdateStream(s, sponsorChainInfo.desiredFlowRate);
            }
        }
    }

    /// @dev ISuperfluidClub.sponsor implementation - WRONG
    function restartStream() external {
        if (!isProtege(msg.sender)) {
            revert NOT_PROTEGE();
        }
        _createOrUpdateStream(msg.sender, _proteges[msg.sender].desiredFlowRate);
    }

    /// @dev ISuperfluidClub.calculateSponsorFlowRate implementation
    function calculateFlowRate(uint32 totalProtegeCount) public pure override returns (int96 flowRate) {
        flowRate = toInt96(MAX_SPONSORSHIP_PATH_OUTFLOW / totalProtegeCount);
    }

    /// @dev ISuperfluidClub.fee implementation
    function fee(uint32 directProtegeCount) public pure override returns (uint256 feeAmount) {
        if (directProtegeCount <= 12) {
            /// [0;12]
            return 0.01 ether;
        } else if (directProtegeCount <= 24) {
            /// [13;24]
            return 0.1 ether;
        } else if (directProtegeCount <= 36) {
            /// [25;36]
            return 0.2 ether;
        } else if (directProtegeCount <= 48) {
            /// [37;48]
            return 0.3 ether;
        } else if (directProtegeCount <= 60) {
            /// [49;60]
            return 0.4 ether;
        } else {
            return 1 ether; // 61+
        }
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        if (newOwner == address(0)) {
            revert ZERO_ADDRESS();
        }
        if (isProtege(newOwner)) {
            revert CLUB_PROTEGE_CANNOT_BE_OWNER();
        }
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /// @dev ISuperfluidClub.withdraw implementation
    function withdraw(address receiver, uint256 amount) external override onlyOwner {
        if (receiver == address(0)) {
            revert ZERO_ADDRESS();
        }
        if (amount <= 0) {
            revert INVALID_AMOUNT();
        }
        if (address(this).balance < amount) {
            revert NOT_ENOUGH_BALANCE();
        }
        payable(receiver).transfer(amount);
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

        // @note This is another check to ensure that when updating to a new SuperToken logic contract
        // that we have passed the correct NFT proxy contracts in the construction of the new SuperToken
        // logic contract
        if (
            CONSTANT_OUTFLOW_NFT != SuperToken(newAddress).CONSTANT_OUTFLOW_NFT()
                || CONSTANT_INFLOW_NFT != SuperToken(newAddress).CONSTANT_INFLOW_NFT()
        ) {
            revert CLUB_NFT_PROXY_ADDRESS_CHANGED();
        }
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
        require(value <= uint256(uint96(type(int96).max)), "overflow");
        return int96(uint96(value));
    }

    /**
     * @dev converts a int96 to uint256
     * @param value The int96 value to convert
     * @return The converted uint256 value
     */
    function toUint256(int96 value) internal pure returns (uint256) {
        return uint256(uint96(value));
    }
}
