import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { clsx } from '@/utils/clsx';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  suffix?: ReactNode;
}

export function FormField({ label, hint, suffix, className, id, ...props }: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm text-ashMuted">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={clsx(
            'w-full h-12 rounded-xl2 border border-border bg-graphite2 px-4 text-ash placeholder:text-ashMuted/60',
            'focus:outline-none focus:ring-2 focus:ring-ember/50',
            Boolean(suffix) && 'pr-14',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ashMuted">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="text-xs text-ashMuted">{hint}</span>}
    </div>
  );
}
