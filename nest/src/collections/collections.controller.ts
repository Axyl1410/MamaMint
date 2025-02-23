import { Controller, Post, Body, Get, Param, Put, Query } from '@nestjs/common';

import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.schema';

@Controller('/api/collections')
export class CollectionsController {
  constructor(private readonly collectionService: CollectionsService) {}

  @Post('create')
  async create(@Body() collectionData: Partial<Collection>): Promise<string> {
    return this.collectionService.createCollection(collectionData);
  }

  @Get()
  async getAll(): Promise<Collection[]> {
    return this.collectionService.findAll();
  }

  @Put(':id/contract')
  async updateContractAddress(
    @Param('id') id: string,
    @Body('contractAddress') contractAddress: string,
  ) {
    const updatedCollection = await this.collectionService.updateCollection(
      id,
      contractAddress,
    );
    if (!updatedCollection) {
      return { error: 'Collection not found' };
    }
    return { success: true, updatedCollection };
  }

  @Post(':id/metadata')
  async addMetadata(
    @Param('id') id: string,
    @Body() data: { tokenId: number; metadata: any },
  ) {
    return this.collectionService.addMetadata(id, data.tokenId, data.metadata);
  }

  @Get('metadata/:id/:tokenId')
  async getMetadata(
    @Param('id') id: string,
    @Param('tokenId') tokenId: number,
  ) {
    return this.collectionService.getMetadata(id, tokenId);
  }

  @Get('nfts/:collectionId')
  async getNFTsByCollection(
    @Param('collectionId') collectionId: string,
  ): Promise<any[]> {
    return this.collectionService.getNFTsByCollection(collectionId);
  }

  @Get('wallet/:walletAddress')
  async getCollectionWalletAddress(
    @Param('walletAddress') walletAddress: string,
  ): Promise<Collection | null> {
    console.log('walletAddress', walletAddress);
    return this.collectionService.getCollectionWalletAddress(walletAddress);
  }

  @Get('check-wallet-nft')
  async checkWalletNFT(
    @Query('walletAddress') walletAddress: string,
    @Query('contractAddress') contractAddress: string,
  ) {
    return this.collectionService.getUserNFTCountInCollection(
      walletAddress,
      contractAddress,
    );
  }

  @Get('user-nfts-with-traits')
  async getUserNFTsWithTraits(
    @Query('walletAddress') walletAddress: string,
    @Query('contractAddress') contractAddress: string,
  ) {
    return this.collectionService.getUserOwnedNFTsWithTraits(
      walletAddress,
      contractAddress,
    );
  }

  @Get(':id')
  async getCollectionById(@Param('id') id: string): Promise<Collection | null> {
    return this.collectionService.findById(id);
  }
}
