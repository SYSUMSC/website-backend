import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/[a-zA-Z0-9#@!~%^&*]{8,64}/)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMobilePhone('zh-CN')
  phoneNumber: string;
}
