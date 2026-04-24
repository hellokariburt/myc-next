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
        ? 'bg-blue-50 border-blue-300 text-blue-700'
        : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
    }`}
  >
    <IconCurrencyDollar size={16} className={checked ? 'text-blue-500' : 'text-slate-400'} />
    <span className={checked ? 'font-medium text-blue-700' : 'text-slate-500'}>Free</span>
  </button>
);

type FreeSwitchProps = {
  setChecked: (val: boolean) => void;
  checked: boolean;
};

export default FreeSwitch;
