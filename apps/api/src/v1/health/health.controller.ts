import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

class HealthData {
  @ApiProperty()
  status: string;

  @ApiProperty()
  uptime: number;
}

class HealthMetaDto {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  version: string;
}

class HealthResponseDto {
  @ApiProperty({ default: true })
  success: boolean;

  @ApiProperty({ type: HealthData })
  data: HealthData;

  @ApiProperty({ type: HealthMetaDto })
  meta: HealthMetaDto;
}

@ApiTags('health')
@Controller('v1/health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    type: HealthResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  check(): ApiResponseDto<HealthData> {
    return {
      success: true,
      data: {
        status: 'healthy',
        uptime: process.uptime(),
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }
}
