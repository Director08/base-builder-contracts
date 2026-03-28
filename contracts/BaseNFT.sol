// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title BaseNFT - A minimal ERC-721 NFT collection
/// @notice Simple NFT with sequential minting and metadata URI
contract BaseNFT {
    string public name;
    string public symbol;
    string public baseURI;
    uint256 public totalSupply;
    address public owner;

    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(string memory _name, string memory _symbol, string memory _baseURI) {
        name = _name;
        symbol = _symbol;
        baseURI = _baseURI;
        owner = msg.sender;
    }

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = ++totalSupply;
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        require(ownerOf[tokenId] == from, "Not token owner");
        require(
            msg.sender == from || 
            msg.sender == getApproved[tokenId] || 
            isApprovedForAll[from][msg.sender],
            "Not authorized"
        );
        ownerOf[tokenId] = to;
        balanceOf[from]--;
        balanceOf[to]++;
        delete getApproved[tokenId];
        emit Transfer(from, to, tokenId);
    }

    function approve(address spender, uint256 tokenId) external {
        address tokenOwner = ownerOf[tokenId];
        require(msg.sender == tokenOwner || isApprovedForAll[tokenOwner][msg.sender], "Not authorized");
        getApproved[tokenId] = spender;
        emit Approval(tokenOwner, spender, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return string(abi.encodePacked(baseURI, _toString(tokenId)));
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
