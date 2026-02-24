import { BaseException } from './base.exception';
import { ErrorCodes } from './enums/error-codes';

export class InvalidArgumentException extends BaseException {
  constructor(message: string) {
    super(ErrorCodes.INVALID_ARGUMENT, InvalidArgumentException.name, message);
  }
}
