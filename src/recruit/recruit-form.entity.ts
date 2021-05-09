import { Column, Entity, PrimaryColumn } from 'typeorm';

export type Gender = typeof GENDER_MALE | typeof GENDER_FEMALE | typeof GENDER_OTHER;
export const GENDER_MALE = 0;
export const GENDER_FEMALE = 1;
export const GENDER_OTHER = 2;

@Entity()
export class RecruitForm {
  @PrimaryColumn()
  user_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column('smallint', { nullable: true, default: GENDER_MALE })
  gender: Gender;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  college: string;

  @Column({ nullable: true })
  student_id: string;

  @Column({ nullable: true })
  political_role: string;

  @Column({ nullable: true })
  self_intro: string;

  @Column({ nullable: true })
  wishes: string;
}
