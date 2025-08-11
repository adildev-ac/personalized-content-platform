// src/components/Header.tsx
"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * The shared Header component for the website.
 * It includes the site title which links to the homepage and main navigation links.
 * It is styled using Tailwind CSS for a responsive layout.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  return (
  <header className="relative z-50 border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_45%)]" />
      <div className="relative container mx-auto flex justify-between items-center px-4 py-4">
        {/* Site Title / Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight drop-shadow-sm">
          Content Platform
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="hover:opacity-90 rounded-full bg-white/5 px-3 py-1 backdrop-blur-sm">
            Home
          </Link>
          <Link href="/search" className="hover:opacity-90 rounded-full bg-white/5 px-3 py-1 backdrop-blur-sm">
            Search
          </Link>
          {/* Interests dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="cursor-pointer rounded-full bg-white/5 px-3 py-1 backdrop-blur-sm hover:opacity-90"
            >
              Interests
            </button>
            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 text-gray-900 shadow-md dark:border-white/10 dark:bg-gray-900 dark:text-slate-100 z-50"
              >
                <Link href="/categories/technology" onClick={() => setOpen(false)} className="block rounded px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" role="menuitem">Technology</Link>
                <Link href="/categories/movies" onClick={() => setOpen(false)} className="block rounded px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" role="menuitem">Movies</Link>
                <Link href="/categories/news" onClick={() => setOpen(false)} className="block rounded px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" role="menuitem">News / Political opinion</Link>
                <Link href="/categories/cooking" onClick={() => setOpen(false)} className="block rounded px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800" role="menuitem">Cooking / recipes</Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}