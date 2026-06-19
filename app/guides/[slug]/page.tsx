import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageLayout from '@/components/pagelayout/PageLayout';
import { guideArticleMap, guideArticles } from '@/lib/content/guides';

export async function generateStaticParams() {
  return guideArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = guideArticleMap[slug];
  if (!article) return {};

  return {
    title: `${article.title} | OpenMYC`,
    description: article.description,
    alternates: { canonical: `https://findopenmyc.com/guides/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://findopenmyc.com/guides/${article.slug}`,
      type: 'article',
    },
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = guideArticleMap[slug];

  if (!article) {
    notFound();
  }

  return (
    <PageLayout className="bg-[#f6efe4]">
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <Link href="/guides" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Back to guides
        </Link>
        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white px-6 py-8 md:px-10 md:py-12 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>{article.category}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{article.readingTime}</span>
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{article.intro}</p>

          <div className="mt-10 space-y-10">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
