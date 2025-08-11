// frontend/src/lib/types.ts

// This file contains the CORRECTED TypeScript type definitions.
// Notice there is no more "attributes" wrapper.

interface IMediaFormat {
  url: string;
  width?: number;
  height?: number;
  // other fields as needed
}

// Corrected interface for the cover image data
interface ICoverImage {
  id: number;
  url: string;
  width?: number;
  height?: number;
  formats: {
    thumbnail: IMediaFormat;
    small: IMediaFormat;
    medium: IMediaFormat;
    large: IMediaFormat;
  };
  // other fields as needed
}

// Corrected interface for Category data
interface ICategory {
  id: number;
  name: string;
  slug: string;
}

// Corrected interface for Tag data
interface ITag {
  id: number;
  name: string;
  slug: string;
}

// CORRECTED Interface for a single Article, reflecting the flat structure
export interface IArticle {
  id: number;
  title: string;
  slug: string;
  content: unknown;
  excerpt: string;
  publication_date: string;
  coverImage: ICoverImage;
  category: ICategory;
  tags: ITag[];
}