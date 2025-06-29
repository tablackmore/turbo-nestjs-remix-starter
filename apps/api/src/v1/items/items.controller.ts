import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponseDto,
  ApiResponseDto,
  PaginatedApiResponseDto,
  PaginationLinksDto,
  PaginationMetaDto,
} from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import {
  CreateItemDto,
  ItemDto,
  ItemResponseDto,
  ItemsListResponseDto,
  UpdateItemDto,
} from './dto/item.dto';
import { ItemsService } from './items.service';

@ApiTags('items')
@Controller('v1/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'Item created successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createItemDto: CreateItemDto): ApiResponseDto<ItemDto> {
    // Extract data from the DTO structure
    const { name, description } = createItemDto.data.attributes;
    const item = this.itemsService.createSimple(name, description || '');

    return {
      success: true,
      data: item,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all items with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Items retrieved successfully',
    type: ItemsListResponseDto,
  })
  findAll(@Query() query: PaginationQueryDto): PaginatedApiResponseDto<ItemDto> {
    const { items, total } = this.itemsService.findAll(query);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const sort = query.sort || 'id';
    const order = query.order || 'asc';

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Build pagination links
    const baseUrl = `/v1/items`;
    const queryParams = new URLSearchParams({
      limit: String(limit),
      sort: sort,
      order: order,
    });

    const links: PaginationLinksDto = {
      self: `${baseUrl}?page=${page}&${queryParams.toString()}`,
      first: `${baseUrl}?page=1&${queryParams.toString()}`,
      last: `${baseUrl}?page=${totalPages}&${queryParams.toString()}`,
      next: hasNext ? `${baseUrl}?page=${page + 1}&${queryParams.toString()}` : null,
      prev: hasPrev ? `${baseUrl}?page=${page - 1}&${queryParams.toString()}` : null,
    };

    const pagination: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };

    return {
      success: true,
      data: items,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        pagination,
      },
      links,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Item retrieved successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
    type: ApiErrorResponseDto,
  })
  findOne(@Param('id') id: string): ApiResponseDto<ItemDto> {
    const item = this.itemsService.findOne(id);

    return {
      success: true,
      data: item,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully',
    type: ItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: 'Validation error',
    type: ApiErrorResponseDto,
  })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): ApiResponseDto<ItemDto> {
    // Extract data from the DTO structure
    const { name, description } = updateItemDto.data.attributes;
    const item = this.itemsService.updateSimple(id, name, description);

    return {
      success: true,
      data: item,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item by ID' })
  @ApiResponse({
    status: 204,
    description: 'Item deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
    type: ApiErrorResponseDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.itemsService.remove(id);
  }
}
