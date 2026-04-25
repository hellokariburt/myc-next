const boroughColors: Record<string, string> = {
  manhattan: 'text-blue-600',
  brooklyn: 'text-purple-600',
  queens: 'text-orange-600',
  bronx: 'text-rose-600',
  'staten-island': 'text-teal-600',
};

const boroughBorderColors: Record<string, string> = {
  manhattan: 'border-blue-400',
  brooklyn: 'border-purple-400',
  queens: 'border-orange-400',
  bronx: 'border-rose-400',
  'staten-island': 'border-teal-400',
};

export function getBoroughColor(borough: string): string {
  return boroughColors[borough.toLowerCase()] || 'text-slate-600';
}

export function getBoroughBorderColor(borough: string): string {
  return boroughBorderColors[borough.toLowerCase()] || 'border-slate-300';
}
