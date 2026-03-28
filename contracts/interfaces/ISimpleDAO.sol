// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISimpleDAO {
    function grantVotingPower(address voter, uint256 amount) external;
    function propose(string calldata description) external returns (uint256);
    function vote(uint256 id, bool support) external;
    function execute(uint256 id) external;
}
