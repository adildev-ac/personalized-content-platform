// frontend/src/lib/api.ts

import { IArticle, ICategory } from "./types";

// Validate and sanitize the API URL to prevent malicious URL injection
function getSafeApiUrl() {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  
  // If no URL is provided, use the default
  if (!url) {
    return "http://localhost:1337";
  }
  
  try {
    // Validate URL format
    const parsedUrl = new URL(url);
    
    // Ensure it uses http or https protocol
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      console.error(`Invalid API URL protocol: ${parsedUrl.protocol}`);
      return "http://localhost:1337";
    }
    
    // Return validated URL without trailing slash
    return parsedUrl.toString().replace(/\/$/, '');
  } catch (error) {
    console.error(`Invalid API URL: ${url}`, error);
    return "http://localhost:1337";
  }
}

export const STRAPI_API_URL = getSafeApiUrl();

// Helper to safely build URLs and prevent injection
function createSafeUrl(path: string, params: Record<string, string> = {}) {
  // Ensure path starts with /
  const safePath = path.startsWith('/') ? path : `/${path}`;
  
  // Create URL object
  const url = new URL(safePath, STRAPI_API_URL);
  
  // Add sanitized parameters
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  url.search = searchParams.toString();
  return url;
}

/**
 * Fetch options with security headers
 */
/**
 * Create abort controller with timeout for older Node versions
 * @param timeout - Timeout in milliseconds
 * @returns AbortSignal
 */
function createTimeoutSignal(timeout: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(new Error(`Request timed out after ${timeout}ms`)), timeout);
  return controller.signal;
}

const fetchOptions: RequestInit = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // Add a reasonable timeout to prevent hanging requests
  signal: createTimeoutSignal(30000), // 30-second timeout for slower development environments
};

/**
 * Safely fetches and validates data from the API
 * @param url - The URL to fetch from
 * @returns Validated response data
 */
async function safeFetch<T>(url: URL | string): Promise<T> {
  try {
    // Use the URL string to prevent potential URL object manipulation
    const urlString = url.toString();
    
    // Validate URL before fetching
    const parsedUrl = new URL(urlString);
    if (!parsedUrl.href.startsWith(STRAPI_API_URL)) {
      throw new Error(`URL ${parsedUrl.href} is not from the expected API domain`);
    }
    
    const response = await fetch(urlString, fetchOptions);
    
    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    // Validate that the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}`);
    }
    
    // Parse and validate the response
    const data = await response.json();
    
    // Validate Strapi response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid API response format');
    }
    
    return data as T;
  } catch (error) {
    // Enhanced error logging with request details
    if (error instanceof Error) {
      console.error(`API Error: ${error.message}`, {
        url: typeof url === 'string' ? url : url.toString(),
        stack: error.stack,
      });
    } else {
      console.error('Unknown API error', error);
    }
    throw error; // Re-throw for the caller to handle
  }
}

/**
 * Fetches a list of articles from the Strapi API with enhanced security and validation.
 * @returns {Promise<IArticle[]>} A promise that resolves to an array of articles.
 */
export async function getArticles(): Promise<IArticle[]> {
  try {
    // Use our safe URL builder
    const url = createSafeUrl("/api/articles", {
      "populate[0]": "category",
      "populate[1]": "tags",
      "populate[2]": "coverImage",
    });
    
    // Fetch with validation
    const data = await safeFetch<{data: IArticle[]}>(url);
    
    // Validate data structure
    if (!Array.isArray(data.data)) {
      console.error("API returned unexpected data format", data);
      return [];
    }
    
    // Return articles with validation
    return data.data.filter(article => 
      article && 
      typeof article === 'object' && 
      'id' in article && 
      'title' in article
    );
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

/**
 * Fetches a single article by its slug from the Strapi API with enhanced security.
 * @param {string} slug - The slug of the article to fetch.
 * @returns {Promise<IArticle | null>} A promise that resolves to the article or null if not found.
 */
export async function getArticleBySlug(slug: string): Promise<IArticle | null> {
  try {
    // Validate slug to prevent injection attacks
    if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
      console.error(`Invalid slug format: ${slug}`);
      return null;
    }
    
    console.log(`Fetching article with slug: ${slug} from ${STRAPI_API_URL}`);
    
    // Use our safe URL builder with sanitized parameters
    const url = createSafeUrl("/api/articles", {
      "filters[slug][$eq]": slug,
      "populate[0]": "category",
      "populate[1]": "tags",
      "populate[2]": "coverImage",
    });
    
    // Fetch with validation
    const data = await safeFetch<{data: IArticle[]}>(url);
    
    // Validate the response structure
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error("API returned unexpected data format", data);
      return null;
    }
    
    // Return the first article if it exists and has required fields
    if (data.data.length > 0) {
      const article = data.data[0];
      
      // Validate that the article has required fields
      if (!article || !article.id || !article.title || !article.slug) {
        console.error("Article is missing required fields", article);
        return null;
      }
      
      return article;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch article with slug '${slug}':`, error);
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

/** Fetch a single category by slug */
export async function getCategoryBySlug(slug: string): Promise<ICategory | null> {
  const url = new URL("/api/categories", STRAPI_API_URL);
  const params = new URLSearchParams({ "filters[slug][$eq]": slug, "pagination[pageSize]": "1" });
  url.search = params.toString();
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch category");
    const data = await res.json();
    const arr = (data.data as ICategory[] | undefined) || [];
    return arr[0] || null;
  } catch (e) {
    console.error("API Error:", e);
    return null;
  }
}