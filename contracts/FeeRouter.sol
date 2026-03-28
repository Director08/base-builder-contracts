// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title FeeRouter - Route fees to protocol treasury and referrers
/// @notice Configurable fee routing with referral support
contract FeeRouter {
    address public treasury;
    address public admin;
    uint256 public protocolFeeBps; // basis points (100 = 1%)
    uint256 public referralFeeBps;

    mapping(address => uint256) public referralEarnings;
    mapping(address => bool) public registeredReferrers;

    event FeeCollected(address indexed payer, uint256 totalFee, uint256 protocolFee, uint256 referralFee);
    event ReferrerRegistered(address indexed referrer);
    event ReferralWithdrawn(address indexed referrer, uint256 amount);
    event ConfigUpdated(uint256 protocolFeeBps, uint256 referralFeeBps);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address _treasury, uint256 _protocolFeeBps, uint256 _referralFeeBps) {
        require(_protocolFeeBps + _referralFeeBps <= 10000, "Fees too high");
        admin = msg.sender;
        treasury = _treasury;
        protocolFeeBps = _protocolFeeBps;
        referralFeeBps = _referralFeeBps;
    }

    function registerAsReferrer() external {
        registeredReferrers[msg.sender] = true;
        emit ReferrerRegistered(msg.sender);
    }

    function routeFee(address referrer) external payable {
        require(msg.value > 0, "No value");

        uint256 protocolFee = (msg.value * protocolFeeBps) / 10000;
        uint256 referralFee = 0;

        if (referrer != address(0) && registeredReferrers[referrer]) {
            referralFee = (msg.value * referralFeeBps) / 10000;
            referralEarnings[referrer] += referralFee;
        } else {
            protocolFee += (msg.value * referralFeeBps) / 10000;
        }

        (bool success,) = treasury.call{value: protocolFee}("");
        require(success, "Treasury transfer failed");

        uint256 remainder = msg.value - protocolFee - referralFee;
        if (remainder > 0) {
            (bool s2,) = msg.sender.call{value: remainder}("");
            require(s2, "Refund failed");
        }

        emit FeeCollected(msg.sender, msg.value, protocolFee, referralFee);
    }

    function withdrawReferralEarnings() external {
        uint256 amount = referralEarnings[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        referralEarnings[msg.sender] = 0;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit ReferralWithdrawn(msg.sender, amount);
    }

    function updateFees(uint256 _protocolFeeBps, uint256 _referralFeeBps) external onlyAdmin {
        require(_protocolFeeBps + _referralFeeBps <= 10000, "Fees too high");
        protocolFeeBps = _protocolFeeBps;
        referralFeeBps = _referralFeeBps;
        emit ConfigUpdated(_protocolFeeBps, _referralFeeBps);
    }

    function updateTreasury(address _treasury) external onlyAdmin {
        require(_treasury != address(0), "Zero address");
        treasury = _treasury;
    }
}
