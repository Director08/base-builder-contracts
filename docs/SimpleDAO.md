# SimpleDAO

Onchain proposal and weighted voting governance system.

## Constructor
- `votingPeriod`: Duration in seconds for voting window

## Functions
- `grantVotingPower(voter, amount)` - Grant votes (admin only)
- `propose(description)` - Create proposal
- `vote(id, support)` - Cast vote (true=for, false=against)
- `execute(id)` - Finalize proposal after deadline
- `getProposal(id)` - View proposal details
