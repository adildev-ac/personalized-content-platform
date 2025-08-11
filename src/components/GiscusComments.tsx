"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  mapping?: "pathname" | "url" | "title" | "og:title";
  theme?: string;
};

export default function GiscusComments({ mapping = "pathname", theme = "preferred_color_scheme" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as string | undefined;
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string | undefined;
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string | undefined;
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string | undefined;
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
    scriptEl.setAttribute("data-mapping", mapping);
    scriptEl.setAttribute("data-strict", "0");
    scriptEl.setAttribute("data-reactions-enabled", "1");
    scriptEl.setAttribute("data-emit-metadata", "0");
    scriptEl.setAttribute("data-input-position", "bottom");
    scriptEl.setAttribute("data-theme", theme);
    scriptEl.setAttribute("data-lang", "en");
    if (ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(scriptEl);
    }
    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [mapping, theme]);

  if (!enabled) {
    return (
      <div className="mt-10 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-sm text-gray-600 dark:text-gray-400">
        Comments are not configured. Set NEXT_PUBLIC_GISCUS_* env variables to enable Giscus.
      </div>
    );
  }

  return <div ref={ref} className="mt-10" />;
}
