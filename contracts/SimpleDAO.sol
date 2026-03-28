// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SimpleDAO - Onchain proposal and voting system
/// @notice Create proposals and vote with token-weighted governance
contract SimpleDAO {
    struct Proposal {
        string description;
        address proposer;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    address public admin;
    uint256 public proposalCount;
    uint256 public votingPeriod; // in seconds
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public votingPower;

    event ProposalCreated(uint256 indexed id, string description, address indexed proposer, uint256 deadline);
    event Voted(uint256 indexed id, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed id, bool passed);
    event VotingPowerGranted(address indexed voter, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(uint256 _votingPeriod) {
        admin = msg.sender;
        votingPeriod = _votingPeriod;
    }

    function grantVotingPower(address voter, uint256 amount) external onlyAdmin {
        votingPower[voter] += amount;
        emit VotingPowerGranted(voter, amount);
    }

    function propose(string calldata description) external returns (uint256) {
        require(votingPower[msg.sender] > 0, "No voting power");
        uint256 id = proposalCount++;
        Proposal storage p = proposals[id];
        p.description = description;
        p.proposer = msg.sender;
        p.deadline = block.timestamp + votingPeriod;
        emit ProposalCreated(id, description, msg.sender, p.deadline);
        return id;
    }

    function vote(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        require(block.timestamp <= p.deadline, "Voting ended");
        require(!p.hasVoted[msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");

        uint256 weight = votingPower[msg.sender];
        p.hasVoted[msg.sender] = true;

        if (support) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }
        emit Voted(id, msg.sender, support, weight);
    }

    function execute(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.timestamp > p.deadline, "Voting not ended");
        require(!p.executed, "Already executed");

        p.executed = true;
        bool passed = p.forVotes > p.againstVotes;
        emit ProposalExecuted(id, passed);
    }

    function getProposal(uint256 id) external view returns (
        string memory description,
        address proposer,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 deadline,
        bool executed
    ) {
        Proposal storage p = proposals[id];
        return (p.description, p.proposer, p.forVotes, p.againstVotes, p.deadline, p.executed);
    }
}
