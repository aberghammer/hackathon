// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

//built following https://docs.alchemy.com/docs/how-to-make-nfts-with-on-chain-metadata-hardhat-and-javascript

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CheckMate is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIds;
    mapping(uint256 => uint256) public tokenIdToCreatedChecks;

    address public checkMadeContract;

    //There is only one checkmate per address allowed
    mapping(address => uint256) public ownedCheckMate;


    constructor(address _checkMadeContract) ERC721 ("CheckMate", "CM"){
        checkMadeContract = _checkMadeContract;

    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mint(address _to) public {
        require(msg.sender == checkMadeContract, "Only the CheckMade contract can mint");
        require(balanceOf(_to) == 0, "Only one CheckMate per address");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(_to, newItemId);
        tokenIdToCreatedChecks[newItemId] = 1;
        _setTokenURI(newItemId, getTokenURI(newItemId));
        ownedCheckMate[_to] = newItemId;
    }

    function upgradeCheckMate(address checkMateHolder) public {
        require(msg.sender == checkMadeContract, "Only the CheckMade contract can upgrade");
        if(balanceOf(checkMateHolder) == 0) {
            mint(checkMateHolder);
        }else {
            uint256 tokenId = ownedCheckMate[checkMateHolder];
            tokenIdToCreatedChecks[tokenId] = tokenIdToCreatedChecks[tokenId] + 1;
            _setTokenURI(tokenId, getTokenURI(tokenId));
        }       
    }

    function generateCharacter(uint256 tokenId) public view returns(string memory){

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="', getColor(tokenId) ,'" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">', getName(tokenId),'</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "Created Checks: ",getChecks(tokenId),'</text>',
            '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }


    function getColor(uint256 tokenId) public view returns (string memory) {
        uint256 createdChecks = tokenIdToCreatedChecks[tokenId];
        if(createdChecks <= 1) {
            return "black";
        } else if (createdChecks <= 5) {
            return "blue";
        } else if (createdChecks <=50) {
            return "red";
        } else if (createdChecks <= 500) {
            return "yellow";
        } else {
            return "white";
        }
    }

    function getName(uint256 tokenId) public view returns (string memory) {
        uint256 createdChecks = tokenIdToCreatedChecks[tokenId];
        if(createdChecks <= 1) {
            return "CheckMate";
        } else if (createdChecks <= 5) {
            return "Happy CheckMate";
        } else if (createdChecks <=50) {
            return "Energetic CheckMate";
        } else if (createdChecks <= 500) {
            return "Motivated CheckMate";
        } else {
            return "CheckMate on fire";
        }
    }

    function getChecks(uint256 tokenId) public view returns (string memory) {
        uint256 createdChecks = tokenIdToCreatedChecks[tokenId];
        return createdChecks.toString();
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory){
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "CheckMate #', tokenId.toString(), '",',
                '"description": "Your awesome content verification buddy",',
                '"image": "', generateCharacter(tokenId), '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function getOwnedTokenId(address owner) public view returns (uint256) {
        return ownedCheckMate[owner];
    }

}