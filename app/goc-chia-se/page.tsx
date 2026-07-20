import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { getPosts } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return { title: `Góc chia sẻ – ${siteConfig.name}` };
}

export default function BlogPage() {
  const siteConfig = getSiteConfig();
  const posts = getPosts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl text-center mb-2">Góc chia sẻ</h1>
      <p className="text-center mb-10">
        Bài viết chia sẻ kiến thức chăm sóc sức khoẻ, dưỡng sinh theo y học cổ truyền từ {siteConfig.name}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 100}>
            <article className="rounded-lg overflow-hidden border border-creamLight bg-white h-full">
              <Link href={`/goc-chia-se/${p.slug}`} className="block relative h-44 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
              </Link>
              <div className="p-4">
                <h2 className="font-heading text-base leading-snug mb-2">
                  <Link href={`/goc-chia-se/${p.slug}`} className="link-hover hover:text-primary transition-colors">
                    {p.title}
                  </Link>
                </h2>
                <p className="text-xs text-secondary mb-2">{p.date}</p>
                <p className="text-sm line-clamp-2 mb-3">{p.excerpt}</p>
                <Link href={`/goc-chia-se/${p.slug}`} className="link-hover text-sm text-primary hover:underline">
                  Đọc thêm →
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
