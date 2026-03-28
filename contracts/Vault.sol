// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Vault - A simple ETH vault with deposit tracking
/// @notice Deposit and withdraw ETH with per-user accounting
contract Vault {
    address public admin;
    bool public paused;
    uint256 public totalDeposited;

    mapping(address => uint256) public balances;
    mapping(address => uint256) public depositCount;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Paused(bool status);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Vault is paused");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Zero deposit");
        balances[msg.sender] += msg.value;
        totalDeposited += msg.value;
        depositCount[msg.sender]++;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external whenNotPaused {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function withdrawAll() external whenNotPaused {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        balances[msg.sender] = 0;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit Paused(_paused);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
