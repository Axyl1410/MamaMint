import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityRepository } from './activity.repository';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  create(createActivityDto: CreateActivityDto) {
    return this.activityRepository.create(createActivityDto);
  }

  findAll() {
    return `This action returns all activity`;
  }

  findOne(id: number) {
    return this.activityRepository.findOne(id);
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
