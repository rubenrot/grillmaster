import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Sparkles, Bookmark, User } from 'lucide-react';
import { clsx } from '@/utils/clsx';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/recipes', label: 'Recetas', icon: BookOpen, end: false },
  { to: '/ai', label: 'AI', icon: Sparkles, end: false, isCenter: true },
  { to: '/saved', label: 'Guardados', icon: Bookmark, end: false },
  { to: '/profile', label: 'Perfil', icon: User, end: false },
];

export function BottomNavigation() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app border-t border-border bg-carbon/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegación principal"
    >
      <ul className="flex items-stretch justify-around">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, isCenter }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-xs transition-colors',
                  isActive ? 'text-ember' : 'text-ashMuted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isCenter ? (
                    <span
                      className={clsx(
                        'flex h-10 w-10 items-center justify-center rounded-full -mt-4 shadow-lg transition-colors',
                        isActive ? 'bg-ember text-carbon' : 'bg-graphite2 text-ember border border-border',
                      )}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </span>
                  ) : (
                    <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
                  )}
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
