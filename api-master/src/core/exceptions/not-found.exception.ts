import { BaseException } from './base.exception';
import { ErrorCodes } from './enums/error-codes';

export class NotFoundException extends BaseException {
  constructor(message?: string) {
    super(ErrorCodes.NOT_FOUND, NotFoundException.name, message ?? 'Not Found');
  }
}
