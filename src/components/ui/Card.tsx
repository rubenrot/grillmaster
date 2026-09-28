import type { HTMLAttributes } from 'react';
import { clsx } from '@/utils/clsx';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-xl2 border border-border bg-graphite p-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
