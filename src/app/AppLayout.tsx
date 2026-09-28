import { Outlet } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col bg-carbon">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
