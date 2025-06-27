import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Turbo Monorepo Demo" },
    { name: "description", content: "Remix + NestJS + UI Library Demo" },
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

export async function loader() {
  try {
    const response = await fetch("http://localhost:3001/api/data");
    if (!response.ok) {
      throw new Error("Failed to fetch data from API");
    }
    const data: ApiData = await response.json();
    return { data, error: null };
  } catch (_error) {
    return {
      data: null,
      error: "Unable to connect to API. Make sure the NestJS server is running on port 3001.",
    };
  }
}

export default function Index() {
  const { data, error } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Turbo Monorepo Demo</h1>
          <p className="text-xl text-gray-600 mb-8">Remix + NestJS + Shared UI Components</p>
          <div className="flex gap-4 justify-center">
            <Button appName="web">Primary Button</Button>
            <Button appName="remix">Secondary Button</Button>
          </div>
        </header>

        <div className="grid gap-6">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Architecture Overview</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Remix Frontend</h3>
                <p className="text-blue-700 text-sm">
                  This page is built with Remix and uses shared UI components
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">NestJS API</h3>
                <p className="text-green-700 text-sm">Backend API providing data to the frontend</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900">Shared UI</h3>
                <p className="text-purple-700 text-sm">
                  Reusable React components used across applications
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4">API Data</h2>
            {error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  Run <code className="bg-red-100 px-2 py-1 rounded">npm run start:dev</code> in the
                  API directory to start the server.
                </p>
              </div>
            ) : data ? (
              <div>
                <p className="text-gray-600 mb-4">{data.message}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Last updated: {new Date(data.timestamp).toLocaleString()}
                </p>
                <div className="grid gap-4">
                  {data.data.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">1. Start the API server:</h3>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  cd apps/api && npm run start:dev
                </code>
              </div>
              <div>
                <h3 className="font-semibold">2. Start the web server:</h3>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  cd apps/web && npm run dev
                </code>
              </div>
              <div>
                <h3 className="font-semibold">Or run everything with Turbo:</h3>
                <code className="block bg-gray-100 p-2 rounded mt-1">npm run dev</code>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
