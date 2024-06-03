import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// Custom exceptions response is based off the Jsend spec
// https://github.com/omniti-labs/jsend
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionStatus = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const isString = typeof exceptionResponse === 'string';

    // The HttpException response has a specific object structure
    let message = isString ? exceptionResponse : exceptionResponse.error;
    const data = isString ? {} : exceptionResponse.message;
    if (message === 'Bad Request' && Array.isArray(data)) {
      [message] = data;
    }

    const resPayload: any = {
      status: false,
      message,
      data,
      code: exceptionStatus,
    };

    if (exceptionStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      try {
        message = JSON.parse(exceptionResponse);
        resPayload.message = message?.report;
        resPayload.devLog = {
          source: message?.source,
          reason: message?.reason,
          report: message?.report,
        };
      } catch {
        // console.log(error);
      }
    }

    response.status(exceptionStatus).json(resPayload);
  }
}
