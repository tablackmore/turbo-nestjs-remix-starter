import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ApiError, healthApi, itemsApi } from '~/lib/api';
import type { CreateItemDto, ItemDto, PaginatedApiResponseDto } from '~/types/api';

export const meta: MetaFunction = () => {
  return [
    { title: 'Items Management - Turbo Monorepo' },
    { name: 'description', content: 'React Router v7 + NestJS Items API Demo' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ];
};

interface LoaderData {
  items: PaginatedApiResponseDto<ItemDto> | null;
  health: { status: string; uptime: number } | null;
  error: string | null;
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  const sort =
    (url.searchParams.get('sort') as 'id' | 'name' | 'createdAt' | 'updatedAt') || 'createdAt';
  const order = (url.searchParams.get('order') as 'asc' | 'desc') || 'desc';

  try {
    const [itemsResponse, healthResponse] = await Promise.all([
      itemsApi.getItems({ page, limit, sort, order }),
      healthApi
        .checkHealth()
        .catch(() => null), // Don't fail if health check fails
    ]);

    return {
      items: itemsResponse,
      health: healthResponse?.data || null,
      error: null,
    };
  } catch (error) {
    console.error('Failed to load data:', error);

    let errorMessage =
      'Unable to connect to API. Make sure the NestJS server is running on port 3001.';

    if (error instanceof ApiError) {
      errorMessage = `API Error: ${error.message} (${error.code})`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      items: null,
      health: null,
      error: errorMessage,
    };
  }
}

interface ActionData {
  success?: boolean;
  error?: string;
}

export async function action({ request }: ActionFunctionArgs): Promise<ActionData | Response> {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    if (intent === 'create') {
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;

      if (!name?.trim()) {
        return { success: false, error: 'Name is required' };
      }

      const createData: CreateItemDto = {
        data: {
          type: 'item',
          attributes: {
            name: name.trim(),
            description: description?.trim() || '',
          },
        },
      };

      await itemsApi.createItem(createData);
      return redirect('/?created=true');
    }

    if (intent === 'delete') {
      const id = formData.get('id') as string;
      if (!id) {
        return { success: false, error: 'Item ID is required' };
      }

      await itemsApi.deleteItem(id);
      return redirect('/?deleted=true');
    }

    return { success: false, error: 'Invalid action' };
  } catch (error) {
    console.error('Action error:', error);

    if (error instanceof ApiError) {
      return { success: false, error: `${error.message} (${error.code})` };
    }

    return { success: false, error: 'An unexpected error occurred' };
  }
}

export default function Index() {
  const { items, health, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Turbo Monorepo Demo</h1>
          <p className='text-xl text-gray-600 mb-8'>
            React Router v7 + NestJS API with Items Management & Theme System
          </p>

          {/* Navigation */}
          <div className='flex gap-4 justify-center mb-6'>
            <Link to='/theme-demo'>
              <Button variant='secondary' size='md'>
                🎨 Theme Demo
              </Button>
            </Link>
            <a href='http://localhost:3001/api-docs' target='_blank' rel='noopener noreferrer'>
              <Button variant='secondary' size='md'>
                📚 API Docs
              </Button>
            </a>
          </div>

          {health && (
            <div className='inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              API Healthy (Uptime: {Math.floor(health.uptime / 60)}m)
            </div>
          )}
        </header>

        <div className='grid gap-6'>
          {/* Create Item Form */}
          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Create New Item</h2>
            <Form method='post' className='space-y-4'>
              <input type='hidden' name='intent' value='create' />

              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                  Name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Enter item name'
                />
              </div>

              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Enter item description (optional)'
                />
              </div>

              <Button type='submit' disabled={isSubmitting} variant='primary' className='w-full'>
                {isSubmitting ? 'Creating...' : 'Create Item'}
              </Button>

              {actionData?.error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-red-700 text-sm'>{actionData.error}</p>
                </div>
              )}
            </Form>
          </Card>

          {/* Items List */}
          <Card variant='default'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold'>Items</h2>
              {items?.meta.pagination && (
                <div className='text-sm text-gray-600'>
                  Showing {items.data.length} of {items.meta.pagination.total} items
                </div>
              )}
            </div>

            {error ? (
              <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-700 font-medium mb-2'>API Connection Error</p>
                <p className='text-red-600 text-sm mb-3'>{error}</p>
                <div className='space-y-2'>
                  <p className='text-sm text-red-600'>
                    <strong>To start the API server:</strong>
                  </p>
                  <code className='block bg-red-100 px-3 py-2 rounded text-sm font-mono'>
                    npm run dev
                  </code>
                </div>
              </div>
            ) : items ? (
              <div>
                {items.data.length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    <p>No items found. Create your first item above!</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {items.data.map((item) => (
                      <div
                        key={item.id}
                        className='p-4 bg-gray-50 rounded-lg flex justify-between items-start'
                      >
                        <div className='flex-1'>
                          <h3 className='font-semibold text-lg'>{item.attributes.name}</h3>
                          <p className='text-gray-600 mt-1'>{item.attributes.description}</p>
                          <div className='flex gap-4 mt-2 text-xs text-gray-500'>
                            <span>
                              Created: {new Date(item.attributes.createdAt).toLocaleDateString()}
                            </span>
                            <span>
                              Updated: {new Date(item.attributes.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className='flex gap-2 ml-4'>
                          <Link
                            to={`/items/${item.id}`}
                            className='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors'
                          >
                            View
                          </Link>
                          <Form method='post' className='inline'>
                            <input type='hidden' name='intent' value='delete' />
                            <input type='hidden' name='id' value={item.id} />
                            <button
                              type='submit'
                              className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors'
                              onClick={(e) => {
                                if (
                                  !confirm(
                                    `Are you sure you want to delete "${item.attributes.name}"?`,
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              Delete
                            </button>
                          </Form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {items.meta.pagination && items.meta.pagination.totalPages > 1 && (
                  <div className='mt-6 flex justify-center items-center gap-2'>
                    {items.meta.pagination.hasPrev && (
                      <Link
                        to={`?page=${items.meta.pagination.page - 1}`}
                        className='px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50'
                      >
                        Previous
                      </Link>
                    )}

                    <span className='px-3 py-2 text-sm text-gray-600'>
                      Page {items.meta.pagination.page} of {items.meta.pagination.totalPages}
                    </span>

                    {items.meta.pagination.hasNext && (
                      <Link
                        to={`?page=${items.meta.pagination.page + 1}`}
                        className='px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50'
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                <span className='ml-3 text-gray-600'>Loading items...</span>
              </div>
            )}
          </Card>

          {/* Features Overview */}
          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Monorepo Features</h2>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='p-4 bg-blue-50 rounded-lg'>
                <h3 className='font-semibold text-blue-900 mb-2'>Items API</h3>
                <p className='text-blue-700 text-sm mb-3'>
                  Full CRUD operations with pagination, sorting, and validation
                </p>
                <div className='text-xs text-blue-600'>
                  ✓ Create, Read, Update, Delete
                  <br />✓ Pagination & Sorting
                  <br />✓ TypeScript Types
                  <br />✓ Error Handling
                </div>
              </div>
              <div className='p-4 bg-purple-50 rounded-lg'>
                <h3 className='font-semibold text-purple-900 mb-2'>Theme System</h3>
                <p className='text-purple-700 text-sm mb-3'>
                  Clean CSS custom properties with semantic color mapping
                </p>
                <Link to='/theme-demo'>
                  <Button variant='secondary' size='sm' className='w-full'>
                    Explore Theme Demo →
                  </Button>
                </Link>
              </div>
              <div className='p-4 bg-green-50 rounded-lg'>
                <h3 className='font-semibold text-green-900 mb-2'>API Documentation</h3>
                <p className='text-green-700 text-sm mb-3'>
                  Interactive OpenAPI documentation with examples
                </p>
                <a
                  href='http://localhost:3001/api-docs'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block'
                >
                  <Button variant='secondary' size='sm' className='w-full'>
                    View API Docs →
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* API Information */}
          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>API Endpoints</h2>
            <div className='space-y-2 text-sm font-mono'>
              <div className='flex gap-2'>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>GET</span>
                <span>/v1/items - List items with pagination</span>
              </div>
              <div className='flex gap-2'>
                <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded'>POST</span>
                <span>/v1/items - Create new item</span>
              </div>
              <div className='flex gap-2'>
                <span className='px-2 py-1 bg-green-100 text-green-800 rounded'>GET</span>
                <span>/v1/items/:id - Get single item</span>
              </div>
              <div className='flex gap-2'>
                <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded'>PATCH</span>
                <span>/v1/items/:id - Update item</span>
              </div>
              <div className='flex gap-2'>
                <span className='px-2 py-1 bg-red-100 text-red-800 rounded'>DELETE</span>
                <span>/v1/items/:id - Delete item</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
