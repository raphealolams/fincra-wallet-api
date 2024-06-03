export * from './page-meta.dto';
export * from './page-options.dto';
export * from './page.dto';
import { User } from '../../../users/entities/users.entity';

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: User[];
}
