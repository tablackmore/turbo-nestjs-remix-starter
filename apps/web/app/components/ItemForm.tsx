import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { itemsApi } from '../lib/api';
import type { CreateItemDto } from '../types/api';

interface ItemFormProps {
  onSuccess?: () => void;
}

interface ActionState {
  success: boolean;
  error: string | null;
}

// React 19 Action - automatically handles pending states and errors
async function createItemAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name?.trim()) {
    return { error: 'Name is required', success: false };
  }

  try {
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
    return { success: true, error: null };
  } catch (error) {
    console.error('Create item error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to create item',
      success: false,
    };
  }
}

export function ItemForm({ onSuccess }: ItemFormProps) {
  // React 19's useActionState - handles pending states automatically
  const [state, formAction, isPending] = useActionState(createItemAction, {
    success: false,
    error: null,
  });

  // Reset form and trigger callback on success
  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      // Form automatically resets after successful submission
    }
  }, [state.success, onSuccess]);

  return (
    <Card variant='default'>
      <h2 className='text-2xl font-semibold mb-4'>Create New Item</h2>

      {/* React 19 native form action */}
      <form action={formAction} className='space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
            Name
          </label>
          <input
            id='name'
            name='name'
            type='text'
            required
            disabled={isPending}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50'
            placeholder='Enter item name'
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            rows={3}
            disabled={isPending}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50'
            placeholder='Enter item description (optional)'
          />
        </div>

        <SubmitButton isPending={isPending} />

        {state.error && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-700 text-sm'>{state.error}</p>
          </div>
        )}

        {state.success && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-green-700 text-sm'>Item created successfully!</p>
          </div>
        )}
      </form>
    </Card>
  );
}

// React 19 useFormStatus - reads form state without prop drilling
function SubmitButton({ isPending }: { isPending: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending || isPending} variant='primary' className='w-full'>
      {pending || isPending ? 'Creating...' : 'Create Item'}
    </Button>
  );
}
