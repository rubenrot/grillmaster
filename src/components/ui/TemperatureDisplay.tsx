import { clsx } from '@/utils/clsx';
import { formatTemperature } from '@/utils/format';

interface TemperatureDisplayProps {
  label: string;
  value?: number;
  target?: number;
  size?: 'md' | 'lg';
}

export function TemperatureDisplay({ label, value, target, size = 'md' }: TemperatureDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs uppercase tracking-wide text-ashMuted">{label}</span>
      <span
        className={clsx(
          'font-semibold text-ash tabular-nums',
          size === 'lg' ? 'text-4xl' : 'text-2xl',
        )}
      >
        {formatTemperature(value)}
      </span>
      {target !== undefined && (
        <span className="text-xs text-ashMuted">objetivo {formatTemperature(target)}</span>
      )}
    </div>
  );
}
