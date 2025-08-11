import Link from "next/link";
import { getAllCategorySlugs, getArticlesByCategorySlug } from "@/lib/api";

export const revalidate = 300; // ISR 5 min

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Category: ${slug}`,
    description: `Articles in category ${slug}`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticlesByCategorySlug(slug);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Category: {slug}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((a) => (
          <Link key={a.id} href={`/articles/${a.slug}`} className="block rounded-lg border dark:border-gray-700 p-5 hover:shadow">
            <h3 className="text-xl font-semibold">{a.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
