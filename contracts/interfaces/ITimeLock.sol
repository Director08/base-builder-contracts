// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ITimeLock {
    function queue(address target, uint256 value, bytes calldata data, uint256 executeAfter) external returns (bytes32);
    function execute(address target, uint256 value, bytes calldata data, uint256 executeAfter) external payable returns (bytes memory);
    function cancel(bytes32 txId) external;
    function transferAdmin(address newAdmin) external;
}
