import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashService {
  constructor(private readonly configService: ConfigService) {}

  async verify(source: string, target: string) {
    return await bcrypt.compare(source, target);
  }

  async hash(source: string) {
    return await bcrypt.hash(source, Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS')));
  }
}
