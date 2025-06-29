import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class ItemAttributesDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class ItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  attributes: ItemAttributesDto;
}

// Specific response DTOs for Swagger documentation
export class ItemMetaDto {
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

export class ItemsMetaDto extends ItemMetaDto {
  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
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

export class ItemResponseDto {
  @ApiProperty({ default: true })
  success: boolean;

  @ApiProperty({ type: ItemDto })
  data: ItemDto;

  @ApiProperty({ type: ItemMetaDto })
  meta: ItemMetaDto;
}

export class ItemsListResponseDto {
  @ApiProperty({ default: true })
  success: boolean;

  @ApiProperty({ type: [ItemDto] })
  data: ItemDto[];

  @ApiProperty({ type: ItemsMetaDto })
  meta: ItemsMetaDto;

  @ApiProperty({ type: PaginationLinksDto })
  links: PaginationLinksDto;
}

export class CreateItemAttributesDto {
  @ApiProperty({ description: 'Item name', minLength: 1 })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Item description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateItemDataDto {
  @ApiProperty({ default: 'item' })
  @IsOptional()
  @IsString()
  type: string = 'item';

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateItemAttributesDto)
  attributes: CreateItemAttributesDto;
}

export class CreateItemDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateItemDataDto)
  data: CreateItemDataDto;
}

export class UpdateItemAttributesDto {
  @ApiProperty({ description: 'Item name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({ description: 'Item description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateItemDataDto {
  @ApiProperty({ default: 'item' })
  type: string = 'item';

  @ApiProperty()
  attributes: UpdateItemAttributesDto;
}

export class UpdateItemDto {
  @ApiProperty()
  data: UpdateItemDataDto;
}
