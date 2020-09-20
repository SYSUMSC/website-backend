import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt.payload';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.['token'] || null,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_KEY')
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.id };
  }
}
