import PageLayout from '../pagelayout/PageLayout';

const NotFound = () => (
  <PageLayout className="items-center">
    <div className="flex flex-col items-center justify-center py-36 h-full">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px]">
        <h1 className="font-bold">
          <span>No Mics Found</span>
        </h1>
        <p>Sorry try the search again!</p>
      </div>
    </div>
  </PageLayout>
);

export default NotFound;
