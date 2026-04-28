const NotFoundCard = () => (
  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px] text-center">
    <h1 className="text-6xl bg-gradient-to-r from-blue-500 to-orange-500 inline-block font-bold text-transparent bg-clip-text">
      Oops!
    </h1>
    <p className="text-xl text-slate-600 mt-4">We lost this page</p>
    <p className="text-xl text-slate-600 mt-2">
      Let me help you back{' '}
      <a
        className="text-blue-600 underline decoration-dashed hover:decoration-solid font-semibold"
        href="/"
      >
        home
      </a>.
    </p>
  </div>
);

export default NotFoundCard;
