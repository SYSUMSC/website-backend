import { Module } from '@nestjs/common';
import { RecruitController } from './recruit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitForm } from './recruit-form.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecruitForm, User])],
  controllers: [RecruitController]
})
export class RecruitModule {}
