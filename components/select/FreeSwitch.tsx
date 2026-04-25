'use client';

import { IconCurrencyDollar } from '@tabler/icons-react';

const FreeSwitch = ({ checked, setChecked }: FreeSwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label="Free mics only"
    onClick={() => setChecked(!checked)}
    className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors shrink-0 ${
      checked
        ? 'bg-green-50 border-green-400 text-green-700'
        : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
    }`}
  >
    <IconCurrencyDollar size={16} className={checked ? 'text-green-600' : 'text-slate-400'} />
    <span className={checked ? 'font-medium text-green-700' : 'text-slate-500'}>Free</span>
  </button>
);

type FreeSwitchProps = {
  setChecked: (val: boolean) => void;
  checked: boolean;
};

export default FreeSwitch;
