// frontend/src/app/page.tsx

import { getArticles } from "@/lib/api";
import { IArticle } from "@/lib/types";
import Link from "next/link";

export default async function HomePage() {
  const articles: IArticle[] = await getArticles();

  return (
    <>
      {/* Hero Section */}
  <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-16 text-center text-slate-100 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm">
            Explore, Discover, Learn
          </h1>
          <p className="mt-5 text-lg/7 opacity-90">
            Your hub for high‑quality content on technology, design, and more.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="#latest" className="rounded-full bg-white/5 px-5 py-2 text-sm font-semibold backdrop-blur hover:bg-white/10">
              Browse Articles
            </Link>
            <Link href="/search" className="rounded-full bg-white text-slate-800 px-5 py-2 text-sm font-semibold shadow hover:opacity-90">
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Articles List Section */}
      <section id="latest" className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                href={`/articles/${article.slug}`}
                key={article.id}
                className="group relative overflow-hidden rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-gray-900"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-400/10 blur-2xl" />
                <h3 className="relative z-10 text-lg font-semibold text-gray-900 transition-colors group-hover:text-slate-700 dark:text-white">
                  {article.title}
                </h3>
                <p className="relative z-10 mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                  {article.excerpt}
                </p>
                <span className="relative z-10 mt-4 inline-block text-xs font-medium text-slate-700 dark:text-slate-300">Read more →</span>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>No articles found.</p>
              <p className="mt-1 text-xs opacity-80">If you’re running Strapi locally, make sure it’s started on http://localhost:1337 and that NEXT_PUBLIC_STRAPI_URL is set.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}