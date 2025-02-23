import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from '../collections/entities/collection.schema';
import { NFTSchema } from './entities/nft.entity';
import { NFTService } from './nft.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'NFT', schema: NFTSchema }]),
  ],
  controllers: [NftController],
  providers: [NFTService],
})
export class NftModule {}
