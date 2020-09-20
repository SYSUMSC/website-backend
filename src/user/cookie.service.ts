import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';

@Injectable()
export class CookieService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  issueJwt(response: Response, user: User) {
    response.cookie('token', this.authService.makeJwt(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: Number(this.configService.get('JWT_AND_COOKIE_LIFETIME')) * 1000, // seconds to milliseconds
      path: '/',
      sameSite: 'strict'
    });
  }

  clearJwt(response: Response) {
    response.clearCookie('token');
  }
}
