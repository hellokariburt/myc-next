const boroughColors: Record<string, string> = {
  manhattan: 'text-blue-600',
  brooklyn: 'text-purple-600',
  queens: 'text-orange-600',
  bronx: 'text-rose-600',
  'staten-island': 'text-teal-600',
};

const boroughBorderColors: Record<string, string> = {
  manhattan: 'border-l-blue-500',
  brooklyn: 'border-l-purple-500',
  queens: 'border-l-orange-500',
  bronx: 'border-l-rose-500',
  'staten-island': 'border-l-teal-500',
};

const boroughAccentBar: Record<string, string> = {
  manhattan: 'bg-blue-500',
  brooklyn: 'bg-purple-500',
  queens: 'bg-orange-500',
  bronx: 'bg-rose-500',
  'staten-island': 'bg-teal-500',
};

const boroughEyebrow: Record<string, string> = {
  manhattan: 'text-blue-700',
  brooklyn: 'text-purple-700',
  queens: 'text-orange-700',
  bronx: 'text-rose-700',
  'staten-island': 'text-teal-700',
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
  return boroughBorderColors[borough.toLowerCase()] || 'border-l-slate-300';
}

export function getBoroughBadgeClasses(borough: string): string {
  return boroughBadgeClasses[borough.toLowerCase()] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
}

export function getBoroughDisplayShort(borough: string): string {
  return boroughDisplayShort[borough.toLowerCase()] || borough;
}

export function getBoroughAccentBar(borough: string): string {
  return boroughAccentBar[borough.toLowerCase()] || 'bg-slate-300';
}

export function getBoroughEyebrow(borough: string): string {
  return boroughEyebrow[borough.toLowerCase()] || 'text-slate-700';
}

// Tailwind 500-weight hex values — used for map pins where CSS classes can't reach
const boroughHex: Record<string, string> = {
  manhattan: '#3b82f6',
  brooklyn: '#a855f7',
  queens: '#f97316',
  bronx: '#f43f5e',
  'staten-island': '#14b8a6',
};

export function getBoroughHex(borough: string): string {
  return boroughHex[borough.toLowerCase()] || '#64748b';
}

// solid pill classes for active borough filters
const boroughSolid: Record<string, string> = {
  manhattan: 'bg-blue-600 border-blue-600 text-white',
  brooklyn: 'bg-purple-600 border-purple-600 text-white',
  queens: 'bg-orange-600 border-orange-600 text-white',
  bronx: 'bg-rose-600 border-rose-600 text-white',
  'staten-island': 'bg-teal-600 border-teal-600 text-white',
};

export function getBoroughSolid(borough: string): string {
  return boroughSolid[borough.toLowerCase()] || 'bg-slate-900 border-slate-900 text-white';
}

// gradient banner for imageless club cards
const boroughBanner: Record<string, string> = {
  manhattan: 'bg-gradient-to-br from-blue-500 to-blue-700',
  brooklyn: 'bg-gradient-to-br from-purple-500 to-purple-700',
  queens: 'bg-gradient-to-br from-orange-500 to-orange-700',
  bronx: 'bg-gradient-to-br from-rose-500 to-rose-700',
  'staten-island': 'bg-gradient-to-br from-teal-500 to-teal-700',
};

export function getBoroughBanner(borough: string): string {
  return boroughBanner[borough.toLowerCase()] || 'bg-gradient-to-br from-slate-500 to-slate-700';
}
