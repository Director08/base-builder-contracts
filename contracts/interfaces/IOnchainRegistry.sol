// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IOnchainRegistry {
    function register(string calldata key, string calldata value) external returns (bytes32);
    function update(bytes32 keyHash, string calldata newValue) external;
    function transferOwnership(bytes32 keyHash, address newOwner) external;
    function lookup(string calldata key) external view returns (string memory value, address owner, uint256 updatedAt);
    function getUserKeyCount(address user) external view returns (uint256);
}
