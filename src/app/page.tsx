// src/app/page.tsx

/**
 * The Homepage component.
 * This is the main landing page of the application.
 * It features a hero section for a strong first impression and a section
 * that will later be populated with a list of articles from the Strapi CMS.
 * @returns {JSX.Element} The rendered homepage.
 */
export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
          Explore, Discover, Learn
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Your central hub for high-quality content on technology, design, and more.
        </p>
      </section>

      {/* Articles List Section */}
      <section className="mt-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Latest Articles
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12">
          <p>Article list from Strapi will be displayed here.</p>
          <p className="text-sm mt-2">
            (Our next step is to set up the Strapi CMS to manage this content.)
          </p>
        </div>
      </section>
    </>
  );
}