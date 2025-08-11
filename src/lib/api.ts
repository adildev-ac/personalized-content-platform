// frontend/src/lib/api.ts

import { IArticle } from "./types";

export const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Fetches a list of articles from the Strapi API.
 * @returns {Promise<IArticle[]>} A promise that resolves to an array of articles.
 */
export async function getArticles(): Promise<IArticle[]> {
  const url = new URL("/api/articles", STRAPI_API_URL);
  
  const params = new URLSearchParams({
    "populate[0]": "category",
    "populate[1]": "tags",
    "populate[2]": "coverImage",
  });
  url.search = params.toString();

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

/**
 * Fetches a single article by its slug from the Strapi API.
 * @param {string} slug - The slug of the article to fetch.
 * @returns {Promise<IArticle | null>} A promise that resolves to the article or null if not found.
 */
export async function getArticleBySlug(slug: string): Promise<IArticle | null> {
  const url = new URL("/api/articles", STRAPI_API_URL);

  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "populate[0]": "category",
    "populate[1]": "tags",
    "populate[2]": "coverImage",
  });
  url.search = params.toString();

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
    return null;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

/** Returns just the slugs for all published articles */
export async function getAllArticleSlugs(): Promise<string[]> {
  const url = new URL("/api/articles", STRAPI_API_URL);
  const params = new URLSearchParams({
    "fields[0]": "slug",
    "pagination[pageSize]": "100",
    "sort[0]": "publication_date:desc",
  });
  url.search = params.toString();
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch slugs");
    const data = await res.json();
  return (data.data as Array<{ slug?: string }> | undefined || []).map((a) => a.slug as string).filter(Boolean);
  } catch (e) {
    console.error("API Error:", e);
    return [];
  }
}

export async function getArticlesByCategorySlug(slug: string): Promise<IArticle[]> {
  const url = new URL("/api/articles", STRAPI_API_URL);
  const params = new URLSearchParams({
    "filters[category][slug][$eq]": slug,
    "populate[0]": "category",
    "populate[1]": "tags",
    "populate[2]": "coverImage",
    "sort[0]": "publication_date:desc",
  });
  url.search = params.toString();
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch by category");
    const data = await res.json();
  return (data.data as IArticle[] | undefined) || [];
  } catch (e) {
    console.error("API Error:", e);
    return [];
  }
}

export async function getArticlesByTagSlug(slug: string): Promise<IArticle[]> {
  const url = new URL("/api/articles", STRAPI_API_URL);
  const params = new URLSearchParams({
    "filters[tags][slug][$eq]": slug,
    "populate[0]": "category",
    "populate[1]": "tags",
    "populate[2]": "coverImage",
    "sort[0]": "publication_date:desc",
  });
  url.search = params.toString();
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch by tag");
    const data = await res.json();
  return (data.data as IArticle[] | undefined) || [];
  } catch (e) {
    console.error("API Error:", e);
    return [];
  }
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const url = new URL("/api/categories", STRAPI_API_URL);
  const params = new URLSearchParams({
    "fields[0]": "slug",
    "pagination[pageSize]": "100",
  });
  url.search = params.toString();
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch category slugs");
    const data = await res.json();
  return ((data.data as Array<{ slug?: string }> | undefined) || []).map((c) => c.slug as string).filter(Boolean);
  } catch (e) {
    console.error("API Error:", e);
    return [];
  }
}

export async function getAllTagSlugs(): Promise<string[]> {
  const url = new URL("/api/tags", STRAPI_API_URL);
  const params = new URLSearchParams({
    "fields[0]": "slug",
    "pagination[pageSize]": "100",
  });
  url.search = params.toString();
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch tag slugs");
    const data = await res.json();
  return ((data.data as Array<{ slug?: string }> | undefined) || []).map((t) => t.slug as string).filter(Boolean);
  } catch (e) {
    console.error("API Error:", e);
    return [];
  }
}

/** Minimal index for client-side search */
export async function getArticleIndex(): Promise<Array<{id:number;slug:string;title:string;excerpt:string;tags:string[]}>> {
  const url = new URL("/api/articles", STRAPI_API_URL);
  const params = new URLSearchParams({
    "fields[0]": "id",
    "fields[1]": "slug",
    "fields[2]": "title",
    "fields[3]": "excerpt",
    "populate[tags][fields][0]": "slug",
    "populate[tags][fields][1]": "name",
    "pagination[pageSize]": "100",
    "sort[0]": "publication_date:desc",
  });
  url.search = params.toString();
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch index");
    const data = await res.json();
    type SearchArticle = { id: number; slug: string; title: string; excerpt: string; tags?: Array<{ name?: string; slug?: string }>};
    const arr = (data.data as SearchArticle[] | undefined) || [];
    return arr.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      tags: (a.tags || []).map((t) => (t.name || t.slug) as string).filter(Boolean),
    }));
  } catch (e) {
    console.error("API Error:", e);
    return [];
  }
}