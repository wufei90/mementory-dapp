// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
 ________     ___    ___ ________  ________          ________  _________  ___  ___  ________  ___  ________     
|\   __  \   |\  \  /  /|\   __  \|\_____  \        |\   ____\|\___   ___\\  \|\  \|\   ___ \|\  \|\   __  \    
\ \  \|\  \  \ \  \/  / | \  \|\  \|____|\ /_       \ \  \___|\|___ \  \_\ \  \\\  \ \  \_|\ \ \  \ \  \|\  \   
 \ \   __  \  \ \    / / \ \   ____\    \|\  \       \ \_____  \   \ \  \ \ \  \\\  \ \  \ \\ \ \  \ \  \\\  \  
  \ \  \ \  \  /     \/   \ \  \___|   __\_\  \       \|____|\  \   \ \  \ \ \  \\\  \ \  \_\\ \ \  \ \  \\\  \ 
   \ \__\ \__\/  /\   \    \ \__\     |\_______\        ____\_\  \   \ \__\ \ \_______\ \_______\ \__\ \_______\
    \|__|\|__/__/ /\ __\    \|__|     \|_______|       |\_________\   \|__|  \|_______|\|_______|\|__|\|_______|
             |__|/ \|__|                               \|_________|                                             

*/

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Mementory is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor(string memory _tokenName, string memory _tokenSymbol)
        ERC721(_tokenName, _tokenSymbol)
    {}

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function createToken(string memory _tokenURI)
        public
        callerIsUser
        returns (uint256)
    {
        tokenIds.increment();
        uint256 tokenId = tokenIds.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        return tokenId;
    }

    function burnToken(uint256 _tokenId) public callerIsUser {
        require(
            ownerOf(_tokenId) == msg.sender,
            "Only the owner of the token can burn it"
        );
        _burn(_tokenId);
    }

    // ============ REQUIRED OVERRIDES ============

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
