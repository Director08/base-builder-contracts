// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICloneFactory {
    function clone(address implementation) external returns (address);
    function cloneDeterministic(address implementation, bytes32 salt) external returns (address);
    function predictDeterministicAddress(address implementation, bytes32 salt) external view returns (address);

    event CloneCreated(address indexed implementation, address indexed clone);
}
