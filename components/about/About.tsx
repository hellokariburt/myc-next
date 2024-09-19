import '@mantine/core/styles.css';
import { Card } from '@mantine/core';
import Link from 'next/link';
import { SiCashapp } from 'react-icons/si';
import { IoLogoVenmo } from 'react-icons/io5';
import PageLayout from '../pagelayout/PageLayout';

const About = () => (
  <PageLayout>
    <div className="flex flex-col items-center justify-center py-36 min-h-[100vh]">
      <Card className="flex flex-1 bg-slate-500 pt-32 max-w-[800px]">
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
            href="https://kariandreah.github.io/"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold"
          >
            Kari Burt
          </Link>
          , a comedian from Houston that was trying to navigate the NYC open mic scene.
        </p>
        <h3 className="font-bold text-xl pt-6">How can I support the app?</h3>
        <p className="pt-2">
          If you are enjoying the app, my Venmo and Cashapp are below. Money goes toward dev and
          maintanence. Toss me a couple bucks, and if you make it let me feature for you!
        </p>
        <div className="flex flex-row p-4 justify-center items-center text-blue-700 font-bold gap-5">
          <a
            className="flex flex-row bg-blue-500 p-1 border-solid border-2 border-grey-700 rounded-lg items-center"
            href="https://cash.app/$KariBurt"
          >
            <SiCashapp size="25px" color="white" />
            <p className="p-2 text-white">Cashapp</p>
          </a>
          <a
            className="flex flex-row bg-blue-500 p-1 border-solid border-2 border-grey-800 rounded-lg items-center"
            href="https://venmo.com/u/kariandreah"
          >
            <IoLogoVenmo size="25px" color="white" />
            <p className="p-2 text-white">Venmo</p>
          </a>
        </div>
        <h3 className="font-bold text-xl pt-4">Some mics are missing!</h3>
        <p className="pt-2">
          This website is built based on what mics we know of. If you know of a mic that should be
          on the list feel free to
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSe7Ucl9_oWjOA9LbmvPQAwaqDcr1EAgcUWMnMnhEYm8P9LSGQ/viewform?usp=send_form"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold px-1"
          >
            submit a mic.
          </Link>
          We will try to keep the list as up-to-date as possible.
        </p>
        <h3 className="font-bold text-xl pt-6">I have a different issue!</h3>
        <p className="pt-2">
          Any issues feel free to email:{' '}
          <Link
            href="mailto:openmycapp@gmail.com"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid font-semibold px-1"
          >
            openmycapp@gmail.com
          </Link>
        </p>

        <h3 className="font-bold text-xl pt-6">What is the technology stack?</h3>
        <p className="pt-2">
          OpenMYC is a fullstack application consisting of a NextJS frontend, Node.js backend, and a
          PostreSQL database. The entire stack was deployed on DigitalOcean.
        </p>
        <h3 className="font-semibold text-xl pt-8">
          Thank you for checking out
          <Link
            href="https://findopenmyc.com/"
            className="text-blue-500 underline decoration-dashed hover:decoration-solid pl-2"
          >
            findopenmyc.com
          </Link>
        </h3>
      </Card>
    </div>
  </PageLayout>
);

export default About;

export type AboutProps = {};
