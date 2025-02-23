import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionsRepository } from './collection.repository';
import { CollectionSchema } from './entities/collection.schema';
import { NFTSchema } from '../nft/entities/nft.entity';
import { ListingSchema } from '../marketplace/schemas/listing.schema';

@Module({
  controllers: [CollectionsController],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'NFT', schema: NFTSchema }]),
    MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]),
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
  ],
  exports: [CollectionsService],
  providers: [CollectionsService, CollectionsRepository],
})
export class CollectionsModule {}
