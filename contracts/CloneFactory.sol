// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CloneFactory - Deploy minimal proxy contracts (EIP-1167)
/// @notice Gas-efficient contract cloning using the minimal proxy pattern
contract CloneFactory {
    event CloneCreated(address indexed implementation, address indexed clone);

    /// @notice Deploy a minimal proxy pointing to implementation
    function clone(address implementation) external returns (address instance) {
        instance = _clone(implementation);
        emit CloneCreated(implementation, instance);
    }

    /// @notice Deploy a minimal proxy with CREATE2 for deterministic addresses
    function cloneDeterministic(address implementation, bytes32 salt) external returns (address instance) {
        instance = _cloneDeterministic(implementation, salt);
        emit CloneCreated(implementation, instance);
    }

    /// @notice Predict the address of a deterministic clone
    function predictDeterministicAddress(
        address implementation,
        bytes32 salt
    ) external view returns (address predicted) {
        bytes memory bytecode = _getCloneBytecode(implementation);
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))
        );
        return address(uint160(uint256(hash)));
    }

    function _clone(address implementation) internal returns (address instance) {
        bytes memory bytecode = _getCloneBytecode(implementation);
        assembly {
            instance := create(0, add(bytecode, 32), mload(bytecode))
        }
        require(instance != address(0), "Clone failed");
    }

    function _cloneDeterministic(address implementation, bytes32 salt) internal returns (address instance) {
        bytes memory bytecode = _getCloneBytecode(implementation);
        assembly {
            instance := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        require(instance != address(0), "Clone failed");
    }

    function _getCloneBytecode(address implementation) internal pure returns (bytes memory) {
        return abi.encodePacked(
            hex"3d602d80600a3d3981f3363d3d373d3d3d363d73",
            implementation,
            hex"5af43d82803e903d91602b57fd5bf3"
        );
    }
}
