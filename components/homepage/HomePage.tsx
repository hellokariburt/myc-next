import SearchCard from '../searchcard/SearchCard';
import { Title } from '../title/Title';
import PageLayout from '../pagelayout/PageLayout';

export function HomePage() {
  return (
    <PageLayout className="bg-[#F5F5F5] bg-cover">
      <div className="flex flex-col items-center justify-center min-h-[100vh] md:gap-6 gap-2 pb-32">
        <Title />
        <SearchCard />
      </div>
    </PageLayout>
  );
}
