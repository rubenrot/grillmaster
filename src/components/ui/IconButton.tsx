import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from '@/utils/clsx';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'default' | 'accent';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center h-11 w-11 rounded-full transition-colors',
          'disabled:opacity-40 disabled:pointer-events-none',
          variant === 'default' && 'bg-graphite2 text-ash hover:bg-graphite',
          variant === 'accent' && 'bg-ember text-carbon hover:bg-emberSoft',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
