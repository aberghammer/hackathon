// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./lib/strings.sol";

contract CheckMade {
    using strings for *;

    constructor() {}

    mapping(string => address) public idToAddress;
    mapping(string => string) public idToHash;


    function checkMade() public pure returns (string memory) {
        return "Check made";
    }

    function isIdAvailable(string memory _idToCheck) public view returns (bool) {
        string memory pipe = "|";
        if(_idToCheck.toSlice().contains(pipe.toSlice())) {
            return false;
        }
        if (idToAddress[_idToCheck] == address(0)) {
            return true;
        } else {
            return false;
        }
    }

    function hashString(string memory _content) public pure returns (bytes32) {
        return keccak256((abi.encodePacked(_content)));
    }

    function hashBytes(bytes memory _content) public pure returns (bytes32) {
        return keccak256(_content);
    }

    function createCheck(string memory _id, string memory _hash) public {
        require(isIdAvailable(_id), "ID is not available");
        idToAddress[_id] = msg.sender;
        idToHash[_id] = _hash;
    }

    function getAddressForId(string memory _id) public view returns (address) {
        return idToAddress[_id];
    }

    function getHashForId(string memory _id) public view returns (string memory) {
        return idToHash[_id];
    }

}
