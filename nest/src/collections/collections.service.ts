import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection } from './entities/collection.schema';
import { Listing } from '../marketplace/schemas/listing.schema';
import * as path from 'node:path';
import * as fs from 'node:fs';
import CollectionContract from './contract/GenerativeArtNFT.json';
import { ethers } from 'ethers';
import axios from 'axios';

@Injectable()
export class CollectionsService {
  private basePath = path.join(__dirname, '../../nft_metadata'); // Thư mục lưu metadata

  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<Collection>,
    @InjectModel('Listing') private readonly listingModel: Model<Listing>,
  ) {}

  async createCollection(data: Partial<Collection>): Promise<string> {
    const createdCollection = new this.collectionModel({
      ...data,
      contractAddress: null, // Ban đầu chưa có địa chỉ contract
    });

    const collection = await createdCollection.save();
    const collectionId = collection._id.toString();

    // ✅ Tạo thư mục riêng cho collection
    const collectionPath = path.join(this.basePath, collectionId);
    if (!fs.existsSync(collectionPath)) {
      fs.mkdirSync(collectionPath, { recursive: true });
    }

    return JSON.stringify({
      collectionId,
      baseURI: `http://localhost:8080/api/collections/metadata/${collectionId}`,
    });
  }

  async addMetadata(collectionId: string, tokenId: number, metadata: any) {
    const collectionPath = path.join(this.basePath, collectionId);
    if (!fs.existsSync(collectionPath)) {
      return { error: 'Collection not found' };
    }

    const filePath = path.join(collectionPath, `${tokenId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    return {
      success: true,
      path: `/collections/metadata/${collectionId}/${tokenId}`,
    };
  }

  async getMetadata(collectionId: string, tokenId: number) {
    const filePath = path.join(this.basePath, collectionId, `${tokenId}.json`);
    if (!fs.existsSync(filePath)) {
      return { error: 'Metadata not found' };
    }

    const metadata = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(metadata);
  }

  async getCollectionWalletAddress(
    walletAddress: string,
  ): Promise<Collection | null> {
    console.log(this.collectionModel.find({ userAddress: walletAddress }));
    return this.collectionModel.findOne({ userAddress: walletAddress }).exec();
  }

  async findAll(): Promise<Collection[]> {
    return this.collectionModel.find().exec();
  }

  findById(id: string) {
    return this.collectionModel.findById(id).exec();
  }

  async updateCollection(
    id: string,
    contractAddress: string,
  ): Promise<Collection | null> {
    console.log(id);
    console.log(contractAddress);
    return this.collectionModel
      .findByIdAndUpdate(id, { contractAddress }, { new: true })
      .exec();
  }

  async getNFTsByCollection(collectionId: string) {
    const collection = this.collectionModel.findById(collectionId).exec();

    if (!collection) {
      throw new Error('Collection not found');
    }
    const contractAddress = (await collection).contractAddress; // Địa chỉ contract
    const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545'); // RPC URL
    const contract = new ethers.Contract(
      contractAddress,
      CollectionContract.abi,
      provider,
    );

    const totalSupply = await contract.totalSupply();
    const nftList = [];

    for (let i = 1; i <= totalSupply; i++) {
      try {
        const owner = await contract.ownerOf(i);
        const tokenURI = await contract.tokenURI(i);
        nftList.push({ tokenId: i, owner, tokenURI });
      } catch (error) {
        console.error(`Token ID ${i} không tồn tại`);
      }
    }

    return nftList;
  }

  decodeBase64Json(base64Encoded: string) {
    try {
      // Nếu tokenURI có prefix như data:application/json;base64, thì loại bỏ prefix này
      const base64Data = base64Encoded.split(',')[1] || base64Encoded;
      const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Lỗi khi giải mã Base64 JSON:', error);
      throw new Error('Không thể giải mã dữ liệu JSON từ Base64');
    }
  }

  async getCoutNFTsBeBurned(
    walletAddress: string,
    contractAddress: string,
  ): Promise<any> {
    const collection = await this.collectionModel
      .findOne({ contractAddress })
      .exec();

    if (!collection) {
      throw new Error('Collection not found');
    }
    const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');
    const contract = new ethers.Contract(
      contractAddress,
      CollectionContract.abi,
      provider,
    );
    const totalBurn = await contract.burnedCountByWallet(walletAddress);
    return {
      collectionAddress: contractAddress,
      totalBurn,
    };
  }

  async getUserOwnedNFTsWithTraits(
    walletAddress: string,
    contractAddress: string,
  ): Promise<{ tokenId: number; traits: any[] }[]> {
    const collection = await this.collectionModel
      .findOne({ contractAddress })
      .exec();

    if (!collection) {
      throw new Error('Collection not found');
    }

    const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');
    const contract = new ethers.Contract(
      contractAddress,
      CollectionContract.abi,
      provider,
    );

    const totalSupply = await contract.totalSupply();
    const userNFTsWithTraits = [];

    for (let i = 1; i <= totalSupply; i++) {
      try {
        const owner = await contract.ownerOf(i);
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          const tokenURI = await contract.tokenURI(i);
          const metadata = this.decodeBase64Json(tokenURI);
          userNFTsWithTraits.push({
            tokenId: i,
            traits: metadata.attributes,
          });
        }
      } catch (error) {
        console.error(
          `Token ID ${i} không tồn tại hoặc không thể lấy dữ liệu.`,
        );
      }
    }

    return JSON.parse(JSON.stringify(userNFTsWithTraits));
  }

  async getUserNFTCountInCollection(
    walletAddress: string,
    contractAddress: string,
  ): Promise<{ ownsAny: boolean; ownedCount: number }> {
    const collection = await this.collectionModel
      .findOne({ contractAddress })
      .exec();

    if (!collection) {
      throw new Error('Collection not found');
    }

    const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545'); // Thay đổi RPC URL nếu cần
    const contract = new ethers.Contract(
      contractAddress,
      CollectionContract.abi,
      provider,
    );

    const totalSupply = await contract.totalSupply();
    let ownedCount = 0;

    for (let i = 1; i <= totalSupply; i++) {
      try {
        const owner = await contract.ownerOf(i);
        console.log(owner);
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          ownedCount++;
        }
      } catch (error) {
        console.error(`Token ID ${i} không tồn tại hoặc không thể lấy owner.`);
      }
    }

    return {
      ownsAny: ownedCount > 0,
      ownedCount,
    };
  }
}
