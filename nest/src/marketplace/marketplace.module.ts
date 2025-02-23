import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { ConfigModule } from '@nestjs/config';
import { MarketplaceRepository } from './marketplace.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingSchema } from './schemas/listing.schema';
import { AuctionSchema } from './schemas/auction.schema';
import { BidSchema } from './schemas/bid.schema';
import { BullModule } from '@nestjs/bull';
import { NFTSchema } from '../nft/entities/nft.entity';

@Module({
  controllers: [MarketplaceController],
  providers: [MarketplaceService, MarketplaceRepository],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'Listing', schema: ListingSchema },
      { name: 'Auction', schema: AuctionSchema },
      { name: 'Bid', schema: BidSchema },
      {
        name: 'NFT',
        schema: NFTSchema,
      },
    ]),
  ], // Import and configure ConfigModule
  exports: [MarketplaceService], // Export MarketplaceService if needed
})
export class MarketplaceModule {}
