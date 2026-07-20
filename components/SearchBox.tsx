"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        aria-label="Tìm kiếm"
        onClick={() => setOpen(true)}
        className="text-heading hover:text-primary transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-dark/60 flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl mb-4">Tìm kiếm bài viết / dịch vụ</h3>
            <form onSubmit={submit} className="flex gap-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Từ khoá..."
                className="flex-1 border border-creamLight rounded px-3 py-2"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
              >
                Tìm
              </button>
            </form>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 text-sm text-secondary hover:underline"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
