import type {
  ApiErrorResponseDto,
  ApiResponseDto,
  CreateItemDto,
  ItemDto,
  PaginatedApiResponseDto,
  PaginationQuery,
  UpdateItemDto,
} from '~/types/api';

const API_BASE_URL = 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: Array<{ field: string; code: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.success === false) {
      // Handle standardized API error response
      const errorResponse = data as ApiErrorResponseDto;
      throw new ApiError(
        errorResponse.error.code,
        errorResponse.error.message,
        response.status,
        errorResponse.error.details,
      );
    }

    // Handle non-standardized errors
    throw new ApiError(
      'UNKNOWN_ERROR',
      `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return data;
}

export const itemsApi = {
  // Get paginated list of items
  async getItems(query: PaginationQuery = {}): Promise<PaginatedApiResponseDto<ItemDto>> {
    const searchParams = new URLSearchParams();

    if (query.page) searchParams.set('page', query.page.toString());
    if (query.limit) searchParams.set('limit', query.limit.toString());
    if (query.sort) searchParams.set('sort', query.sort);
    if (query.order) searchParams.set('order', query.order);

    const queryString = searchParams.toString();
    const endpoint = `/v1/items${queryString ? `?${queryString}` : ''}`;

    return apiRequest<PaginatedApiResponseDto<ItemDto>>(endpoint);
  },

  // Get single item by ID
  async getItem(id: string): Promise<ApiResponseDto<ItemDto>> {
    return apiRequest<ApiResponseDto<ItemDto>>(`/v1/items/${id}`);
  },

  // Create new item
  async createItem(itemData: CreateItemDto): Promise<ApiResponseDto<ItemDto>> {
    return apiRequest<ApiResponseDto<ItemDto>>('/v1/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Update existing item
  async updateItem(id: string, itemData: UpdateItemDto): Promise<ApiResponseDto<ItemDto>> {
    return apiRequest<ApiResponseDto<ItemDto>>(`/v1/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(itemData),
    });
  },

  // Delete item
  async deleteItem(id: string): Promise<void> {
    await apiRequest<void>(`/v1/items/${id}`, {
      method: 'DELETE',
    });
  },
};

export const healthApi = {
  // Check API health
  async checkHealth(): Promise<ApiResponseDto<{ status: string; uptime: number }>> {
    return apiRequest<ApiResponseDto<{ status: string; uptime: number }>>('/v1/health');
  },
};
