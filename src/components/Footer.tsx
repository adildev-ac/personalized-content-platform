// src/components/Footer.tsx

/**
 * The shared Footer component for the website.
 * It displays the copyright notice with the current year.
 * @returns {JSX.Element} The rendered footer component.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="container mx-auto text-center p-4">
        <p className="text-gray-600 dark:text-gray-400">
          © {currentYear} Personalized Content Platform. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}