import { PartialType } from '@nestjs/mapped-types';
import { CreateNFTDto } from './create-nft.dto';

export class UpdateNftDto extends PartialType(CreateNFTDto) {}
