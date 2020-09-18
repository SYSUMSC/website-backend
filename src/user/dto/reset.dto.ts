import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ResetDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/[a-zA-Z0-9#@!~%^&*]{8,64}/)
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
