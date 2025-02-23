export class CreateActivityDto {
  type: string;
  item: {
    name: string;
    description: string;
    image: string;
  };
  price: number;
  from: string;
  to: string;
  timestamp: Date;
}
