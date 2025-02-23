import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivityRepository {
  constructor(
    @InjectModel('Activity')
    private readonly collectionModel: Model<Activity>,
  ) {}

  create(createActivityDto: CreateActivityDto) {
    const created = new this.collectionModel(createActivityDto);
    return created.save();
  }

  findOne(id: number) {
    return this.collectionModel.find({ id }).exec();
  }
}
