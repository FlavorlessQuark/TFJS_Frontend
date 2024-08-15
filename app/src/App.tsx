import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router: any = createRouter({ routeTree })

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}