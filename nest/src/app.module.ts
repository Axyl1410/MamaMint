import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { ActivityModule } from './activity/activity.module';
import { NftModule } from './nft/nft.module';
import { GenerateModule } from './generate/generate.module';
import { CaptureController } from './capture/capture.controller';

@Module({
  imports: [
    UsersModule,
    CollectionsModule,
    MarketplaceModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nft-collections'),
    ActivityModule,
    NftModule,
    GenerateModule,
  ],
  controllers: [AppController, CaptureController],
  providers: [AppService],
})
export class AppModule {}
