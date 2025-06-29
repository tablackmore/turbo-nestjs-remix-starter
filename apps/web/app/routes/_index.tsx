import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';
import { ItemForm } from '../components/ItemForm';
import { OptimisticItemsList } from '../components/OptimisticItemsList';
import { healthApi, itemsApi } from '../lib/api';
import type { ItemDto, PaginatedApiResponseDto } from '../types/api';

export const meta: MetaFunction = () => {
  return [
    { title: 'Turbo Monorepo Demo' },
    { name: 'description', content: 'React Router v7 + NestJS API with Items Management' },
  ];
};

interface LoaderData {
  items: PaginatedApiResponseDto<ItemDto> | null;
  health: { status: string; uptime: number } | null;
  error: string | null;
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData> {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = 10;
    const sort =
      (url.searchParams.get('sort') as 'name' | 'createdAt' | 'id' | 'updatedAt') || 'createdAt';
    const order = (url.searchParams.get('order') as 'asc' | 'desc') || 'desc';

    const [itemsResponse, healthResponse] = await Promise.allSettled([
      itemsApi.getItems({ page, limit, sort, order }),
      healthApi.checkHealth(),
    ]);

    const items = itemsResponse.status === 'fulfilled' ? itemsResponse.value : null;
    const health = healthResponse.status === 'fulfilled' ? healthResponse.value?.data : null;

    return {
      items,
      health,
      error: itemsResponse.status === 'rejected' ? 'Failed to connect to API server' : null,
    };
  } catch (error) {
    console.error('Loader error:', error);
    return {
      items: null,
      health: null,
      error: 'Failed to load data',
    };
  }
}

export default function Index() {
  const { items, health, error } = useLoaderData<typeof loader>();

  const handleItemCreated = () => {
    // Refresh the page to show the new item
    window.location.reload();
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Turbo Monorepo Demo</h1>
          <p className='text-xl text-gray-600 mb-8'>
            React Router v7 + NestJS API with Items Management & Theme System
          </p>

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
          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Create New Item</h2>
            <ItemForm onSuccess={handleItemCreated} />
          </Card>

          {error ? (
            <Card variant='default'>
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
            </Card>
          ) : items ? (
            <OptimisticItemsList initialItems={items} onItemDeleted={handleItemCreated} />
          ) : (
            <Card variant='default'>
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                <span className='ml-3 text-gray-600'>Loading items...</span>
              </div>
            </Card>
          )}

          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Monorepo Features</h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
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
              <div className='p-4 bg-orange-50 rounded-lg'>
                <h3 className='font-semibold text-orange-900 mb-2'>React 19 Features</h3>
                <p className='text-orange-700 text-sm mb-3'>
                  Modern React patterns with useActionState, useOptimistic, and enhanced error
                  boundaries
                </p>
                <div className='text-xs text-orange-600 mt-2'>
                  ✓ Form Actions & Status
                  <br />✓ Optimistic Updates
                  <br />✓ Enhanced Error Handling
                  <br />✓ TypeScript Integration
                </div>
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
