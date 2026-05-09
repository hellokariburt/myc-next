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

const boroughBadgeClasses: Record<string, string> = {
  manhattan: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  brooklyn: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  queens: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  bronx: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  'staten-island': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
};

const boroughDisplayShort: Record<string, string> = {
  manhattan: 'Manhattan',
  brooklyn: 'Brooklyn',
  queens: 'Queens',
  bronx: 'Bronx',
  'staten-island': 'Staten Island',
};

export function getBoroughColor(borough: string): string {
  return boroughColors[borough.toLowerCase()] || 'text-slate-600';
}

export function getBoroughBorderColor(borough: string): string {
  return boroughBorderColors[borough.toLowerCase()] || 'border-slate-300';
}

export function getBoroughBadgeClasses(borough: string): string {
  return boroughBadgeClasses[borough.toLowerCase()] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
}

export function getBoroughDisplayShort(borough: string): string {
  return boroughDisplayShort[borough.toLowerCase()] || borough;
}
