import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection } from './entities/collection.schema';

@Injectable()
export class CollectionsRepository {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<Collection>,
  ) {}

  async findByUserAddress(userAddress: string): Promise<Collection[]> {
    return this.collectionModel.find({ userAddress }).exec();
  }

  async findByContractAddress(
    contractAddress: string,
  ): Promise<Collection | null> {
    return this.collectionModel.findOne({ contractAddress }).exec();
  }

  async create(collectionData: Partial<Collection>): Promise<Collection> {
    const collection = new this.collectionModel(collectionData);
    return collection.save();
  }

  async addTokenToCollection(
    collectionId: number,
    tokenId: number,
  ): Promise<void> {
    await this.collectionModel.updateOne(
      { collectionId },
      { $push: { tokenIds: tokenId } },
    );
  }

  // Find a collection by _id
  async findById(id: string): Promise<Collection | null> {
    return this.collectionModel.findById(id).exec();
  }
}
