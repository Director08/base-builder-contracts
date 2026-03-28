// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Escrow - Trustless P2P escrow for ETH trades
/// @notice Create escrows with arbiter resolution support
contract Escrow {
    enum State { Created, Funded, Released, Refunded, Disputed }

    struct Deal {
        address buyer;
        address seller;
        address arbiter;
        uint256 amount;
        uint256 arbiterFeeBps;
        State state;
        uint256 createdAt;
    }

    uint256 public dealCount;
    mapping(uint256 => Deal) public deals;

    event DealCreated(uint256 indexed id, address buyer, address seller, address arbiter, uint256 amount);
    event DealFunded(uint256 indexed id);
    event DealReleased(uint256 indexed id);
    event DealRefunded(uint256 indexed id);
    event DealDisputed(uint256 indexed id);
    event DisputeResolved(uint256 indexed id, bool releasedToSeller);

    function createDeal(
        address seller,
        address arbiter,
        uint256 arbiterFeeBps
    ) external payable returns (uint256) {
        require(msg.value > 0, "Must fund deal");
        require(seller != address(0), "Invalid seller");
        require(arbiterFeeBps <= 1000, "Fee too high"); // max 10%

        uint256 id = dealCount++;
        deals[id] = Deal({
            buyer: msg.sender,
            seller: seller,
            arbiter: arbiter,
            amount: msg.value,
            arbiterFeeBps: arbiterFeeBps,
            state: State.Funded,
            createdAt: block.timestamp
        });

        emit DealCreated(id, msg.sender, seller, arbiter, msg.value);
        emit DealFunded(id);
        return id;
    }

    function release(uint256 id) external {
        Deal storage deal = deals[id];
        require(deal.state == State.Funded, "Not funded");
        require(msg.sender == deal.buyer, "Only buyer");

        deal.state = State.Released;
        _payout(id, deal.seller);
        emit DealReleased(id);
    }

    function refund(uint256 id) external {
        Deal storage deal = deals[id];
        require(deal.state == State.Funded, "Not funded");
        require(msg.sender == deal.seller, "Only seller");

        deal.state = State.Refunded;
        (bool success,) = deal.buyer.call{value: deal.amount}("");
        require(success, "Refund failed");
        emit DealRefunded(id);
    }

    function dispute(uint256 id) external {
        Deal storage deal = deals[id];
        require(deal.state == State.Funded, "Not funded");
        require(msg.sender == deal.buyer || msg.sender == deal.seller, "Not party");
        require(deal.arbiter != address(0), "No arbiter");

        deal.state = State.Disputed;
        emit DealDisputed(id);
    }

    function resolveDispute(uint256 id, bool releaseToSeller) external {
        Deal storage deal = deals[id];
        require(deal.state == State.Disputed, "Not disputed");
        require(msg.sender == deal.arbiter, "Only arbiter");

        if (releaseToSeller) {
            deal.state = State.Released;
            _payout(id, deal.seller);
        } else {
            deal.state = State.Refunded;
            _payout(id, deal.buyer);
        }
        emit DisputeResolved(id, releaseToSeller);
    }

    function _payout(uint256 id, address recipient) internal {
        Deal storage deal = deals[id];
        uint256 arbiterFee = (deal.amount * deal.arbiterFeeBps) / 10000;
        uint256 payout = deal.amount - arbiterFee;

        if (arbiterFee > 0 && deal.arbiter != address(0)) {
            (bool s1,) = deal.arbiter.call{value: arbiterFee}("");
            require(s1, "Arbiter fee failed");
        }
        (bool s2,) = recipient.call{value: payout}("");
        require(s2, "Payout failed");
    }
}
