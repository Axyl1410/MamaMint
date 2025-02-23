import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { NFTService } from './nft.service';
import { CreateNFTDto } from './dto/create-nft.dto';

@Controller('api/nfts')
export class NftController {
  constructor(private readonly nftService: NFTService) {}

  @Get('collection/:collectionId')
  async getNFTsByCollection(@Param('collectionId') collectionId: string) {
    return this.nftService.getNFTsByCollection(collectionId);
  }

  @Post('mint')
  mint(@Body() createNftDto: CreateNFTDto) {
    return this.nftService.createNFT(createNftDto);
  }

  @Get(':nftId')
  async getNFT(@Param('nftId') nftId: string) {
    return this.nftService.getNFT(nftId);
  }

  @Get('user/:ownerAddress')
  async getNFTsByUser(@Param('ownerAddress') ownerAddress: string) {
    return this.nftService.getNFTsByUser(ownerAddress);
  }
}
