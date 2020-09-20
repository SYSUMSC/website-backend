import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

// sqlite does not support enum :(
export type ProblemLevel =
  | typeof PROBLEM_LEVEL_LOW
  | typeof PROBLEM_LEVEL_MEDIUM
  | typeof PROBLEM_LEVEL_HIGH;
export const PROBLEM_LEVEL_LOW = 0;
export const PROBLEM_LEVEL_MEDIUM = 1;
export const PROBLEM_LEVEL_HIGH = 2;

@Entity()
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('smallint')
  level: ProblemLevel;

  @Column()
  @Exclude()
  answer: string;

  @Column()
  content_html: string;

  @Column({ nullable: true })
  script: string;

  @Column({ nullable: true })
  @Exclude()
  server_side_script: string;
}
