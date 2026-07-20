import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { getServices } from "@/lib/services";
import { getPosts } from "@/lib/posts";
import { matchesQuery } from "@/lib/search";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return { title: `Tìm kiếm – ${siteConfig.name}` };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const matchedServices = query
    ? getServices().filter((s) => matchesQuery(s.name, query) || matchesQuery(s.summary, query))
    : [];
  const matchedPosts = query
    ? getPosts().filter((p) => matchesQuery(p.title, query) || matchesQuery(p.excerpt, query))
    : [];

  const hasResults = matchedServices.length > 0 || matchedPosts.length > 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl mb-2">Kết quả tìm kiếm</h1>
      <p className="mb-8">
        Từ khoá: <strong>&ldquo;{q ?? ""}&rdquo;</strong>
      </p>

      {!query && <p>Nhập từ khoá để tìm kiếm dịch vụ hoặc bài viết.</p>}

      {query && !hasResults && <p>Không tìm thấy kết quả phù hợp.</p>}

      {matchedServices.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading text-2xl mb-4">Dịch vụ</h2>
          <ul className="space-y-2">
            {matchedServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/dich-vu/${s.slug}`} className="link-hover text-primary hover:underline">
                  {s.name}
                </Link>
                <span className="text-sm"> — {s.duration}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {matchedPosts.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl mb-4">Bài viết</h2>
          <ul className="space-y-2">
            {matchedPosts.map((p) => (
              <li key={p.slug}>
                <Link href={`/goc-chia-se/${p.slug}`} className="link-hover text-primary hover:underline">
                  {p.title}
                </Link>
                <span className="text-sm text-secondary"> — {p.date}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
