import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, ILike, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from './entities/user.entity';

import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  PaginationResponse,
} from '../common/pagination/dtos/index';

@Injectable()
export class UserService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {
    this.logger = new Logger(UserService.name);
  }

  async find(options: FindManyOptions<User>): Promise<User[]> {
    try {
      return this.usersRepo.find(options);
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

      const findOptions: FindManyOptions<User> = {
        take: paginateDto.limit,
        skip: paginateDto.skip,
        order,
      };
      if (paginateDto.query) {
        findOptions.where = [
          { email: ILike(`%${paginateDto.query}%`) },
          { firstName: ILike(`%${paginateDto.query}%`) },
          { lastName: ILike(`%${paginateDto.query}%`) },
        ];
      }

      const [res, total] = await this.usersRepo.findAndCount(findOptions);

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

  async findOneById(id: string, relations?: string[]): Promise<User> {
    return await this.usersRepo.findOneOrFail({
      where: { id, isActive: true },
      relations: relations || [],
    });
  }

  async findOneWithOpts(
    options: FindOneOptions<User>,
    relations?: string[],
  ): Promise<User> {
    return this.usersRepo.findOne({
      ...options,
      relations: relations || [],
    });
  }

  async update(where: any, dataToUpdate) {
    await this.usersRepo.update(
      {
        ...where,
      },
      dataToUpdate,
    );
  }
}
