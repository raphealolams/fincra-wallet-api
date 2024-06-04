import { BadRequestException, Injectable, HttpException } from '@nestjs/common';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { InitiateTransferDto } from './dtos/transfer.dto';
import { UserService } from '../users/user.service';
import { TransactionService } from '../transaction/transaction.service';
import { WalletService } from '../wallet/wallet.service';
import { User } from '../users/entities/user.entity';
import { TransactionType, TransactionStatus } from '../common/enums/index.enum';

import {
  amountToLowestForm,
  generateSessionId,
  generateTransactionReference,
  catchErrorMessage,
} from '../common/helpers/index';

@Injectable()
export class TransferService {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
    private dataSource: DataSource,
  ) {}

  private catchErrorMessage = catchErrorMessage;
  async initiateWalletTransfer(
    payload: InitiateTransferDto,
    user: User,
  ): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /**
       * make sure users cannot transfer to themselves
       */
      const userIsRecipient = user.id === payload.recipient;
      if (userIsRecipient)
        throw new BadRequestException(
          'You are not allowed to make a transfer to yourself.',
        );

      if (!user.pin) throw new BadRequestException('Pin Setup required!');

      const isValidPin = User.comparePasswords(`${payload.pin}`, user.pin);

      if (!isValidPin) throw new BadRequestException('Incorrect Pin!');

      /**
       * idempotency:
       *
       * This will fail and will throw under the catch block if the user sends an existing idempotency key
       * This is a better way to make sure users are not repeating transacion maybe cos of network isues or UX bug on the client
       */
      await this.transactionService.createTransactionLog(
        payload,
        user.id,
        queryRunner,
      );

      /**
       * Note: Amount is expected to be passed in naira as I'm currently doing Kobo conversion
       * s
       * A lot of the validation done here has been explained in the whimsical
       * document provided
       */

      const amount = amountToLowestForm(payload.amount);

      const recipient = await this.userService.findOneById(payload.recipient);

      const sender = await this.walletService.findOneAndUpdate(
        { user: { id: user.id }, availableBalance: MoreThanOrEqual(amount) },
        { operator: '-', amount },
        queryRunner,
      );

      if (!sender) {
        throw new BadRequestException('Insufficient Balance.');
      }

      // Update receiver's wallet
      const receiver = await this.walletService.findOneAndUpdate(
        { user: { id: recipient.id } },
        { operator: '+', amount },
        queryRunner,
      );

      const sessionId = generateSessionId();

      /**
       * Create a debit transaction history for the sender,
       */
      await this.transactionService.createTransaction(
        {
          type: TransactionType.DR,
          balanceAfterTransaction: +sender.availableBalance,
          balanceBeforeTransaction: +sender.availableBalance + amount,
          amount: +amount,
          user: user,
          sessionId,
          reference: generateTransactionReference(),
          status: TransactionStatus.SUCCESS,
        },
        queryRunner,
      );

      /**
       * Create a credit transaction history for the receiver
       */
      await this.transactionService.createTransaction(
        {
          type: TransactionType.CR,
          balanceAfterTransaction: +receiver.availableBalance,
          balanceBeforeTransaction: +receiver.availableBalance - amount,
          amount: +amount,
          user: recipient,
          sessionId,
          reference: generateTransactionReference(),
          status: TransactionStatus.SUCCESS,
        },
        queryRunner,
      );

      await this.transactionService.updateTransactionLog(
        {
          idempotencyKey: payload.idempotencyKey,
          sessionId,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      const { message, statusCode } = this.catchErrorMessage(error);
      throw new HttpException(message, statusCode);
    } finally {
      await queryRunner.release();
    }
  }
}
