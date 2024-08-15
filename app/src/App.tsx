import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './globals.css';

const router: any = createRouter({ routeTree })

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}