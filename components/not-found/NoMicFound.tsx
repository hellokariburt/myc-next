'use client';

const NoMicFound = () => (
  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px]">
    <h1 className="text-7xl text-center font-bold">
      <span className="bg-gradient-to-r from-blue-400 to-orange-600 inline-block text-transparent bg-clip-text">
        Bummer!
      </span>{' '}
      No mics.
    </h1>
    <h2 className="font-light text-2xl lg:text-4xl md:text-3xl px-2 text-center text-slate-800 mt-4">
      <p>
        Let me help you back
        <a
          className="text-blue-400 underline decoration-dashed pl-1 hover:decoration-solid hover:underline"
          href="/"
        >
          home.
        </a>
      </p>
    </h2>
  </div>
);

export default NoMicFound;
