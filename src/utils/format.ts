export function formatTemperature(value?: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (value === undefined || value === null) return '—';
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(value)}${symbol}`;
}

export function formatWeight(kg?: number): string {
  if (kg === undefined || kg === null) return '—';
  return `${kg} kg`;
}

export function formatThickness(cm?: number): string {
  if (cm === undefined || cm === null) return '—';
  return `${cm} cm`;
}
