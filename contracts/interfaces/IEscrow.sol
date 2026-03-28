// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEscrow {
    function createDeal(address seller, address arbiter, uint256 arbiterFeeBps) external payable returns (uint256);
    function release(uint256 id) external;
    function refund(uint256 id) external;
    function dispute(uint256 id) external;
    function resolveDispute(uint256 id, bool releaseToSeller) external;
}
