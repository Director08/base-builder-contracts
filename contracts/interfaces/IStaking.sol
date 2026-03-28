// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IStaking {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function claimReward() external;
    function earned(address account) external view returns (uint256);
    function rewardPerToken() external view returns (uint256);

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
}
