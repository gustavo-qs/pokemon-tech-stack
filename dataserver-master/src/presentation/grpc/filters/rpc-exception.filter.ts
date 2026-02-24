import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { status as GrpcStatusCode } from '@grpc/grpc-js';
import { BaseException } from '@/core/exceptions/base.exception';

export type GrpcExceptionPayload = {
  message: string;
  code: GrpcStatusCode | number;
};

@Catch(Error)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<unknown> {
    if (exception instanceof BaseException) {
      return throwError(() => ({
        message: JSON.stringify({
          message: exception.message,
          className: exception.name,
        }),
        code: exception.code,
      }));
    } else {
      return throwError(() => ({
        message: JSON.stringify({
          message: exception.message,
          className: exception.name,
        }),
        code: GrpcStatusCode.INTERNAL,
      }));
    }
  }
}
