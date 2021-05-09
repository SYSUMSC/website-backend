import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  Post,
  HttpCode,
  Body
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupForm } from './signup-form.entity';
import { UpdateSignupFormDto } from './dto/update-signup-form.dto';
import { GetSignupFormResponse } from './response/get-signup-form.response';

@Controller('hackathon')
export class HackathonController {
  constructor(
    @InjectRepository(SignupForm) private readonly signupFormRepository: Repository<SignupForm>
  ) {}

  @Get('form')
  @UseGuards(JwtAuthGuard)
  async getSignupForm(@Request() request): Promise<GetSignupFormResponse> {
    let data = await this.signupFormRepository.findOne({ user_id: request.user.id });
    if (!data) {
      await this.signupFormRepository.insert({
        user_id: request.user.id,
        confirmed: false,
        teamName: '',
        teamDescription: '',
        memberInfoJson: '[]'
      });
      data = await this.signupFormRepository.findOneOrFail({ user_id: request.user.id });
    }
    return {
      confirmed: data.confirmed,
      teamInfo: {
        name: data.teamName,
        description: data.teamDescription
      },
      memberInfo: JSON.parse(data.memberInfoJson)
    };
  }

  @Post('form')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateSignupForm(@Request() request, @Body() dto: UpdateSignupFormDto) {
    const forms = await this.signupFormRepository.find({ teamName: dto.teamInfo.name });
    if (forms.some(form => form.user_id !== request.user.id)) {
      throw new HttpException('此队伍名称已被注册', 400);
    }
    await this.signupFormRepository.update(
      { user_id: request.user.id },
      {
        confirmed: dto.confirmed,
        teamName: dto.teamInfo.name,
        teamDescription: dto.teamInfo.description,
        memberInfoJson: JSON.stringify(dto.memberInfo)
      }
    );
  }
}
