import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { Repository, QueryRunner, FindManyOptions, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTransactionDto } from './dtos/transaction.dto';

import { InitiateTransferDto } from '../transfer/dtos/transfer.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionLog } from './entities/transaction-log.entity';
import { User } from '../users/entities/user.entity';
import { TransactionStatus } from 'src/common/enums/index.enum';

import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  PaginationResponse,
} from '../common/pagination/dtos/index';

import { catchErrorMessage } from '../common/helpers';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(TransactionLog)
    private readonly transactionLogRepo: Repository<TransactionLog>,
  ) {}

  private catchErrorMessage = catchErrorMessage;

  async createTransactionLog(
    payload: InitiateTransferDto,
    initiatedBy: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    // this request will fail if an existing idempotency key is set because idempotency keys are meant to be unique
    try {
      const log = new TransactionLog();
      Object.assign(log, {
        ...payload,
        status: TransactionStatus.PROCESSING,
        sender: initiatedBy,
      });
      await queryRunner.manager.insert(TransactionLog, log);
    } catch (error) {
      /**
       * catch for idempotency error
       */
      if (error.code === '23505') {
        throw new BadRequestException(
          'Duplicate Transaction: idempotency key already exist',
        );
      }
      const { message, statusCode } = this.catchErrorMessage(error);
      throw new HttpException(message, statusCode);
    }
  }

  async updateTransactionLog(
    payload: { idempotencyKey: string; sessionId: string },
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.update(
      TransactionLog,
      { idempotencyKey: payload.idempotencyKey },
      {
        status: TransactionStatus.SUCCESS,
        sessionId: payload.sessionId,
      },
    );
  }

  async createTransaction(
    payload: CreateTransactionDto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.insert(Transaction, payload);
  }

  async transactionHistories(
    paginateDto: PageOptionsDto,
    user: User,
  ): Promise<PaginationResponse> {
    try {
      const order = {};
      if (paginateDto.sort) {
        order[paginateDto.sort] = paginateDto.order ? paginateDto.order : 'ASC';
      } else {
        order['id'] = 'ASC';
      }

      const findOptions: FindManyOptions<Transaction> = {
        take: paginateDto.limit,
        skip: paginateDto.skip,
        order,
        where: {
          user: { id: user.id },
        },
      };

      if (paginateDto.query) {
        findOptions.where = [
          { reference: ILike(`%${paginateDto.query}%`), ...findOptions.where },
          { sessionId: ILike(`%${paginateDto.query}%`), ...findOptions.where },
        ];
      }

      const [res, total] = await this.transactionRepo.findAndCount(findOptions);

      const pageMetaDto = new PageMetaDto({
        total,
        pageOptionsDto: paginateDto,
      });

      const { data, meta } = new PageDto(res, pageMetaDto);
      return {
        data,
        ...meta,
      };
    } catch (error) {
      console.log(error);
      const { message, statusCode } = this.catchErrorMessage(error);
      throw new HttpException(message, statusCode);
    }
  }

  async transactionHistory(id, user: User): Promise<Transaction | any> {
    try {
      const trans = await this.transactionRepo.findOne({
        where: {
          id,
          user: { id: user.id },
        },
      });

      return trans || {};
    } catch (error) {
      console.log(error);
      const { message, statusCode } = this.catchErrorMessage(error);
      throw new HttpException(message, statusCode);
    }
  }
}
