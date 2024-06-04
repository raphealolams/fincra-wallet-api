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
import {
  TransactionStatus,
  TransactionType,
} from '../../common/enums/index.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Index('idx_txn_reference', { unique: true })
  @Column('varchar')
  reference: string;

  @Column({ nullable: true })
  narration: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.CR,
  })
  type: TransactionType;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PROCESSING,
  })
  status: TransactionStatus;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
  })
  balanceBeforeTransaction: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
  })
  balanceAfterTransaction: number;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: true,
    eager: false,
  }) // specify inverse side as a second parameter
  @JoinColumn()
  user: User;

  @Index('idx_txn_session_id')
  @Column({ nullable: false })
  sessionId: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @VersionColumn()
  readonly version: number;
}
