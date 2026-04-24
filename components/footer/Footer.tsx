'use client';

import { IconMail } from '@tabler/icons-react';

const Footer = () => (
  <footer className="w-full bg-white border-t border-slate-200">
    <div className="flex justify-between items-center px-4 py-3 max-w-5xl mx-auto">
      <a
        href="mailto:hello@findopenmyc.com"
        className="text-sm text-slate-600 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      >
        Contact
      </a>
      <a
        href="mailto:hello@findopenmyc.com"
        aria-label="Email support"
        className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <IconMail size={18} stroke={1.5} />
      </a>
    </div>
  </footer>
);

export default Footer;
