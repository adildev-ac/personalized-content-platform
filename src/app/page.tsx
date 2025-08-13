// frontend/src/app/page.tsx

import { getArticles } from "@/lib/api";
import { IArticle } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";

export default async function HomePage() {
  const articles: IArticle[] = await getArticles();

  return (
    <>
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
          Explore, Discover, Learn
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Your central hub for high-quality content on technology, design, and more.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((article) => <ArticleCard article={article} key={article.id} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">No articles found.</p>
          )}
        </div>
      </section>
    </>
  );
}