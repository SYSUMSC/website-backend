import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UserPasswordReset } from './user-password-reset.entity';
import { CookieService } from './cookie.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPasswordReset]), AuthModule],
  controllers: [UserController],
  providers: [CookieService]
})
export class UserModule {}
