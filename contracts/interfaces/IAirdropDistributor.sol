// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAirdropDistributor {
    function batchTransfer(address token, address[] calldata recipients, uint256[] calldata amounts) external;
    function createAirdrop(address token, address[] calldata recipients, uint256[] calldata amounts) external;
    function claim(address token) external;
    function batchTransferETH(address[] calldata recipients, uint256[] calldata amounts) external payable;
}
