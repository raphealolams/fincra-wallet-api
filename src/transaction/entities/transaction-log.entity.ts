import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TransactionStatus } from '../../common/enums/index.enum';
@Entity()
export class TransactionLog {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Index('id_txn_log_idempotency_key', { unique: true })
  @Column({ nullable: false })
  idempotencyKey: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
  })
  amount: number;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  recipient: User;

  @Column({ nullable: false })
  narration: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PROCESSING,
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  sessionId: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn()
  sender: User;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @VersionColumn()
  readonly version: number;

  toJSON() {
    return {
      ...this,
      amount: +this.amount / 100,
    };
  }
}
