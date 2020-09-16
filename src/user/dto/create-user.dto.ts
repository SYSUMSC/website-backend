import { IsEmail, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsMobilePhone('zh-CN')
  phoneNumber: string;
}
