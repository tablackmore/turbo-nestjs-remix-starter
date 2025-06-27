import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/data')
  getData() {
    return {
      message: 'Hello from NestJS API!',
      data: [
        { id: 1, name: 'Item 1', description: 'This is item 1' },
        { id: 2, name: 'Item 2', description: 'This is item 2' },
        { id: 3, name: 'Item 3', description: 'This is item 3' },
      ],
      timestamp: new Date().toISOString(),
    };
  }
}
