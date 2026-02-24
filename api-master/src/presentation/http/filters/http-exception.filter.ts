import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { BaseException } from '@/core/exceptions/base.exception';
import {
  ErrorCodes,
  GrpcCodesToHttp,
} from '@/core/exceptions/enums/error-codes';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();

    if (exception instanceof BaseException) {
      response.status(exception.code).send({
        message: exception.message,
        className: exception.name,
      });
    } else {
      response
        .status(
          GrpcCodesToHttp[Status[(exception as any).code]] ??
            ErrorCodes.INTERNAL,
        )
        .send({
          message: exception.message,
          className: exception.name,
        });
    }
  }
}
