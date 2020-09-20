import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSolvePuzzleRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: Date;

  @Column()
  problem_id: number;

  @Column()
  user_id: string;

  @Column()
  passed: boolean;

  @Column()
  answer: string;
}
