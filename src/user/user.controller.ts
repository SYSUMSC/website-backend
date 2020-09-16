import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from './dto/user-login.dto';
import { UserLoginResponse } from './response/user-login.response';
import { AuthService } from '../auth/auth.service';
import { PasswordHashService } from '../auth/password-hash.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly passwordHashService: PasswordHashService
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<UserLoginResponse> {
    if (await this.userService.findOneByEmail(dto.email)) {
      throw new HttpException('此邮箱已被注册', 409);
    }
    await this.userService.create({
      email: dto.email,
      password: await this.passwordHashService.hash(dto.password),
      phone_number: dto.phoneNumber
    });
    const target = await this.userService.findOneByEmail(dto.email);
    return {
      token: this.authService.makeJwt(target)
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: UserLoginDto): Promise<UserLoginResponse> {
    const target = await this.userService.findOneByEmail(dto.email);
    if (!target) {
      throw new HttpException('此邮箱对应的用户不存在', 404);
    }
    if (
      !(await this.passwordHashService.verify(dto.password, target.password))
    ) {
      throw new HttpException('密码错误', 422);
    }
    return {
      token: this.authService.makeJwt(target)
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getProfile(@Request() request): Promise<Partial<User>> {
    return await this.userService.findOneById(request.user.id);
  }
}
