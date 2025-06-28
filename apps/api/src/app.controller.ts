import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

interface ApiDataResponse {
  message: string;
  data: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  timestamp: string;
}

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api/data')
  @ApiOperation({ summary: 'Get sample data for frontend demonstration' })
  @ApiResponse({
    status: 200,
    description: 'Sample data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  getData(): ApiDataResponse {
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
