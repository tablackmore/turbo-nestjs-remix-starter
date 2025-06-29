// API Response Types
export interface ApiMetaDto {
  timestamp: string;
  version: string;
  requestId?: string;
}

export interface PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationLinksDto {
  self: string;
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

export interface ApiResponseDto<T> {
  success: boolean;
  data: T;
  meta: ApiMetaDto;
}

export interface PaginatedApiResponseDto<T> {
  success: boolean;
  data: T[];
  meta: ApiMetaDto & { pagination: PaginationMetaDto };
  links: PaginationLinksDto;
}

export interface ApiErrorDto {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

export interface ApiErrorResponseDto {
  success: false;
  error: ApiErrorDto;
  meta: ApiMetaDto;
}

// Item Types
export interface ItemAttributesDto {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemDto {
  id: string;
  type: 'item';
  attributes: ItemAttributesDto;
}

export interface CreateItemAttributesDto {
  name: string;
  description?: string;
}

export interface CreateItemDto {
  data: {
    type: 'item';
    attributes: CreateItemAttributesDto;
  };
}

export interface UpdateItemAttributesDto {
  name?: string;
  description?: string;
}

export interface UpdateItemDto {
  data: {
    type: 'item';
    attributes: UpdateItemAttributesDto;
  };
}

// Pagination Query Parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: 'id' | 'name' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}
