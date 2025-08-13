"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  mapping?: "pathname" | "url" | "title" | "og:title";
  theme?: string;
};

// Create a global tracking variable to prevent multiple initializations
let giscusInitialized = false;

// Allowlist of trusted parameters
const ALLOWED_THEMES = ["light", "light_high_contrast", "light_protanopia", "light_tritanopia", 
                        "dark", "dark_high_contrast", "dark_protanopia", "dark_tritanopia", 
                        "dark_dimmed", "transparent_dark", "preferred_color_scheme"] as const;

const ALLOWED_MAPPINGS = ["pathname", "url", "title", "og:title"] as const;

// Secure URLs
const GISCUS_SCRIPT_URL = "https://giscus.app/client.js";
const ALLOWED_ORIGINS = ['https://giscus.app'];

export default function GiscusComments({ 
  mapping = "pathname", 
  theme = "preferred_color_scheme" 
}: Props) {
  // Validate inputs - security enhancement
  const validatedMapping = ALLOWED_MAPPINGS.includes(mapping as any) ? mapping : "pathname";
  const validatedTheme = ALLOWED_THEMES.includes(theme as any) ? theme : "preferred_color_scheme";

  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  // Reset and validate env vars on component mount or when props change
  useEffect(() => {
    // Reset error state on config changes
    setError(null);

    try {
      // IMPORTANT: Access env vars via direct property (static) so Next.js inlines them.
      const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as string | undefined;
      const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string | undefined;
      const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string | undefined;
      const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string | undefined;
      
      // Input validation
      const missing: string[] = [];
      if (!repo) missing.push('NEXT_PUBLIC_GISCUS_REPO');
      if (!repoId) missing.push('NEXT_PUBLIC_GISCUS_REPO_ID');
      if (!category) missing.push('NEXT_PUBLIC_GISCUS_CATEGORY');
      if (!categoryId) missing.push('NEXT_PUBLIC_GISCUS_CATEGORY_ID');
      
      setMissingKeys(missing);
      
      // Validate repo format (owner/repo)
      if (repo && !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
        throw new Error(`Invalid repository format: ${repo}. Expected format: owner/repo`);
      }
      
      // Validate that repoId looks like a GitHub repo ID
      if (repoId && !/^R_[a-zA-Z0-9_]+$/.test(repoId)) {
        throw new Error(`Invalid repository ID format: ${repoId}`);
      }
      
      // Validate categoryId format
      if (categoryId && !/^DIC_[a-zA-Z0-9_]+$/.test(categoryId)) {
        throw new Error(`Invalid category ID format: ${categoryId}`);
      }
      
      // Don't enable if required config is missing
      
      // If we get here, all validation passed
      setEnabled(true);
    } catch (err) {
      setEnabled(false);
      setError(err instanceof Error ? err.message : String(err));
      console.error("Giscus configuration error:", err);
    }
  }, [validatedMapping, validatedTheme]);

  // Separate effect that only runs when ref is available AND enabled is true
  useEffect(() => {
    // Don't proceed if component is not enabled or ref isn't ready or if there was an error
    if (!enabled || !ref.current || error) {
      return;
    }
    
    try {
      // Multiple layers of protection against double initialization
      if (giscusInitialized || 
          document.querySelector('.giscus-frame') ||
          document.querySelector(`script[src="${GISCUS_SCRIPT_URL}"]`) ||
          document.getElementById('giscus-script')) {
        // Already initialized, just check for loaded state
        if (document.querySelector('.giscus-frame')) {
          setLoaded(true);
        }
        return;
      }

      // Set global flag to prevent future initializations
      giscusInitialized = true;
      
      // Verify script URL is from allowed origin
      if (!ALLOWED_ORIGINS.some(origin => GISCUS_SCRIPT_URL.startsWith(origin))) {
        throw new Error('Invalid script source origin');
      }
    
      // Safely clear existing content using DOM methods instead of innerHTML
      while (ref.current.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
      
      // Create the script element with CSP considerations
      const scriptEl = document.createElement("script");
      scriptEl.src = GISCUS_SCRIPT_URL; // Using constant for security
      scriptEl.async = true;
      scriptEl.crossOrigin = "anonymous";
      
      // Add integrity check if Giscus provides a hash (they currently don't)
      // scriptEl.integrity = "sha384-..."; // Add if Giscus provides this in the future
      
      // Prevent double initialization by marking the script
      scriptEl.id = "giscus-script";
      
      // Access env vars directly to ensure Next.js inlines them
      scriptEl.setAttribute("data-repo", process.env.NEXT_PUBLIC_GISCUS_REPO!);
      scriptEl.setAttribute("data-repo-id", process.env.NEXT_PUBLIC_GISCUS_REPO_ID!);
      scriptEl.setAttribute("data-category", process.env.NEXT_PUBLIC_GISCUS_CATEGORY!);
      scriptEl.setAttribute("data-category-id", process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!);
      scriptEl.setAttribute("data-mapping", process.env.NEXT_PUBLIC_GISCUS_MAPPING || mapping);
      scriptEl.setAttribute("data-strict", process.env.NEXT_PUBLIC_GISCUS_STRICT === "1" ? "1" : "0");
      scriptEl.setAttribute("data-reactions-enabled", process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED === "1" ? "1" : "0");
      scriptEl.setAttribute("data-emit-metadata", process.env.NEXT_PUBLIC_GISCUS_EMIT_METADATA === "1" ? "1" : "0");
      scriptEl.setAttribute("data-input-position", (process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION === "top") ? "top" : "bottom");
      scriptEl.setAttribute("data-theme", process.env.NEXT_PUBLIC_GISCUS_THEME || theme);
      scriptEl.setAttribute("data-lang", process.env.NEXT_PUBLIC_GISCUS_LANG || "en");
      
      // Create a script loading handler to detect when Giscus is fully loaded
      scriptEl.onload = () => {
        // The script has loaded, but we still need to wait for the iframe
        const checkFrame = setInterval(() => {
          if (document.querySelector('.giscus-frame')) {
            setLoaded(true);
            clearInterval(checkFrame);
          }
        }, 300);
        
        // Safety timeout after 5 seconds
        setTimeout(() => clearInterval(checkFrame), 5000);
      };
      
      // Append the script to the container
      ref.current.appendChild(scriptEl);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error("Error initializing Giscus:", err);
    }
    
    return () => {
      // Only clean up if this is the component that created the script
      if (!document.getElementById('giscus-script')) {
        return;
      }
      
      // Reset initialization flag on unmount to prevent memory leaks
      giscusInitialized = false;
      
      // Clean up without removing the loaded Giscus frame, using safer DOM methods
      if (ref.current) {
        const script = ref.current.querySelector(`script[src="${GISCUS_SCRIPT_URL}"]`);
        if (script && script.parentNode) {
          // Remove script element
          script.parentNode.removeChild(script);
          
          // Clean up any potential event listeners
          const giscusFrame = document.querySelector('.giscus-frame');
          if (giscusFrame && giscusFrame.parentNode) {
            giscusFrame.parentNode.removeChild(giscusFrame);
          }
        }
      }
    };
  }, [enabled, mapping, theme]); // Remove ref.current dependency

  if (!enabled) {
    return (
      <div className="mt-10 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p className="font-medium text-gray-800 dark:text-gray-200">Comments not configured.</p>
        {missingKeys.length ? (
          <>
            <p>Missing environment variables:</p>
            <ul className="list-disc ml-5">
              {missingKeys.map(k => <li key={k}><code className="text-xs font-mono">{k}</code></li>)}
            </ul>
            <p className="text-xs leading-relaxed">
              Create a <code>.env.local</code> file in the project root (same folder as <code>package.json</code>) with lines like:<br/>
              <code className="block mt-1">NEXT_PUBLIC_GISCUS_REPO=owner/repo</code>
              <code className="block">NEXT_PUBLIC_GISCUS_REPO_ID=...</code>
              <code className="block">NEXT_PUBLIC_GISCUS_CATEGORY=General</code>
              <code className="block">NEXT_PUBLIC_GISCUS_CATEGORY_ID=...</code>
              After saving, fully stop and restart <code>npm run dev</code>. Fast Refresh alone will NOT pick up new env variables.
            </p>
            <p className="text-xs">Get the IDs via https://giscus.app by selecting your repo & copying the generated values.</p>
          </>
        ) : (
          <p>Set NEXT_PUBLIC_GISCUS_* variables and restart dev server.</p>
        )}
      </div>
    );
  }

  const ownerRepo = process.env.NEXT_PUBLIC_GISCUS_REPO || "";
  const categoryName = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "";
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const openLink = ownerRepo
    ? `https://github.com/${ownerRepo}/discussions/new?category=${encodeURIComponent(categoryName)}&title=${encodeURIComponent(pathname)}`
    : undefined;

  return (
    <div className="mt-16 mb-10">
      <div className="border-t dark:border-gray-800 pt-8">
        <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Comments</h3>
        
        {/* Modern rectangle container for Giscus */}
        <div 
          ref={ref} 
          className="giscus w-full min-h-[240px] rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4"
          data-testid="giscus-container" 
          id="giscus-container"
        />
        
        {/* Loading state */}
        {!loaded && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p className="animate-pulse">Loading comments...</p>
            <p className="mt-2">
              {openLink && (
                <a 
                  className="text-blue-600 dark:text-blue-400 hover:underline transition-colors" 
                  href={openLink} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  Start the conversation
                </a>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}