import { Gender, GENDER_FEMALE, GENDER_MALE, GENDER_OTHER } from '../recruit-form.entity';
import {
  IsEmail,
  IsIn,
  IsMobilePhone,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength
} from 'class-validator';

export class UpdateRecruitFormDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsIn([GENDER_MALE, GENDER_FEMALE, GENDER_OTHER])
  gender: Gender;

  @IsEmail()
  email: string;

  @IsMobilePhone('zh-CN', {}, { message: '电话号码格式不正确' })
  phoneNumber: string;

  @IsString()
  grade: string;

  @IsString()
  college: string;

  @IsNumberString()
  studentId: string;

  @IsString()
  politicalRole: string;

  @IsString()
  @MaxLength(1000)
  selfIntroduction: string;

  @IsString()
  @MaxLength(1000)
  wishes: string;
}
