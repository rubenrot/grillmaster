import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { initializeDatabase } from '@/db/seed';

export function App() {
  useEffect(() => {
    void initializeDatabase();
  }, []);

  return <RouterProvider router={router} />;
}
