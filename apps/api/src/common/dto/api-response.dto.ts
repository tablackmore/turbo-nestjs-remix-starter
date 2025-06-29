import { ApiProperty } from '@nestjs/swagger';

export class ApiMetaDto {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  version: string;

  @ApiProperty({ required: false })
  requestId?: string;
}

export class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
}

export class PaginationLinksDto {
  @ApiProperty()
  self: string;

  @ApiProperty()
  first: string;

  @ApiProperty()
  last: string;

  @ApiProperty({ nullable: true })
  next: string | null;

  @ApiProperty({ nullable: true })
  prev: string | null;
}

export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty()
  meta: ApiMetaDto;
}

export class PaginatedApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: ApiMetaDto & { pagination: PaginationMetaDto };

  @ApiProperty()
  links: PaginationLinksDto;
}

export class ApiErrorDetailDto {
  @ApiProperty()
  field: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  constraint?: Record<string, string | number | boolean>;
}

export class ApiErrorDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [ApiErrorDetailDto], required: false })
  details?: ApiErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  error: ApiErrorDto;

  @ApiProperty()
  meta: ApiMetaDto;
}
