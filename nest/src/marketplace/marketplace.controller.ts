import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('api/marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('listing')
  async listNFTFixedPrice(
    @Body('nftContract') nftContract: string,
    @Body('tokenMetadata') tokenMetadata: any,
    @Body('price') price: string,
    @Body('seller') seller: string,
  ) {
    return this.marketplaceService.listNFTFixedPrice(
      nftContract,
      tokenMetadata,
      price,
      seller,
    );
  }

  @Post('auction/create')
  async createAuction(
    @Body('nftContract') nftContract: string,
    @Body('tokenId') tokenId: number,
    @Body('startPrice') startPrice: string,
    @Body('duration') duration: number,
    @Body('seller') seller: string,
  ) {
    return this.marketplaceService.createAuction(
      nftContract,
      tokenId,
      startPrice,
      duration,
      seller,
    );
  }

  @Post('auction/bid')
  async placeBid(
    @Body('nftContract') nftContract: string,
    @Body('tokenId') tokenId: number,
    @Body('bidder') bidder: string,
    @Body('bidAmount') bidAmount: string,
  ) {
    return this.marketplaceService.placeBid(
      nftContract,
      tokenId,
      bidder,
      bidAmount,
    );
  }

  @Post('auction/end')
  async endAuction(
    @Body('nftContract') nftContract: string,
    @Body('tokenId') tokenId: number,
    @Body('seller') seller: string,
  ) {
    return this.marketplaceService.endAuction(nftContract, tokenId, seller);
  }

  @Get('listings')
  async getAllListings() {
    return this.marketplaceService.getAllListings();
  }

  @Get('listing/:nftContract/:tokenId')
  async getListing(
    @Param('nftContract') nftContract: string,
    @Param('tokenId') tokenId: number,
  ) {
    return this.marketplaceService.getListing(nftContract, tokenId);
  }
}
