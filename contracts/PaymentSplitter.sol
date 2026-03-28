// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PaymentSplitter - Split ETH payments among recipients
/// @notice Automatically splits incoming ETH based on predefined shares
contract PaymentSplitter {
    uint256 public totalShares;
    uint256 public totalReleased;

    address[] public payees;
    mapping(address => uint256) public shares;
    mapping(address => uint256) public released;

    event PayeeAdded(address indexed account, uint256 shares);
    event PaymentReceived(address indexed from, uint256 amount);
    event PaymentReleased(address indexed to, uint256 amount);

    constructor(address[] memory _payees, uint256[] memory _shares) {
        require(_payees.length == _shares.length, "Length mismatch");
        require(_payees.length > 0, "No payees");

        for (uint256 i = 0; i < _payees.length; i++) {
            _addPayee(_payees[i], _shares[i]);
        }
    }

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    function release(address payable account) external {
        require(shares[account] > 0, "No shares");

        uint256 payment = releasable(account);
        require(payment > 0, "Nothing to release");

        released[account] += payment;
        totalReleased += payment;

        (bool success,) = account.call{value: payment}("");
        require(success, "Transfer failed");
        emit PaymentReleased(account, payment);
    }

    function releasable(address account) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased;
        uint256 entitled = (totalReceived * shares[account]) / totalShares;
        return entitled - released[account];
    }

    function getPayeeCount() external view returns (uint256) {
        return payees.length;
    }

    function _addPayee(address account, uint256 _shares) private {
        require(account != address(0), "Zero address");
        require(_shares > 0, "Zero shares");
        require(shares[account] == 0, "Already a payee");

        payees.push(account);
        shares[account] = _shares;
        totalShares += _shares;
        emit PayeeAdded(account, _shares);
    }
}
