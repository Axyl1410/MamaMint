export class CreateNFTDto {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly attributes: { trait_type: string; value: string }[];
  readonly collectionId: string;
  readonly ownerAddress: string;
}
