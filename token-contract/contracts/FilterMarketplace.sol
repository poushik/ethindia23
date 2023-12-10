// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FilterMarketplace is Ownable {
    using SafeMath for uint256;

    struct Sale {
        address seller;
        address buyer;
        uint256 price;
        uint256 tokenId;
        bool active;
    }

    IERC721 public nftContract;
    IERC20 public paymentToken;
    uint256 public feePercentage = 2;
    mapping(uint256 => Sale) public sales;

    event SaleCreated(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );
    event SaleUpdated(
        address indexed seller,
        uint256 indexed tokenId,
        uint256 price
    );
    event SaleCancelled(address indexed seller, uint256 indexed tokenId);
    event SaleCompleted(
        address indexed seller,
        address indexed buyer,
        uint256 indexed tokenId,
        uint256 price
    );

    constructor(address _nftContract, address _paymentToken) {
        nftContract = IERC721(_nftContract);
        paymentToken = IERC20(_paymentToken);
    }

    function setFeePercentage(uint256 _feePercentage) public onlyOwner {
        feePercentage = _feePercentage;
    }

    function createSale(uint256 _tokenId, uint256 _price) public {
        require(
            nftContract.ownerOf(_tokenId) == msg.sender,
            "Only token owner can sell"
        );
        require(
            nftContract.getApproved(_tokenId) == address(this),
            "NFT must be approved for trading"
        );

        sales[_tokenId] = Sale(msg.sender, address(0), _price, _tokenId, true);
        emit SaleCreated(msg.sender, _tokenId, _price);
    }

    // function createSale(uint256 tokenId, uint256 price) public {
    //     require(_exists(tokenId), "Sale: nonexistent token");
    //     require(_tokenOwners[tokenId] == msg.sender, "Sale: not owner");

    //     Sale storage sale = _tokenSales[tokenId];
    //     require(sale.price == 0, "Sale: already exists");

    //     // Set the price as an integer value
    //     sale.price = price;
    //     sale.seller = payable(msg.sender);
    //     sale.paymentToken = paymentToken;

    //     emit SaleCreated(tokenId, price);
    // }

    function updateSale(uint256 _tokenId, uint256 _price) public {
        require(
            sales[_tokenId].seller == msg.sender,
            "Only seller can update sale"
        );
        require(sales[_tokenId].active, "Sale is not active");

        sales[_tokenId].price = _price;
        emit SaleUpdated(msg.sender, _tokenId, _price);
    }

    function cancelSale(uint256 _tokenId) public {
        require(
            sales[_tokenId].seller == msg.sender,
            "Only seller can cancel sale"
        );
        require(sales[_tokenId].active, "Sale is not active");

        sales[_tokenId].active = false;
        emit SaleCancelled(msg.sender, _tokenId);
    }

    function buy(uint256 _tokenId) public {
        Sale storage sale = sales[_tokenId];
        require(sale.active, "Sale is not active");

        uint256 totalPrice = sale.price.add(
            sale.price.mul(feePercentage).div(100)
        );
        paymentToken.transferFrom(msg.sender, address(this), totalPrice);
        paymentToken.transfer(sale.seller, sale.price);
        nftContract.safeTransferFrom(sale.seller, msg.sender, sale.tokenId);
        sale.active = false;
        sale.buyer = msg.sender;
        emit SaleCompleted(sale.seller, msg.sender, _tokenId, sale.price);
    }
}
