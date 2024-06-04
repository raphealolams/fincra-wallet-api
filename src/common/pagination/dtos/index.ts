export * from './page-meta.dto';
export * from './page-options.dto';
export * from './page.dto';
import { User } from '../../../users/entities/user.entity';
import { Transaction } from '../../../transaction/entities/transaction.entity';
import { Wallet } from '../../../wallet/entities/wallet.entity';
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: User[] | Transaction[] | Wallet[];
}
