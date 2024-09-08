import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen'
import './globals.css';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}