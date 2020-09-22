import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserPasswordReset } from './user/user-password-reset.entity';
import { PuzzleModule } from './puzzle/puzzle.module';
import { Problem } from './puzzle/problem.entity';
import { UserAssignedProblemList } from './puzzle/user-assigned-problem-list.entity';
import { UserSolvePuzzleRecord } from './puzzle/user-solve-puzzle-record.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-rate-limiter';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.db',
      synchronize: true,
      entities: [User, UserPasswordReset, Problem, UserAssignedProblemList, UserSolvePuzzleRecord]
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_SMTP_HOST'),
          port: Number(configService.get<string>('EMAIL_SMTP_PORT')),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASSWORD')
          }
        }
      })
    }),
    RateLimiterModule.register({
      errorMessage: '访问频率过高，请稍后再试'
    }),
    UserModule,
    AuthModule,
    PuzzleModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimiterInterceptor
    }
  ]
})
export class AppModule {}
