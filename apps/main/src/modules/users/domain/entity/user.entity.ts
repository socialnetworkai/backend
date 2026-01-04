import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserConfirmation } from './user-confirmation.entity';
import { CreateUserInputDto } from '../../api/input-dto/create-user-input.dto';
import { UserViewDto } from '../../api/output-dto/user-view.dto';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true, collation: 'C' })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  hashPassword: string | null = null;

  @OneToOne(() => UserConfirmation, (uk: UserConfirmation) => uk.user, {
    cascade: true,
  })
  confirmation: UserConfirmation;

  static create(login: string, email: string, hash?: string | null) {
    const user = new this();
    user.login = login;
    user.email = email;
    user.hashPassword = hash ?? null;

    return user;
  }

  static createConfirmedUser(dto: CreateUserInputDto): User {
    const user: User = this.create(dto.login, dto.email, null);

    const confirmation = new UserConfirmation();
    confirmation.user = user;
    confirmation.confirmationCode = null;
    confirmation.expirationDate = null;
    confirmation.isConfirmed = true;
    confirmation.isAgreeWithPrivacy = true;

    user.confirmation = confirmation;
    return user;
  }

  static createIsNotConfirmedUser(
    login: string,
    email: string,
    hash: string | null,
    confirmationCode: string,
    expirationDate: Date,
  ): User {
    const user: User = this.create(login, email, hash);

    const confirmation = new UserConfirmation();
    confirmation.user = user;
    confirmation.confirmationCode = confirmationCode;
    confirmation.expirationDate = expirationDate;
    confirmation.isConfirmed = false;
    confirmation.isAgreeWithPrivacy = true;

    user.confirmation = confirmation;
    return user;
  }

  static userViewMapper(user: User): UserViewDto {
    const mappedUser = new User();

    mappedUser.id = user.id;
    mappedUser.email = user.email;
    mappedUser.login = user.login;
    mappedUser.confirmation = user.confirmation;

    return mappedUser;
  }
}
