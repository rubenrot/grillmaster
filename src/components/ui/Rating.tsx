import { Flame } from 'lucide-react';
import { clsx } from '@/utils/clsx';

interface RatingProps {
  value?: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: number;
}

export function Rating({ value = 0, max = 5, readOnly = false, onChange, size = 20 }: RatingProps) {
  const items = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-1" role={readOnly ? undefined : 'radiogroup'} aria-label="Valoración">
      {items.map((item) => {
        const filled = item <= value;
        const commonClasses = clsx(
          'transition-colors',
          filled ? 'text-ember fill-ember' : 'text-ashMuted/40',
        );

        if (readOnly) {
          return <Flame key={item} size={size} className={commonClasses} aria-hidden="true" />;
        }

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange?.(item)}
            aria-label={`Valorar con ${item} de ${max}`}
            aria-pressed={filled}
            className="p-0.5 rounded-md focus:outline-none focus:ring-2 focus:ring-ember/50"
          >
            <Flame size={size} className={commonClasses} />
          </button>
        );
      })}
    </div>
  );
}
