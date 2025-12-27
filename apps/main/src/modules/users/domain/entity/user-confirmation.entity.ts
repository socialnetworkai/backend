import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'userConfirmation' })
export class UserConfirmation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', default: null })
  confirmationCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date | null;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ type: 'uuid', default: null })
  passwordRecoveryCode: string | null;

  @OneToOne(() => User, (user: User) => user.confirmation)
  @JoinColumn()
  user: User;
}
