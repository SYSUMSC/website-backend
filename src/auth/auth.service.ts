import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  makeJwt(user: User) {
    const payload = { id: user.id } as JwtPayload;
    return this.jwtService.sign(payload);
  }
}
