/* eslint-disable @typescript-eslint/no-unused-vars */
import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';

enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
}

interface HealthCheckRequest {
  service: string;
}

interface HealthCheckResponse {
  status: ServingStatus;
}

@Controller()
export class HealthController {
  constructor() {}

  @GrpcMethod('Health', 'Check')
  check(req: HealthCheckRequest): HealthCheckResponse {
    return {
      status: ServingStatus.SERVING,
    };
  }

  @GrpcMethod('Health', 'Watch')
  watch(req: HealthCheckRequest): Observable<HealthCheckResponse> {
    const observable = new Observable<HealthCheckResponse>((subscriber) => {
      subscriber.next({
        status: ServingStatus.SERVING,
      });
    });

    return observable;
  }
}
