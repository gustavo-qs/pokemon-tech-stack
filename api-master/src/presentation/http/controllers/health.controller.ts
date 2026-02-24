import { Controller, Get } from '@nestjs/common';
import {
  GRPCHealthIndicator,
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';

@Controller('healthcheck')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private indicator: GRPCHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.indicator.checkService('dataserver', 'grpc.health.v1', {
          timeout: 1500,
          package: 'grpc.health.v1',
          url: process.env.SUPPORT_DATASERVER_IP,
        }),
    ]);
  }
}
