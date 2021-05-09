import { Module } from '@nestjs/common';
import { HackathonController } from './hackathon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupForm } from './signup-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SignupForm])],
  controllers: [HackathonController]
})
export class HackathonModule {}
