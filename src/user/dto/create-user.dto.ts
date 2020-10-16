import { IsEmail, IsMobilePhone, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/[a-zA-Z0-9#@!~%^&*]{8,64}/)
  password: string;

  @IsMobilePhone('zh-CN')
  phoneNumber: string;
}
