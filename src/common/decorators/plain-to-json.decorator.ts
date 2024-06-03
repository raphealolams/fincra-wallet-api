import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';

export const PlainToJsonBody = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      return JSON.parse(request.body.toString());
    } catch (error) {
      throw new HttpException(
        `Body is not text/plain buffer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  },
);
