'use client';

import Link from 'next/link';
import { IconCurrencyDollar } from '@tabler/icons-react';
import PageLayout from '../pagelayout/PageLayout';

const About = () => (
  <PageLayout>
    <div className="flex flex-col items-center justify-center py-36 min-h-[100vh]">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px]">
        <h1 className="font-bold text-4xl">About</h1>
        <h3 className="font-bold text-xl pt-6">What is this?</h3>
        <p className="pt-2">
          This website provides the location of open mics throughout the 5 boroughs of NYC. Using
          this website, you can find open mics based on the borough, day, time and most importantly,
          whether they are <span className="font-bold">FREE</span>.
        </p>
        <h3 className="font-bold text-xl pt-6">Who built this?</h3>
        <p className="pt-2">
          OpenMYC was created by{' '}
          <Link
            href="https://kariburt.com"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
          >
            Kari Burt
          </Link>
          , a comedian from Houston that was trying to navigate the NYC open mic scene.
        </p>
        <h3 className="font-bold text-xl pt-6">How can I support the app?</h3>
        <p className="pt-2">
          If you are enjoying the app, my Venmo and Cashapp are below. Money goes toward dev and
          maintenance. Toss me a couple bucks, and if you make it let me feature for you!
        </p>
        <div className="flex flex-row p-4 justify-center items-center gap-5">
          <a
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            href="https://cash.app/$KariBurt"
          >
            <IconCurrencyDollar size={20} />
            Cashapp
          </a>
          <a
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            href="https://venmo.com/u/kariandreah"
          >
            <IconCurrencyDollar size={20} />
            Venmo
          </a>
        </div>
        <h3 className="font-bold text-xl pt-4">Some mics are missing!</h3>
        <p className="pt-2">
          This website is built based on what mics we know of. If you know of a mic that should be
          on the list feel free to
          <Link
            href="/submit"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold pl-1"
          >
            submit a mic
          </Link>.
          We will try to keep the list as up-to-date as possible.
        </p>
        <h3 className="font-bold text-xl pt-6">I have a different issue!</h3>
        <p className="pt-2">
          Any issues feel free to email:{' '}
          <Link
            href="mailto:hello@findopenmyc.com"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold px-1"
          >
            hello@findopenmyc.com
          </Link>
        </p>
        <h3 className="font-bold text-xl pt-6">What is the technology stack?</h3>
        <p className="pt-2">
          OpenMYC is a fullstack application consisting of a Next.js frontend with a PostgreSQL
          database, deployed on Vercel.
        </p>
        <h3 className="font-bold text-xl pt-8">
          Thank you for checking out
          <Link
            href="/"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid pl-2"
          >
            OpenMYC
          </Link>
        </h3>
      </div>
    </div>
  </PageLayout>
);

export default About;
