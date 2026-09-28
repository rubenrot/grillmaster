import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 px-6 py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-graphite2 text-ember">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ash">{title}</h3>
      {description && <p className="text-sm text-ashMuted max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
