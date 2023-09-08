// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {SuperTokenBase, ISuperToken} from "@superfluid-finance/custom-supertokens/contracts/base/SuperTokenBase.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Superfluid Club
 * @dev Contract that facilitates the operations of a superfluid club.
 */

contract SuperfluidClub is SuperTokenBase, Ownable {
    using SuperTokenV1Library for ISuperToken;

    event PROTEGE_UPDATED(
        address indexed sponsor,
        address indexed protege,
        uint8 level,
        uint32 totalProtegeCount,
        uint32 directTotalProtegeCount
    );

    bool private init;

    constructor() {}

    /// @dev ISuperfluidClub.initialize implementation
    function initialize(address superTokenFactory) public {
        require(!init, "Already initialized");
        init = true;
        _initialize(superTokenFactory, "ClubX", "ClubX");
        _mint(address(this), 100000000000000000000000 ether, new bytes(0));
    }

    // Constants
    uint256 public constant MAX_SPONSORSHIP_LEVEL = 6;
    uint256 public constant FLAT_COST_SPONSORSHIP = 0.01 ether;
    uint256 public constant MAX_SPONSORSHIP_PATH_OUTFLOW = 720 ether;
    uint256 internal constant SECONDS_IN_A_DAY = 86400;
    uint256 internal constant FLOW_RATE_BASE = 1 ether;

    /// @dev ISuperfluidClub.Protege implementation
    struct Protege {
        address sponsor; // address of the sponsor
        uint8 level; // The level of the protege. Level 0 protege is also called the "messiah protege"
        uint32 totalProtegeCount; // number of proteges under this protege.
        uint32 directTotalProtegeCount; // number of direct proteges under this sponsor.
        int96 desiredFlowRate; // desired flow rate for the protege
    }

    // State variables
    mapping(address => Protege) internal _proteges;

    /// @dev ISuperfluidClub.isProtege implementation
    function isProtege(address protege) public view returns (bool) {
        return _proteges[protege].sponsor != address(0);
    }

    /// @dev ISuperfluidClub.getChainOfSponsors implementation
    function getChainOfSponsors(address protege)
        external
        view
        returns (Protege[MAX_SPONSORSHIP_LEVEL] memory sponsors)
    {
        address p = protege;
        uint256 i = 0;
        while (isProtege(p)) {
            sponsors[i++] = _proteges[p];
            p = _proteges[p].sponsor;
        }
    }

    /// @dev ISuperfluidClub.getProtege
    function getProtege(address protege) external view returns (Protege memory) {
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
    function sponsor(address payable newProtege) external payable {
        require(!isProtege(newProtege), "Already a protege!");
        // the path of The One, is made of the many
        (address actualSponsor, bool messiah) = (msg.sender == owner()) ? (address(this), true) : (msg.sender, false);
        require(isProtege(actualSponsor) || messiah, "You are not a protege!");

        uint256 coinAmount = msg.value;
        Protege memory sponsorInfo = _proteges[actualSponsor];

        uint256 fee = fee(sponsorInfo.directTotalProtegeCount);
        require(coinAmount >= fee, "Not enough coin!");

        coinAmount -= fee;
        require(sponsorInfo.level < MAX_SPONSORSHIP_LEVEL, "Max sponsorship level reached!");

        /// @notice: we update always the messiah total counter
        _proteges[address(this)].totalProtegeCount++;

        _proteges[actualSponsor].directTotalProtegeCount++;

        // @notice: we update storage already because when open a stream, that can trigger a callback from the new protege
        _proteges[newProtege] = Protege({
            sponsor: actualSponsor,
            level: sponsorInfo.level + 1,
            totalProtegeCount: 0,
            directTotalProtegeCount: 0,
            desiredFlowRate: calculateFlowRate(
                sponsorInfo.totalProtegeCount + 1, sponsorInfo.level
            )
        });

        address s = actualSponsor;
        while (isProtege(s)) {
            // storage "pointer"
            Protege storage sponsorChainInfo = _proteges[s];
            sponsorChainInfo.totalProtegeCount++;
            sponsorChainInfo.desiredFlowRate = calculateFlowRate(sponsorChainInfo.totalProtegeCount, sponsorChainInfo.level) / 2;
            // @notice: this can also trigger a callback from sponsor
            _createOrUpdateStream(s, sponsorChainInfo.desiredFlowRate);

            emit PROTEGE_UPDATED(
                sponsorInfo.sponsor,
                s,
                _proteges[address(this)].level,
                _proteges[address(this)].totalProtegeCount,
                _proteges[address(this)].directTotalProtegeCount
            );
            s = sponsorChainInfo.sponsor; // traversal link structure
        }

        // @notice: this can trigger a callback
        ISuperToken(address(this)).createFlow(newProtege, _proteges[newProtege].desiredFlowRate);
        if (coinAmount > 0) {
            // @notice: this can trigger a fallback
            newProtege.transfer(coinAmount);
        }
    }

    function remove(address oldProtege) external {
        require(isProtege(oldProtege), "Not a protege!");
        address actualSponsor = (msg.sender == owner()) ? address(this) : msg.sender;
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
            sponsorChainInfo.desiredFlowRate = calculateFlowRate(totalProtegeCount, sponsorChainInfo.level);
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
        require(isProtege(msg.sender), "Not a protege!");
        int96 desiredFlowRate = _proteges[msg.sender].desiredFlowRate;
        _createOrUpdateStream(msg.sender, desiredFlowRate);
    }

    /// @dev ISuperfluidClub.calculateSponsorFlowRate implementation
    function calculateFlowRate(uint32 totalProtegeCount, uint8 level) public view returns (int96 flowRate) {
        uint256 allocation = getAllocationForLevel(level);
        flowRate = toInt96(
            ((MAX_SPONSORSHIP_PATH_OUTFLOW * allocation) / (FLOW_RATE_BASE * totalProtegeCount)) / SECONDS_IN_A_DAY
        );
    }

    /// @dev ISuperfluidClub.getAllocation implementation
    function getAllocationForLevel(uint8 level) public pure returns (uint256 allocation) {
        allocation = MAX_SPONSORSHIP_PATH_OUTFLOW / (2 ** level);
    }

    /// @dev ISuperfluidClub.fee implementation
    function fee(uint32 directProtegeCount) public pure returns (uint256 feeAmount) {
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

    /// @dev ISuperfluidClub.withdraw implementation
    function withdraw(address receiver, uint256 amount) external onlyOwner {
        require(receiver != address(0), "Invalid receiver");
        require(amount > 0, "Invalid amount");
        require(address(this).balance >= amount, "Not enough balance");
        payable(receiver).transfer(amount);
    }

    /// @dev ISuperfluidClub.mint implementation
    function mint(uint256 amount) external onlyOwner {
        _mint(address(this), amount, new bytes(0));
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
