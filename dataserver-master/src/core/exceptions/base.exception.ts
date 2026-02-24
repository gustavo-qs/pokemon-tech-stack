import { ErrorCodes } from './enums/error-codes';

export abstract class BaseException extends Error {
  constructor(
    readonly code: ErrorCodes,
    readonly name: string,
    message: string,
  ) {
    super(message);
  }
}
