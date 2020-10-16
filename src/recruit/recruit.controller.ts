import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Repository } from 'typeorm';
import { RecruitForm } from './recruit-form.entity';
import { GetRecruitStateResponse } from './response/get-recruit-state.response';
import { UpdateRecruitFormDto } from './dto/update-recruit-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RecruitTimelineService } from './recruit-timeline.service';

@Controller('recruit')
export class RecruitController {
  constructor(
    @InjectRepository(RecruitForm) private readonly recruitFormRepository: Repository<RecruitForm>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly recruitTimelineService: RecruitTimelineService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRecruitForm(@Request() request): Promise<GetRecruitStateResponse> {
    let recruitForm = await this.recruitFormRepository.findOne({ user_id: request.user.id });
    if (!recruitForm) {
      const user = await this.userRepository.findOneOrFail({ id: request.user.id });
      await this.recruitFormRepository.insert({
        user_id: user.id,
        email: user.email
      });
      recruitForm = await this.recruitFormRepository.findOneOrFail({ user_id: request.user.id });
    }
    return {
      recruitProgress: this.recruitTimelineService.getRecruitProgress(),
      form: recruitForm
    };
  }

  @Post()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateRecruitForm(@Request() request, @Body() dto: UpdateRecruitFormDto) {
    const values: Partial<RecruitForm> = {
      name: dto.name,
      gender: dto.gender,
      email: dto.email,
      phone_number: dto.phoneNumber,
      grade: dto.grade,
      college: dto.college,
      student_id: dto.studentId,
      political_role: dto.politicalRole,
      self_intro: dto.selfIntroduction,
      wishes: dto.wishes
    };
    for (const name of Object.getOwnPropertyNames(values)) {
      if (values[name] === undefined) {
        delete values[name];
      }
    }
    await this.recruitFormRepository.update({ user_id: request.user.id }, values);
  }
}
