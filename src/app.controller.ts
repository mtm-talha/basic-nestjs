import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  @SkipThrottle()
  healthCheck(): string {
    return `App is running ${new Date().toISOString()}`;
  }

  @Get('throttle-check')
  throttleCheck(): string {
    return `API is connected Date ${new Date()}!`;
  }
}
