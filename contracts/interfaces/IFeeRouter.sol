// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IFeeRouter {
    function registerAsReferrer() external;
    function routeFee(address referrer) external payable;
    function withdrawReferralEarnings() external;
    function updateFees(uint256 protocolFeeBps, uint256 referralFeeBps) external;
    function updateTreasury(address treasury) external;
}
