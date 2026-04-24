const boroughColors: Record<string, string> = {
  manhattan: 'text-blue-600',
  brooklyn: 'text-purple-600',
  queens: 'text-orange-600',
  bronx: 'text-rose-600',
  'staten-island': 'text-teal-600',
};

export function getBoroughColor(borough: string): string {
  return boroughColors[borough.toLowerCase()] || 'text-slate-600';
}
