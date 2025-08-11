"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Array<{id:number;slug:string;title:string;excerpt:string;tags:string[]}>>([]);

  useEffect(() => {
    fetch("/api/search-index")
      .then((r) => r.json())
      .then((d) => setIndex(d || []))
      .catch(() => setIndex([]));
  }, []);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return index;
    return index.filter((i) =>
      (i.title || "").toLowerCase().includes(t) ||
      (i.excerpt || "").toLowerCase().includes(t) ||
      (i.tags || []).some((tag) => (tag || "").toLowerCase().includes(t))
    );
  }, [q, index]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title, excerpt, or tag..."
        className="w-full border rounded px-4 py-2 mb-6 dark:bg-gray-900 dark:border-gray-700"
      />
      <ul className="space-y-4">
        {results.map((r) => (
          <li key={r.id}>
            <Link href={`/articles/${r.slug}`} className="text-lg font-semibold hover:underline">
              {r.title}
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">{r.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
