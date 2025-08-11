"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  mapping?: "pathname" | "url" | "title" | "og:title";
  theme?: string;
};

export default function GiscusComments({ mapping = "pathname", theme = "preferred_color_scheme" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as string | undefined;
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string | undefined;
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string | undefined;
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string | undefined;
    const mappingEnv = (process.env.NEXT_PUBLIC_GISCUS_MAPPING as string | undefined) || mapping;
    const themeEnv = (process.env.NEXT_PUBLIC_GISCUS_THEME as string | undefined) || theme;
    const strictEnv = (process.env.NEXT_PUBLIC_GISCUS_STRICT as string | undefined) ?? "0"; // "0" or "1"
    const langEnv = (process.env.NEXT_PUBLIC_GISCUS_LANG as string | undefined) || "en";
    const reactionsEnv = (process.env.NEXT_PUBLIC_GISCUS_REACTIONS_ENABLED as string | undefined) ?? "1"; // "0" or "1"
    const emitMetadataEnv = (process.env.NEXT_PUBLIC_GISCUS_EMIT_METADATA as string | undefined) ?? "0"; // "0" or "1"
    const inputPosEnv = (process.env.NEXT_PUBLIC_GISCUS_INPUT_POSITION as string | undefined) || "bottom"; // "top" | "bottom"
    if (!repo || !repoId || !category || !categoryId) {
      setEnabled(false);
      return;
    }
  setEnabled(true);
    const scriptEl = document.createElement("script");
    scriptEl.src = "https://giscus.app/client.js";
    scriptEl.async = true;
    scriptEl.crossOrigin = "anonymous";
    scriptEl.setAttribute("data-repo", repo);
    scriptEl.setAttribute("data-repo-id", repoId);
    scriptEl.setAttribute("data-category", category);
    scriptEl.setAttribute("data-category-id", categoryId);
    scriptEl.setAttribute("data-mapping", mappingEnv);
    scriptEl.setAttribute("data-strict", strictEnv === "1" ? "1" : "0");
    scriptEl.setAttribute("data-reactions-enabled", reactionsEnv === "1" ? "1" : "0");
    scriptEl.setAttribute("data-emit-metadata", emitMetadataEnv === "1" ? "1" : "0");
    scriptEl.setAttribute("data-input-position", inputPosEnv === "top" ? "top" : "bottom");
    scriptEl.setAttribute("data-theme", themeEnv);
    scriptEl.setAttribute("data-lang", langEnv);
    if (ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(scriptEl);
    }
    const timer = window.setTimeout(() => {
      const hasFrame = !!ref.current?.querySelector('iframe.giscus-frame');
      setLoaded(hasFrame);
    }, 3000);
    return () => {
      if (ref.current) ref.current.innerHTML = "";
      window.clearTimeout(timer);
    };
  }, [mapping, theme]);

  if (!enabled) {
    return (
      <div className="mt-10 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-600 dark:text-gray-400">
        Comments are not configured. Set NEXT_PUBLIC_GISCUS_* env variables to enable Giscus.
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
    <div className="mt-10">
      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Comments</h3>
      <div ref={ref} className="giscus min-h-[120px]" />
      {!loaded && openLink && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          If nothing appears, sign in with GitHub or pre-create the thread:
          {' '}<a className="text-blue-600 dark:text-blue-400 underline" href={openLink} target="_blank" rel="noreferrer">Open discussion</a>.
        </p>
      )}
    </div>
  );
}
