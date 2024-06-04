import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
  })
  availableBalance: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
  })
  ledgerBalance: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @VersionColumn()
  readonly version: number;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;

  toJSON() {
    return {
      ...this,
      availableBalance: +this.availableBalance / 100,
      ledgerBalance: +this.ledgerBalance / 100,
    };
  }
}
