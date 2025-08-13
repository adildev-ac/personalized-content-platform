import Link from "next/link";
import { IArticle } from "@/lib/types";

// A reusable component to display a preview of an article.
export default function ArticleCard({ article }: { article: IArticle }) {
  // Use a placeholder slug if the actual slug is null or undefined
  const slug = article.slug || "no-slug";

  return (
    <Link
      href={`/articles/${slug}`}
      key={article.id}
      className="block group border dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-900"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
