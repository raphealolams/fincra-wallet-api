import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getRealIP } from '../helpers/index';

function removeSensitiveData(body) {
  const filterOut = [
    'otp',
    'password',
    'bvn',
    'pin',
    'cvv',
    'pan',
    'bvn',
    'confirmPassword',
    'currentPassword',
  ];
  const newBody = {};
  Object.keys(body).forEach((item) => {
    if (filterOut.includes(item)) {
      newBody[item] = '*********';
    } else {
      newBody[item] = body[item];
    }
  });
  return newBody;
}

function getDurationInMilliseconds(start) {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}
@Injectable()
class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const start = process.hrtime();
    const { method, originalUrl: url, body, query } = request;

    const ip = getRealIP(request);

    const requestId = request.headers['request-id'];
    const now = new Date().toISOString();
    const reqLogData = {
      method,
      url,
      timestamp: now,
      body: JSON.stringify(removeSensitiveData(body)),
      query: JSON.stringify(query),
      requestId,
      ip,
    };
    this.logger.log('================= REQUEST ==================');
    this.logger.log(JSON.stringify(reqLogData));
    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const durationInMilliseconds = getDurationInMilliseconds(start);
      const resLogData = JSON.stringify({
        method,
        url,
        timestamp: new Date().toISOString(),
        statusCode: statusCode,
        message: statusMessage,
        requestId,
        ip,
        timeTaken: `${durationInMilliseconds.toLocaleString()} ms`,
      });

      this.logger.log('================= RESPONSE ==================');

      if (statusCode >= 500) {
        return this.logger.error(resLogData);
      }

      if (statusCode >= 400) {
        return this.logger.warn(resLogData);
      }

      return this.logger.log(resLogData);
    });
    next();
  }
}

export default LogsMiddleware;
