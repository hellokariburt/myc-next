import PageLayout from '@/components/pagelayout/PageLayout';

const NotFound = () => (
  <PageLayout>
    <div className="flex flex-col items-center justify-center py-36 h-full">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px]">
        <h1 className="text-7xl bg-gradient-to-r from-blue-400 to-orange-600 inline-block font-bold text-transparent bg-clip-text text-center">
          Oops!
        </h1>
        <h2 className="font-light text-2xl lg:text-4xl md:text-3xl px-2 text-center text-slate-800 mt-4">
          <p>We lost this page</p>
          <p>
            Let me help you back
            <a className="text-blue-400 pl-1 hover:decoration-dashed hover:underline" href="/">
              home
            </a>
          </p>
        </h2>
      </div>
    </div>
  </PageLayout>
);

export default NotFound;
