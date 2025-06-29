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
