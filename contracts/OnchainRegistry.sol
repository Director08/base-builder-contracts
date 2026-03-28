// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title OnchainRegistry - A decentralized key-value store
/// @notice Allows anyone to register and update key-value pairs onchain
contract OnchainRegistry {
    struct Entry {
        string value;
        address owner;
        uint256 updatedAt;
    }

    mapping(bytes32 => Entry) public entries;
    mapping(address => bytes32[]) public userKeys;

    event Registered(bytes32 indexed key, string value, address indexed owner);
    event Updated(bytes32 indexed key, string newValue);
    event Transferred(bytes32 indexed key, address indexed from, address indexed to);

    function register(string calldata key, string calldata value) external returns (bytes32) {
        bytes32 keyHash = keccak256(abi.encodePacked(key));
        require(entries[keyHash].owner == address(0), "Key already registered");
        entries[keyHash] = Entry(value, msg.sender, block.timestamp);
        userKeys[msg.sender].push(keyHash);
        emit Registered(keyHash, value, msg.sender);
        return keyHash;
    }

    function update(bytes32 keyHash, string calldata newValue) external {
        require(entries[keyHash].owner == msg.sender, "Not key owner");
        entries[keyHash].value = newValue;
        entries[keyHash].updatedAt = block.timestamp;
        emit Updated(keyHash, newValue);
    }

    function transferOwnership(bytes32 keyHash, address newOwner) external {
        require(entries[keyHash].owner == msg.sender, "Not key owner");
        require(newOwner != address(0), "Invalid new owner");
        entries[keyHash].owner = newOwner;
        emit Transferred(keyHash, msg.sender, newOwner);
    }

    function lookup(string calldata key) external view returns (string memory value, address owner, uint256 updatedAt) {
        bytes32 keyHash = keccak256(abi.encodePacked(key));
        Entry memory entry = entries[keyHash];
        return (entry.value, entry.owner, entry.updatedAt);
    }

    function getUserKeyCount(address user) external view returns (uint256) {
        return userKeys[user].length;
    }
}
