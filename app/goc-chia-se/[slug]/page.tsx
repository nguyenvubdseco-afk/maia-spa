import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { getPosts, getPostBySlug } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteConfig = await getSiteConfig();
  const post = await getPostBySlug(slug);
  return { title: post ? `${post.title} – ${siteConfig.name}` : siteConfig.name };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Reveal>
        <p className="text-sm text-secondary mb-2">{post.date}</p>
        <h1 className="font-heading text-3xl mb-6">{post.title}</h1>
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={534}
          className="w-full h-auto rounded-lg mb-6"
        />
      </Reveal>
      <Reveal>
        {post.content.map((paragraph, i) => (
          <p key={i} className="mb-4">
            {paragraph}
          </p>
        ))}
      </Reveal>

      <Link href="/goc-chia-se" className="link-hover inline-block mt-6 text-primary hover:underline">
        ← Xem tất cả bài viết
      </Link>
    </main>
  );
}
