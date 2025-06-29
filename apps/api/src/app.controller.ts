import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('root')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Root endpoint - redirects to API documentation' })
  @ApiResponse({
    status: 200,
    description: 'API information',
  })
  @HttpCode(HttpStatus.OK)
  getRoot(): { message: string; apiVersion: string; documentation: string } {
    return {
      message: 'Welcome to the API! Please use versioned endpoints.',
      apiVersion: 'v1',
      documentation: '/api-docs',
    };
  }
}
