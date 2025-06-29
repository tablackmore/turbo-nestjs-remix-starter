import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo(): { name: string; version: string; environment: string } {
    return {
      name: 'NestJS API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
