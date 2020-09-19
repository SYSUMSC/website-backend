import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserPasswordReset } from './user/user-password-reset.entity';
import { PuzzleModule } from './puzzle/puzzle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      synchronize: true,
      entities: [User, UserPasswordReset]
    }),
    UserModule,
    AuthModule,
    PuzzleModule
  ]
})
export class AppModule {}
