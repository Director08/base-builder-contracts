// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TimeLock - A time-locked transaction executor
/// @notice Queue and execute transactions after a mandatory delay
contract TimeLock {
    uint256 public constant MIN_DELAY = 1 hours;
    uint256 public constant MAX_DELAY = 30 days;
    uint256 public constant GRACE_PERIOD = 14 days;

    address public admin;
    mapping(bytes32 => bool) public queued;

    event Queue(bytes32 indexed txId, address indexed target, uint256 value, bytes data, uint256 executeAfter);
    event Execute(bytes32 indexed txId, address indexed target, uint256 value, bytes data);
    event Cancel(bytes32 indexed txId);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function queue(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 executeAfter
    ) external onlyAdmin returns (bytes32) {
        require(executeAfter >= block.timestamp + MIN_DELAY, "Delay too short");
        require(executeAfter <= block.timestamp + MAX_DELAY, "Delay too long");

        bytes32 txId = getTxId(target, value, data, executeAfter);
        require(!queued[txId], "Already queued");

        queued[txId] = true;
        emit Queue(txId, target, value, data, executeAfter);
        return txId;
    }

    function execute(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 executeAfter
    ) external payable onlyAdmin returns (bytes memory) {
        bytes32 txId = getTxId(target, value, data, executeAfter);
        require(queued[txId], "Not queued");
        require(block.timestamp >= executeAfter, "Too early");
        require(block.timestamp <= executeAfter + GRACE_PERIOD, "Expired");

        queued[txId] = false;

        (bool success, bytes memory result) = target.call{value: value}(data);
        require(success, "Execution failed");

        emit Execute(txId, target, value, data);
        return result;
    }

    function cancel(bytes32 txId) external onlyAdmin {
        require(queued[txId], "Not queued");
        queued[txId] = false;
        emit Cancel(txId);
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Zero address");
        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }

    function getTxId(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 executeAfter
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(target, value, data, executeAfter));
    }

    receive() external payable {}
}
