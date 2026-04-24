const boroughColors: Record<string, string> = {
  manhattan: 'bg-blue-50 text-blue-700',
  brooklyn: 'bg-purple-50 text-purple-700',
  queens: 'bg-orange-50 text-orange-700',
  bronx: 'bg-rose-50 text-rose-700',
  'staten-island': 'bg-teal-50 text-teal-700',
};

export function getBoroughColor(borough: string): string {
  return boroughColors[borough.toLowerCase()] || 'bg-slate-100 text-slate-700';
}
