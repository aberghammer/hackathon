// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CheckMade {

    constructor() {}

    mapping(bytes32 => address) public hashToAddress;

    function hashString(string memory _content) public pure returns (bytes32) {
        return keccak256((abi.encodePacked(_content)));
    }

    function hashBytes(bytes memory _content) public pure returns (bytes32) {
        return keccak256(_content);
    }

    function createCheck(bytes32 _hash) public {
        hashToAddress[_hash] = msg.sender;
    }

    function getAddressForHash(bytes32 _hash) public view returns (address) {
        return hashToAddress[_hash];
    }
}
