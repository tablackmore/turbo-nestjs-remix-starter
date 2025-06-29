import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import type { MetaFunction } from 'react-router';
import { Link, useLoaderData } from 'react-router';

export const meta: MetaFunction = () => {
  return [
    { title: 'Turbo Monorepo Demo' },
    { name: 'description', content: 'React Router v7 + NestJS + UI Library Demo' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ];
};

interface ApiData {
  message: string;
  data: Array<{
    id: number;
    name: string;
    description: string;
  }>;
  timestamp: string;
}

interface LoaderData {
  data: ApiData | null;
  error: string | null;
}

export async function loader(): Promise<LoaderData> {
  try {
    const response = await fetch('http://localhost:3001/api/data');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data: ApiData = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch API data:', error);
    return {
      data: null,
      error: 'Unable to connect to API. Make sure the NestJS server is running on port 3001.',
    };
  }
}

export function ErrorBoundary() {
  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <Card variant='default'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>Something went wrong</h1>
          <p className='text-gray-600 mb-4'>
            An unexpected error occurred while loading this page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant='primary'
            aria-label='Reload the page'
          >
            Reload Page
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default function Index() {
  const { data, error } = useLoaderData<typeof loader>();

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Turbo Monorepo Demo</h1>
          <p className='text-xl text-gray-600 mb-8'>
            React Router v7 + NestJS + Shared UI Components + Clean Theme System
          </p>
          <div className='flex gap-4 justify-center'>
            <Button appName='web' variant='primary' size='md'>
              Primary Button
            </Button>
            <Button appName='remix' variant='secondary' size='md'>
              Secondary Button
            </Button>
          </div>
        </header>

        <div className='grid gap-6'>
          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Architecture Overview</h2>
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='p-4 bg-blue-50 rounded-lg'>
                <h3 className='font-semibold text-blue-900'>React Router v7</h3>
                <p className='text-blue-700 text-sm'>
                  Modern React framework with file-based routing and type-safe loaders
                </p>
              </div>
              <div className='p-4 bg-green-50 rounded-lg'>
                <h3 className='font-semibold text-green-900'>NestJS API</h3>
                <p className='text-green-700 text-sm'>
                  Scalable Node.js backend with TypeScript and OpenAPI documentation
                </p>
              </div>
              <div className='p-4 bg-purple-50 rounded-lg'>
                <h3 className='font-semibold text-purple-900'>Shared UI</h3>
                <p className='text-purple-700 text-sm'>
                  Type-safe React components with clean theme system and accessibility features
                </p>
              </div>
            </div>
          </Card>

          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>API Data</h2>
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
                  <p className='text-xs text-red-500 mt-2'>
                    This will start both the API server (port 3001) and web server (port 5173)
                  </p>
                </div>
              </div>
            ) : data ? (
              <div>
                <p className='text-gray-600 mb-4'>{data.message}</p>
                <p className='text-sm text-gray-500 mb-4'>
                  Last updated:{' '}
                  {new Date(data.timestamp).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </p>
                <div className='grid gap-4'>
                  {data.data.map((item) => (
                    <div key={item.id} className='p-4 bg-gray-50 rounded-lg'>
                      <h3 className='font-semibold'>{item.name}</h3>
                      <p className='text-gray-600'>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                <span className='ml-3 text-gray-600'>Loading API data...</span>
              </div>
            )}
          </Card>

          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Getting Started</h2>
            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold mb-2'>1. Development Setup:</h3>
                <code className='block bg-gray-100 p-3 rounded text-sm font-mono'>
                  npm install && npm run dev
                </code>
                <p className='text-sm text-gray-600 mt-1'>
                  Installs dependencies and starts all services with Turbo
                </p>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>2. Individual Services:</h3>
                <div className='space-y-2'>
                  <code className='block bg-gray-100 p-2 rounded text-sm font-mono'>
                    npm run dev:api # NestJS API (port 3001)
                  </code>
                  <code className='block bg-gray-100 p-2 rounded text-sm font-mono'>
                    npm run dev:web # React Router v7 (port 5173)
                  </code>
                </div>
              </div>
              <div>
                <h3 className='font-semibold mb-2'>3. Quality Checks:</h3>
                <code className='block bg-gray-100 p-2 rounded text-sm font-mono'>
                  npm run check # Linting & formatting
                </code>
                <code className='block bg-gray-100 p-2 rounded text-sm font-mono'>
                  npm run check-types # TypeScript validation
                </code>
              </div>
            </div>
          </Card>

          <Card variant='default'>
            <h2 className='text-2xl font-semibold mb-4'>Clean Theme System</h2>
            <div className='space-y-4'>
              <p className='text-gray-600'>
                Experience our clean CSS custom property theme that maps mood-based colors to
                semantic components.
              </p>
              <div className='flex flex-wrap gap-3'>
                <Link to='/theme-demo'>
                  <Button variant='primary' size='md'>
                    Explore Theme Demo
                  </Button>
                </Link>
                <div className='flex gap-2 items-center'>
                  <div className='w-8 h-8 rounded bg-primary'></div>
                  <div className='w-8 h-8 rounded bg-secondary'></div>
                  <div className='w-8 h-8 rounded bg-success'></div>
                  <div className='w-8 h-8 rounded bg-destructive'></div>
                  <span className='text-sm text-gray-500'>
                    Semantic colors with mood-based values
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-xs'>
                <div className='text-center p-2 bg-primary text-primary-foreground rounded'>
                  Primary
                </div>
                <div className='text-center p-2 bg-secondary text-secondary-foreground rounded'>
                  Secondary
                </div>
                <div className='text-center p-2 bg-success text-success-foreground rounded'>
                  Success
                </div>
                <div className='text-center p-2 bg-destructive text-destructive-foreground rounded'>
                  Destructive
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
