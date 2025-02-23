import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { Collection } from '../collections/entities/collection.schema';
import { NFT } from './entities/nft.entity';
import { CreateNFTDto } from './dto/create-nft.dto';

@Injectable()
export class NFTService {
  constructor(
    @InjectModel('NFT') private readonly nftModel: Model<NFT>,
    @InjectModel('Collection')
    private readonly collectionModel: Model<Collection>,
  ) {}

  async createNFT(createNftDto: CreateNFTDto): Promise<NFT> {
    try {
      console.log('Received DTO:', createNftDto);

      const { attributes, collectionId, ...rest } = createNftDto;

      // Parse attributes nếu cần
      const parsedAttributes =
        typeof attributes === 'string' ? JSON.parse(attributes) : attributes;

      // Chuẩn hóa `trait_type`
      const normalizedAttributes = parsedAttributes.map((attr) => ({
        trait_type: attr.trait_type || attr.traitType, // Chuyển đổi từ frontend
        value: attr.value,
      }));

      // Kiểm tra format attributes
      if (
        !Array.isArray(normalizedAttributes) ||
        normalizedAttributes.some((attr) => !attr.trait_type || !attr.value)
      ) {
        throw new Error(
          'Invalid attributes format: Each attribute must have `trait_type` and `value`.',
        );
      }

      // Tìm `collectionId` từ `contractAddress`
      const collection = await this.collectionModel.findOne({
        contractAddress: collectionId,
      });
      if (!collection) throw new Error('Collection not found');

      const newNFT = new this.nftModel({
        ...rest,
        attributes: normalizedAttributes,
        collectionId: collection._id,
      });

      const savedNFT = await newNFT.save();

      // Thêm NFT vào collection
      await this.collectionModel.updateOne(
        { _id: collection._id },
        { $push: { nfts: savedNFT._id } },
      );

      return savedNFT;
    } catch (error) {
      throw new Error(`Error creating NFT: ${error.message}`);
    }
  }

  async getNFTsByCollection(collectionId: string): Promise<NFT[]> {
    try {
      // Tìm collection dựa trên contractAddress nếu cần
      const collection = await this.collectionModel.findOne({
        contractAddress: collectionId,
      });

      if (!collection) {
        throw new Error('Collection not found');
      }

      // Lấy tất cả NFT có collectionId này
      return this.nftModel.find({ collectionId: collection._id }).exec();
    } catch (error) {
      throw new Error(`Error fetching NFTs: ${error.message}`);
    }
  }

  async getNFTsByUser(ownerAddress: string): Promise<NFT[]> {
    return this.nftModel.find({ ownerAddress }).exec();
  }

  getNFT(nftId: string) {
    return this.nftModel.findById(nftId).populate('collectionId').exec();
  }
}
