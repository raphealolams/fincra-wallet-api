import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  Repository,
  QueryRunner,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Wallet } from './entities/wallet.entity';

import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  PaginationResponse,
} from '../common/pagination/dtos/index';

@Injectable()
export class WalletService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Wallet)
    private readonly walletsRepo: Repository<Wallet>,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger(WalletService.name);
  }

  async find(options: FindManyOptions<Wallet>): Promise<Wallet[]> {
    try {
      return this.walletsRepo.find(options);
    } catch (error) {
      this.logger.error(
        `Unable to Fetch Users: ${JSON.stringify(error.message)}`,
      );
      throw new HttpException(
        'Unable to Fetch Users',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async findAll(paginateDto: PageOptionsDto): Promise<PaginationResponse> {
    try {
      const order = {};
      if (paginateDto.sort) {
        order[paginateDto.sort] = paginateDto.order ? paginateDto.order : 'ASC';
      } else {
        order['id'] = 'ASC';
      }

      const findOptions: FindManyOptions<Wallet> = {
        take: paginateDto.limit,
        skip: paginateDto.skip,
        order,
      };
      if (paginateDto.query) {
        findOptions.where = [
          { user: { firstName: ILike(`%${paginateDto.query}%`) } },
          { user: { lastName: ILike(`%${paginateDto.query}%`) } },
        ];
      }

      const [res, total] = await this.walletsRepo.findAndCount(findOptions);

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
      this.logger.error(
        `Unable to Fetch Users: ${JSON.stringify(error.message)}`,
      );
      throw new HttpException(
        'Unable to Fetch Users',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async findOneById(
    id: string,
    userId: string,
    relations?: string[],
  ): Promise<Wallet> {
    return await this.walletsRepo.findOne({
      where: { id, user: { id: userId }, isActive: true },
      relations: relations || [],
    });
  }

  async findOneWithOpts(
    options: FindOneOptions<Wallet>,
    relations?: string[],
  ): Promise<Wallet> {
    return this.walletsRepo.findOne({
      ...options,
      relations: relations || [],
    });
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<Wallet>,
    dataToUpdate: any,
    queryRunner: QueryRunner,
  ): Promise<Wallet | null> {
    let wallet: Wallet | null = null;
    wallet = await queryRunner.manager.findOne(Wallet, {
      where: {
        ...where,
      },
    });
    if (!wallet) return null;

    if (dataToUpdate.operator === '-') {
      wallet.availableBalance = +wallet.availableBalance - dataToUpdate.amount;
      wallet.ledgerBalance = +wallet.ledgerBalance - dataToUpdate.amount;
    } else {
      wallet.availableBalance = +wallet.availableBalance + dataToUpdate.amount;
      wallet.ledgerBalance = +wallet.ledgerBalance + dataToUpdate.amount;
    }

    return await queryRunner.manager.save(Wallet, wallet);
  }
}
