import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity()
export class SignupForm {
  @PrimaryColumn()
  user_id: string;

  @Column()
  confirmed: boolean;

  @Column()
  teamName: string;

  @Column()
  teamDescription: string;

  @Column()
  memberInfoJson: string;
}
