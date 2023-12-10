// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FilterConnectToken is ERC721, ERC721URIStorage, Ownable {
    constructor() ERC721("FilterConnectToken", "FCT") {}

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmYHG7NVd6Xs8LoHcrre1Xitw9GHBWBr8DU12dDPgLKJRr/";
    }

    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) public returns (uint256) {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
