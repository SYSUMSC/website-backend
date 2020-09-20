import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserAssignedProblemList {
  @PrimaryColumn()
  user_id: string;

  @Column('simple-array')
  problem_ids: string[];
}
