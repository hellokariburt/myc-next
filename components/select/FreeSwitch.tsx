'use client';

const FreeSwitch = ({ checked, setChecked }: FreeSwitchProps) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <span className="text-sm font-semibold text-slate-800">Free</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </label>
);

type FreeSwitchProps = {
  setChecked: (val: boolean) => void;
  checked: boolean;
};

export default FreeSwitch;
