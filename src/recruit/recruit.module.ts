import { Module } from '@nestjs/common';
import { RecruitController } from './recruit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitForm } from './recruit-form.entity';
import { User } from '../user/user.entity';
import { RecruitTimelineService } from './recruit-timeline.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecruitForm, User])],
  controllers: [RecruitController],
  providers: [RecruitTimelineService]
})
export class RecruitModule {}
