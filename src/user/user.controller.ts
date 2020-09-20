import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
  Request,
  Res
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from './dto/user-login.dto';
import { PasswordHashService } from '../auth/password-hash.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.entity';
import { ResetRequestDto } from './dto/reset-request.dto';
import { ResetDto } from './dto/reset.dto';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPasswordReset } from './user-password-reset.entity';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CookieService } from './cookie.service';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserPasswordReset)
    private readonly userPasswordResetRepository: Repository<UserPasswordReset>,
    private readonly configService: ConfigService,
    private readonly passwordHashService: PasswordHashService,
    private readonly cookieService: CookieService
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getProfile(@Request() request): Promise<Partial<User>> {
    return await this.userRepository.findOne({ id: request.user.id });
  }

  @Post('register')
  @HttpCode(204)
  async register(@Body() dto: CreateUserDto, @Res() response: Response) {
    if (await this.userRepository.findOne({ email: dto.email })) {
      throw new HttpException('此邮箱已被注册', 409);
    }
    await this.userRepository.insert({
      email: dto.email,
      password: await this.passwordHashService.hash(dto.password),
      phone_number: dto.phoneNumber
    });
    const target = await this.userRepository.findOne({ email: dto.email });
    this.cookieService.issueJwt(response, target);
    response.send();
  }

  @Post('login')
  @HttpCode(204)
  async login(@Body() dto: UserLoginDto, @Res() response: Response) {
    const target = await this.userRepository.findOne({ email: dto.email });
    if (!target) {
      throw new HttpException('此邮箱对应的用户不存在', 404);
    }
    if (!(await this.passwordHashService.verify(dto.password, target.password))) {
      throw new HttpException('密码错误', 422);
    }
    this.cookieService.issueJwt(response, target);
    response.send();
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Res() response: Response) {
    this.cookieService.clearJwt(response);
    response.send();
  }

  @Post('reset-request')
  @HttpCode(204)
  async resetRequest(@Body() dto: ResetRequestDto) {
    const target = await this.userRepository.findOne({ email: dto.email });
    if (!target) {
      throw new HttpException('此邮箱对应的用户不存在', 404);
    }
    await this.userPasswordResetRepository.delete({ userId: target.id });
    const token = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(
      token,
      Number(this.configService.get<number>('USER_PASSWORD_RESET_TOKEN_SALT_ROUNDS'))
    );
    await this.userPasswordResetRepository.insert({
      userId: target.id,
      token: hashedToken,
      date: new Date()
    });
  }

  @Post('reset')
  @HttpCode(204)
  async reset(@Body() dto: ResetDto) {
    const target = await this.userRepository.findOne({ email: dto.email });
    if (!target) {
      throw new HttpException('验证码无效或已过期，重置密码操作无效', 400);
    }
    const reset = await this.userPasswordResetRepository.findOne({ userId: target.id });
    const match = reset ? await bcrypt.compare(dto.token, reset.token) : false;
    const outdated = reset
      ? (Date.now() - reset.date.getTime()) / 1000 >=
        Number(this.configService.get<number>('USER_PASSWORD_RESET_TOKEN_VALID_DURATION'))
      : true;
    if (!reset || !match || outdated) {
      throw new HttpException('验证码无效或已过期，重置密码操作无效', 400);
    }
    const hash = await bcrypt.hash(
      dto.password,
      Number(this.configService.get<number>('USER_PASSWORD_RESET_TOKEN_SALT_ROUNDS'))
    );
    await this.userPasswordResetRepository.delete({ id: reset.id });
    await this.userRepository.update({ id: target.id }, { password: hash });
  }
}
