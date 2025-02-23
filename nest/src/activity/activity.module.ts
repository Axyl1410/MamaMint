import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity } from './entities/activity.entity';
import { ActivityRepository } from './activity.repository';

@Module({
  controllers: [ActivityController],
  imports: [
    MongooseModule.forFeature([{ name: 'Activity', schema: Activity }]),
  ],
  providers: [ActivityService, ActivityRepository],
})
export class ActivityModule {}
