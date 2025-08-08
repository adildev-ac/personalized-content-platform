// src/components/Header.tsx

import Link from 'next/link';

/**
 * The shared Header component for the website.
 * It includes the site title which links to the homepage and main navigation links.
 * It is styled using Tailwind CSS for a responsive layout.
 * @returns {JSX.Element} The rendered header component.
 */
export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Site Title / Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          Content Platform
        </Link>
        
        {/* Navigation Links */}
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Home
          </Link>
          {/* We will add more links here later (e.g., categories, tags) */}
          <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}