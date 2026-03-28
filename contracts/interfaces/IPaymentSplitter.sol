// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPaymentSplitter {
    function release(address payable account) external;
    function releasable(address account) external view returns (uint256);
    function getPayeeCount() external view returns (uint256);
}
