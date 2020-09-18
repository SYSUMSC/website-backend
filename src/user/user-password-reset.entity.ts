import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserPasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  date: Date;
}
