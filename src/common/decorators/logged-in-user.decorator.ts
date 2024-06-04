import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IRequest } from '../interfaces/user.interface';
export const LoggedInUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: IRequest = ctx.switchToHttp().getRequest();
    const { user } = request;
    return data ? user?.[data] : user;
  },
);
