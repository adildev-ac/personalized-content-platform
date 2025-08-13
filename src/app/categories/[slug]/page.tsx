import Link from "next/link";
import { getAllCategorySlugs, getArticlesByCategorySlug, getCategoryBySlug } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import { notFound } from "next/navigation";

export const revalidate = 300; // ISR 5 min

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return {
    title: `Category: ${slug}`,
    description: `Articles in category ${slug}`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }
  const articles = await getArticlesByCategorySlug(slug);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Posts in: {category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? (
          articles.map((article) => <ArticleCard key={article.id} article={article} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">No articles found in this category.</p>
        )}
      </div>
    </div>
  );
}
