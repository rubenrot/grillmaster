import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from './IconButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, showBack, action }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-3 px-4 pt-6 pb-4">
      <div className="flex items-center gap-2 min-w-0">
        {showBack && (
          <IconButton aria-label="Volver" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </IconButton>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ash truncate">{title}</h1>
          {subtitle && <p className="text-sm text-ashMuted truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
