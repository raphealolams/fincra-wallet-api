import { HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
export * from './string';

export const amountToLowestForm = (amount: number): number => {
  return amount * 100;
};

export const amountToHighestForm = (amount: number): number => {
  return amount / 100;
};

export const appendSignToPhoneNumber = (phoneNumber) =>
  phoneNumber.indexOf('+', '0') !== -1 ? `${phoneNumber}` : `+${phoneNumber}`;

export const generateTransactionReference = (): number =>
  Number(`${Date.now().toString().slice(0, 18)}`);

export const generateSessionId = (): string => uuidv4();

export const catchErrorMessage = (
  error: any,
): {
  message: string;
  statusCode: number;
} => {
  let message = error.message;
  if (Array.isArray(message)) {
    message = message[0];
  }
  const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  return {
    message:
      statusCode === 500
        ? 'An unknown error occurred. please contact support'
        : message,
    statusCode,
  };
};

export const getRealIP = (request) => {
  const realIP =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  const ip = typeof realIP === 'string' ? realIP.split(',')[0] : realIP[0];
  return ip;
};
