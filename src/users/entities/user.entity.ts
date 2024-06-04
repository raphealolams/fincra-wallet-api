import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../common/enums/index.enum';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Index()
  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    eager: false,
  })
  wallet: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    nullable: false,
    eager: false,
  }) // specify inverse side as a second parameter
  @JoinColumn()
  transactions: Transaction[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @VersionColumn()
  readonly version: number;

  static comparePasswords(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  toJSON() {
    return { ...this, password: undefined, mfaSecret: undefined };
  }
}
