import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { useOptimistic, useTransition } from 'react';
import { Link } from 'react-router';
import { itemsApi } from '../lib/api';
import type { ItemDto, PaginatedApiResponseDto } from '../types/api';

interface OptimisticItemsListProps {
  initialItems: PaginatedApiResponseDto<ItemDto>;
  onItemDeleted?: (itemId: string) => void;
}

type OptimisticAction = { type: 'delete'; itemId: string } | { type: 'create'; item: ItemDto };

// Optimistic reducer for immediate UI updates
function optimisticReducer(items: ItemDto[], action: OptimisticAction): ItemDto[] {
  switch (action.type) {
    case 'delete':
      return items.filter((item) => item.id !== action.itemId);
    case 'create':
      return [...items, action.item];
    default:
      return items;
  }
}

export function OptimisticItemsList({ initialItems, onItemDeleted }: OptimisticItemsListProps) {
  const [isPending, startTransition] = useTransition();

  // React 19's useOptimistic - shows immediate UI changes
  const [optimisticItems, addOptimistic] = useOptimistic(initialItems.data, optimisticReducer);

  const handleDelete = async (item: ItemDto) => {
    if (!confirm(`Are you sure you want to delete "${item.attributes.name}"?`)) {
      return;
    }

    // Immediately remove from UI (optimistic update)
    addOptimistic({ type: 'delete', itemId: item.id });

    // Perform actual deletion
    startTransition(async () => {
      try {
        await itemsApi.deleteItem(item.id);
        onItemDeleted?.(item.id);
      } catch (error) {
        console.error('Delete failed:', error);
        // The optimistic update will automatically revert on error
        // You could also show a toast notification here
      }
    });
  };

  return (
    <Card variant='default'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>Items</h2>
        {initialItems.meta.pagination && (
          <div className='text-sm text-gray-600'>
            Showing {optimisticItems.length} of {initialItems.meta.pagination.total} items
          </div>
        )}
      </div>

      {optimisticItems.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <p>No items found. Create your first item above!</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {optimisticItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 bg-gray-50 rounded-lg flex justify-between items-start transition-opacity ${
                isPending ? 'opacity-60' : 'opacity-100'
              }`}
            >
              <div className='flex-1'>
                <h3 className='font-semibold text-lg'>{item.attributes.name}</h3>
                <p className='text-gray-600 mt-1'>{item.attributes.description}</p>
                <div className='flex gap-4 mt-2 text-xs text-gray-500'>
                  <span>Created: {new Date(item.attributes.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(item.attributes.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className='flex gap-2 ml-4'>
                <Link
                  to={`/items/${item.id}`}
                  className='px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors'
                >
                  View
                </Link>
                <Button
                  onClick={() => handleDelete(item)}
                  disabled={isPending}
                  variant='secondary'
                  size='sm'
                  className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50'
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {initialItems.meta.pagination && initialItems.meta.pagination.totalPages > 1 && (
        <div className='mt-6 flex justify-center items-center gap-2'>
          {initialItems.meta.pagination.hasPrev && (
            <Link
              to={`?page=${initialItems.meta.pagination.page - 1}`}
              className='px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50'
            >
              Previous
            </Link>
          )}

          <span className='px-3 py-2 text-sm text-gray-600'>
            Page {initialItems.meta.pagination.page} of {initialItems.meta.pagination.totalPages}
          </span>

          {initialItems.meta.pagination.hasNext && (
            <Link
              to={`?page=${initialItems.meta.pagination.page + 1}`}
              className='px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50'
            >
              Next
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}
