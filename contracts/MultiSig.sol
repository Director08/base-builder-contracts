// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MultiSig - A multi-signature wallet
/// @notice Requires multiple owner confirmations to execute transactions
contract MultiSig {
    uint256 public required;
    address[] public owners;
    mapping(address => bool) public isOwner;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }

    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmed;

    event Submitted(uint256 indexed txIndex, address indexed to, uint256 value);
    event Confirmed(uint256 indexed txIndex, address indexed owner);
    event Revoked(uint256 indexed txIndex, address indexed owner);
    event Executed(uint256 indexed txIndex);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }

    modifier txExists(uint256 txIndex) {
        require(txIndex < transactions.length, "Tx does not exist");
        _;
    }

    modifier notExecuted(uint256 txIndex) {
        require(!transactions[txIndex].executed, "Already executed");
        _;
    }

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "Need owners");
        require(_required > 0 && _required <= _owners.length, "Invalid required count");

        for (uint256 i = 0; i < _owners.length; i++) {
            address o = _owners[i];
            require(o != address(0), "Zero address");
            require(!isOwner[o], "Duplicate owner");
            isOwner[o] = true;
            owners.push(o);
        }
        required = _required;
    }

    function submit(address to, uint256 value, bytes calldata data) external onlyOwner returns (uint256) {
        uint256 txIndex = transactions.length;
        transactions.push(Transaction({
            to: to,
            value: value,
            data: data,
            executed: false,
            confirmations: 0
        }));
        emit Submitted(txIndex, to, value);
        return txIndex;
    }

    function confirm(uint256 txIndex) external onlyOwner txExists(txIndex) notExecuted(txIndex) {
        require(!confirmed[txIndex][msg.sender], "Already confirmed");
        confirmed[txIndex][msg.sender] = true;
        transactions[txIndex].confirmations++;
        emit Confirmed(txIndex, msg.sender);
    }

    function execute(uint256 txIndex) external onlyOwner txExists(txIndex) notExecuted(txIndex) {
        Transaction storage txn = transactions[txIndex];
        require(txn.confirmations >= required, "Not enough confirmations");
        txn.executed = true;
        (bool success,) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Execution failed");
        emit Executed(txIndex);
    }

    function revoke(uint256 txIndex) external onlyOwner txExists(txIndex) notExecuted(txIndex) {
        require(confirmed[txIndex][msg.sender], "Not confirmed");
        confirmed[txIndex][msg.sender] = false;
        transactions[txIndex].confirmations--;
        emit Revoked(txIndex, msg.sender);
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    receive() external payable {}
}
