// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IMultiSig {
    function submit(address to, uint256 value, bytes calldata data) external returns (uint256);
    function confirm(uint256 txIndex) external;
    function execute(uint256 txIndex) external;
    function revoke(uint256 txIndex) external;
    function getTransactionCount() external view returns (uint256);
    function getOwners() external view returns (address[] memory);
}
