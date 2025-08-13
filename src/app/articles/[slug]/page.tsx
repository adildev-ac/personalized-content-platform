// src/app/articles/[slug]/page.tsx

import { getArticleBySlug, getAllArticleSlugs, STRAPI_API_URL } from "@/lib/api";
import { notFound } from "next/navigation";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Image from 'next/image';
import Link from 'next/link';
import GiscusComments from '@/components/GiscusComments';

const STRAPI_URL = STRAPI_API_URL;

/**
 * Validates that a slug meets security requirements
 * @param slug The article slug to validate
 * @returns True if the slug is valid
 */
function validateSlug(slug: string): boolean {
  // Only allow alphanumeric characters, hyphens, and underscores
  // Prevents directory traversal and other injection attacks
  const validSlugRegex = /^[a-z0-9-_]+$/i;
  
  // Check length to prevent DoS
  const validLength = slug.length > 0 && slug.length <= 100;
  
  return validSlugRegex.test(slug) && validLength;
}

// UPDATED: In Next.js 15, params is async. Await it before using.
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Validate slug to prevent injection attacks
  if (!validateSlug(slug)) {
    console.error(`Invalid article slug requested: ${slug}`);
    notFound();
  }
  
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }
  
  const preferred = article.coverImage.formats?.large || article.coverImage.formats?.medium || article.coverImage.formats?.small;
  const imgPath = preferred?.url || article.coverImage.url;
  const imageUrl = imgPath.startsWith("http") ? imgPath : `${STRAPI_URL}${imgPath}`;
  const imgWidth = preferred?.width || article.coverImage.width || 1000;
  const imgHeight = preferred?.height || article.coverImage.height || 600;

  const formattedDate = new Date(article.publication_date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
  <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Cover Image */}
      <div className="w-full overflow-hidden rounded-xl mb-8">
        <Image
          src={imageUrl}
          alt={article.title}
          width={imgWidth}
          height={imgHeight}
          className="h-auto w-full max-h-[70vh] rounded-xl object-cover"
          sizes="(min-width: 1024px) 896px, (min-width: 768px) 672px, 100vw"
          priority
        />
      </div>

      {/* Article Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{article.title}</h1>
        <div className="text-gray-500 dark:text-gray-400">
          <span>Published on {formattedDate} in </span>
          <Link href={`/categories/${article.category.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {article.category.name}
          </Link>
        </div>
      </div>
      
  {/* Article Content */}
  <div className="prose prose-slate dark:prose-invert max-w-none">
        <BlocksRenderer content={article.content as any} />
      </div>

  {/* Tags Section removed by request */}

      {/* Comments (Giscus – renders only if env set) */}
      <section className="mt-16">
        <GiscusComments />
      </section>
    </article>
  );
}

export const revalidate = 300; // ISR 5 min

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  const ogImage = `${STRAPI_URL}${(article.coverImage?.formats?.large?.url || article.coverImage?.url || "")}`;
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: ogImage ? [ogImage] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}
