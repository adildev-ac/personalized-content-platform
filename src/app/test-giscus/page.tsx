// Test page to verify Giscus configuration
import GiscusComments from '@/components/GiscusComments';

export default function TestGiscusPage() {
  // Debug environment variables on server side
  const envVars = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
    mapping: process.env.NEXT_PUBLIC_GISCUS_MAPPING,
    theme: process.env.NEXT_PUBLIC_GISCUS_THEME,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Test Giscus Configuration</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        This page is used to test if the Giscus comments configuration is working correctly.
        If configured properly, you should see a Giscus comments section below.
      </p>
      
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Environment Variables Debug:</h3>
        <pre className="text-sm">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
      
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Comments Section</h2>
        <GiscusComments />
      </section>
    </div>
  );
}