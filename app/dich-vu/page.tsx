import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { getZaloUrl } from "@/lib/urls";
import { getServices } from "@/lib/services";
import Reveal from "@/components/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return { title: `Dịch vụ – ${siteConfig.name}` };
}

export default async function ServicesPage() {
  const siteConfig = await getSiteConfig();
  const services = await getServices();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl text-center mb-2">Dịch vụ</h1>
      <p className="text-center mb-10">Tất cả liệu trình tại {siteConfig.name}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 100}>
            <Link
              href={`/dich-vu/${s.slug}`}
              className="group block rounded-lg overflow-hidden border border-creamLight hover:shadow-lg transition-shadow bg-white h-full"
            >
              <div className="relative h-48 w-full">
                <Image src={s.image} alt={s.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h2 className="inline-block font-heading text-lg transition-transform duration-200 group-hover:text-primary group-hover:scale-105">
                  {s.name}
                </h2>
                <p className="text-sm mt-1">{s.duration}</p>
                <p className="text-sm mt-2 line-clamp-2">{s.summary}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link
          href="/lien-he"
          className="inline-block bg-primary text-white px-7 py-3 rounded hover:bg-secondary transition-colors"
        >
          Đặt lịch hẹn ngay
        </Link>
        <a
          href={getZaloUrl(siteConfig.zalo)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-2 border-primary text-primary px-7 py-3 rounded hover:bg-primary hover:text-white transition-colors"
        >
          Liên hệ ngay
        </a>
      </div>
    </main>
  );
}
