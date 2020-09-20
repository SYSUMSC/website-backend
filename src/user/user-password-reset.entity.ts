import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserPasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  date: Date;
}
