// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @title AirdropDistributor - Batch distribute tokens
/// @notice Efficiently distribute ERC-20 tokens to multiple recipients
contract AirdropDistributor {
    address public admin;
    
    struct ClaimInfo {
        uint256 amount;
        bool claimed;
    }

    mapping(address => mapping(address => ClaimInfo)) public claims; // token => user => claim
    
    event AirdropCreated(address indexed token, address[] recipients, uint256[] amounts);
    event Claimed(address indexed token, address indexed user, uint256 amount);
    event BatchTransferred(address indexed token, uint256 totalRecipients, uint256 totalAmount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Direct batch transfer to multiple addresses
    function batchTransfer(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        require(recipients.length == amounts.length, "Length mismatch");
        uint256 total;
        for (uint256 i = 0; i < recipients.length; i++) {
            IERC20(token).transferFrom(msg.sender, recipients[i], amounts[i]);
            total += amounts[i];
        }
        emit BatchTransferred(token, recipients.length, total);
    }

    /// @notice Set up claimable airdrop
    function createAirdrop(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyAdmin {
        require(recipients.length == amounts.length, "Length mismatch");
        uint256 total;
        for (uint256 i = 0; i < recipients.length; i++) {
            claims[token][recipients[i]] = ClaimInfo(amounts[i], false);
            total += amounts[i];
        }
        IERC20(token).transferFrom(msg.sender, address(this), total);
        emit AirdropCreated(token, recipients, amounts);
    }

    /// @notice Claim allocated tokens
    function claim(address token) external {
        ClaimInfo storage info = claims[token][msg.sender];
        require(info.amount > 0, "No allocation");
        require(!info.claimed, "Already claimed");
        
        info.claimed = true;
        IERC20(token).transfer(msg.sender, info.amount);
        emit Claimed(token, msg.sender, info.amount);
    }

    /// @notice Batch ETH transfer
    function batchTransferETH(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable {
        require(recipients.length == amounts.length, "Length mismatch");
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success,) = recipients[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");
        }
    }
}
