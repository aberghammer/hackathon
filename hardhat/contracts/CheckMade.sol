// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./CheckMate.sol";


contract CheckMade {

event CheckCreated(address indexed _from, bytes32 indexed _hash);

    struct CheckMetaData {
        string contentUrl;
        string description;
        bytes32[] referenceHashes;
    }

    CheckMate public checkMate;

    constructor() {
    }


    function setCheckMate(address _checkMate) public {
        require(checkMate == CheckMate(address(0)), "CheckMate already set");
        checkMate = CheckMate(_checkMate);
    }

    mapping(bytes32 => address) public hashToAddress;
    mapping(bytes32 => CheckMetaData) public hashToCheckMetaData;

    function hashString(string memory _content) public pure returns (bytes32) {
        return keccak256((abi.encodePacked(_content)));
    }

    function hashBytes(bytes memory _content) public pure returns (bytes32) {
        return keccak256(_content);
    }

    function createCheck(bytes32 _hash) public {
        require(hashToAddress[_hash] == address(0), "Check already exists");
        hashToAddress[_hash] = msg.sender;
        hashToCheckMetaData[_hash] = CheckMetaData("", "", new bytes32[](0));
        checkMate.upgradeCheckMate(msg.sender);
        emit CheckCreated(msg.sender, _hash);
    }

    function createCheckWithMetaData(bytes32 _hash, string memory url, string memory description, bytes32[] memory referenceHashes) public {
        require(hashToAddress[_hash] == address(0), "Check already exists");
        hashToAddress[_hash] = msg.sender;
        hashToCheckMetaData[_hash] = CheckMetaData(url, description, referenceHashes);
        checkMate.upgradeCheckMate(msg.sender);
        emit CheckCreated(msg.sender, _hash);
    }

    function addDescriptionToCheck(bytes32 _hash, string memory _description) public {
        require(hashToAddress[_hash] == msg.sender, "Only the owner of the check can add a description");
        hashToCheckMetaData[_hash].description = _description;
    }

    function addContentUrlToCheck(bytes32 _hash, string memory _url) public {
        require(hashToAddress[_hash] == msg.sender, "Only the owner of the check can add a url");
        hashToCheckMetaData[_hash].contentUrl = _url;
    }

    function addReferenceHashesToCheck(bytes32 _hash, bytes32[] memory _referenceHashes) public {
        require(hashToAddress[_hash] == msg.sender, "Only the owner of the check can add reference hashes");
        for( uint256 i = 0; _referenceHashes.length > i ; i++ ){
            hashToCheckMetaData[_hash].referenceHashes.push(_referenceHashes[i]);
        }
    }

    function getSignerAddressForCheck(bytes32 _hash) public view returns (address) {
        return hashToAddress[_hash];
    }

    function getContentUrlForCheck(bytes32 _hash) public view returns (string memory) {
        return hashToCheckMetaData[_hash].contentUrl;
    }

    function getReferenceHashesForCheck(bytes32 _hash) public view returns (bytes32[] memory) {
        return hashToCheckMetaData[_hash].referenceHashes;
    }

    function getDescriptionForCheck(bytes32 _hash) public view returns (string memory) {
        return hashToCheckMetaData[_hash].description;
    }

    function getMetaDataForCheck(bytes32 _hash) public view returns (CheckMetaData memory) {
        return hashToCheckMetaData[_hash];
    }
}
