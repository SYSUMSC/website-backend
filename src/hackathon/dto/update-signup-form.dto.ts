import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class TeamInfo {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: '队伍名称过长' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: '队伍介绍过长' })
  description: string;
}

class MemberInfo {
  @IsBoolean()
  isCaptain: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: args => `团队成员“${args.object['name']}”的名称过长` })
  name: string;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsEmail({}, { message: args => `团队成员“${args.object['name']}”的邮箱格式有误` })
  email: string;

  @IsMobilePhone(
    'zh-CN',
    {},
    { message: args => `团队成员“${args.object['name']}”的电话号码格式有误` }
  )
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: args => `团队成员“${args.object['name']}”的学校名称过长` })
  school: string;

  @IsString()
  @IsIn(['undergraduate', 'postgraduate', 'other'])
  educationalBackground: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: args => `团队成员“${args.object['name']}”的年级信息过长` })
  grade: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: args => `团队成员“${args.object['name']}”的专业名称过长` })
  major: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300, { message: args => `团队成员“${args.object['name']}”的自我介绍过长` })
  experience: string;
}

export class UpdateSignupFormDto {
  @IsBoolean()
  confirmed: boolean;

  @Type(() => TeamInfo)
  @ValidateNested()
  teamInfo: TeamInfo;

  @IsArray()
  @Type(() => MemberInfo)
  @Validate(info => info.length >= 2 && info.length <= 6, {
    message: '队伍人数必须在 2 到 6 人之间'
  })
  @Validate(info => {
    const captainCount = info.filter(member => member.isCaptain).length;
    return captainCount === 1;
  })
  @ValidateNested()
  memberInfo: MemberInfo[];
}
