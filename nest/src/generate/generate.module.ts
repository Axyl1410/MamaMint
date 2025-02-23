import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './entities/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [GenerateController],
  providers: [GenerateService],
})
export class GenerateModule {}
