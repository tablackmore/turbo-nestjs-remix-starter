import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from 'react-router';
import { ApiError, itemsApi } from '~/lib/api';
import type { ApiResponseDto, ItemDto, UpdateItemDto } from '~/types/api';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.item ? `${data.item.data.attributes.name} - Items` : 'Item - Items';
  return [{ title }, { name: 'description', content: 'View and edit item details' }];
};

interface LoaderData {
  item: ApiResponseDto<ItemDto> | null;
  error: string | null;
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const { id } = params;

  if (!id) {
    throw new Response('Item ID is required', { status: 400 });
  }

  try {
    const item = await itemsApi.getItem(id);
    return { item, error: null };
  } catch (error) {
    console.error('Failed to load item:', error);

    if (error instanceof ApiError && error.status === 404) {
      throw new Response('Item not found', { status: 404 });
    }

    let errorMessage = 'Unable to load item';
    if (error instanceof ApiError) {
      errorMessage = `${error.message} (${error.code})`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { item: null, error: errorMessage };
  }
}

interface ActionData {
  success?: boolean;
  error?: string;
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionData | Response> {
  const { id } = params;

  if (!id) {
    return { success: false, error: 'Item ID is required' };
  }

  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    if (intent === 'update') {
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;

      if (!name?.trim()) {
        return { success: false, error: 'Name is required' };
      }

      const updateData: UpdateItemDto = {
        data: {
          type: 'item',
          attributes: {
            name: name.trim(),
            description: description?.trim(),
          },
        },
      };

      await itemsApi.updateItem(id, updateData);
      return redirect(`/items/${id}?updated=true`);
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

export default function ItemDetail() {
  const { item, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-2xl mx-auto'>
          <Card variant='default'>
            <h1 className='text-2xl font-bold text-red-600 mb-4'>Error Loading Item</h1>
            <p className='text-gray-600 mb-4'>{error}</p>
            <Link to='/'>
              <Button variant='primary'>Back to Items</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4'>
        <div className='max-w-2xl mx-auto flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-gray-600'>Loading item...</span>
        </div>
      </div>
    );
  }

  const itemData = item.data;

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-6'>
          <Link to='/' className='text-blue-600 hover:text-blue-800 underline'>
            ← Back to Items
          </Link>
        </div>

        <div className='space-y-6'>
          {/* Item Details */}
          <Card variant='default'>
            <div className='flex justify-between items-start mb-4'>
              <h1 className='text-3xl font-bold text-gray-900'>{itemData.attributes.name}</h1>
              <span className='px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded'>
                ID: {itemData.id}
              </span>
            </div>

            <p className='text-gray-600 mb-6'>
              {itemData.attributes.description || 'No description provided'}
            </p>

            <div className='grid grid-cols-2 gap-4 text-sm text-gray-500 border-t pt-4'>
              <div>
                <span className='font-medium'>Created:</span>
                <br />
                {new Date(itemData.attributes.createdAt).toLocaleString()}
              </div>
              <div>
                <span className='font-medium'>Last Updated:</span>
                <br />
                {new Date(itemData.attributes.updatedAt).toLocaleString()}
              </div>
            </div>
          </Card>

          {/* Edit Form */}
          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Edit Item</h2>
            <Form method='post' className='space-y-4'>
              <input type='hidden' name='intent' value='update' />

              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                  Name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  defaultValue={itemData.attributes.name}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                  rows={4}
                  defaultValue={itemData.attributes.description}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Enter item description'
                />
              </div>

              <div className='flex gap-3'>
                <Button type='submit' disabled={isSubmitting} variant='primary'>
                  {isSubmitting ? 'Updating...' : 'Update Item'}
                </Button>

                <Link to='/'>
                  <Button variant='secondary'>Cancel</Button>
                </Link>
              </div>

              {actionData?.error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-red-700 text-sm'>{actionData.error}</p>
                </div>
              )}
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
