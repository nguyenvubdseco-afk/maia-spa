import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { getZaloUrl } from "@/lib/urls";
import { getServices, getServiceBySlug } from "@/lib/services";
import Reveal from "@/components/Reveal";

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const siteConfig = await getSiteConfig();
  const service = await getServiceBySlug(slug);
  return { title: service ? `${service.name} – ${siteConfig.name}` : siteConfig.name };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const services = await getServices();
  const siteConfig = await getSiteConfig();

  if (!service) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <Reveal>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <p className="font-body text-sm mb-2">
              <span className="text-secondary">Giá trải nghiệm: </span>
              {service.price || "[Điền giá]"} &nbsp;•&nbsp; {service.duration}
            </p>
            <h1 className="font-heading text-3xl mb-4">{service.name}</h1>
            <p className="mb-4">{service.summary}</p>
            <p>{service.description}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/lien-he"
                className="inline-block bg-primary text-white px-7 py-3 rounded hover:bg-secondary transition-colors"
              >
                Đặt lịch hẹn
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
          </div>
          <div className="flex-1 w-full">
            <Image
              src={service.image}
              alt={service.name}
              width={800}
              height={800}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </Reveal>

      <Reveal>
        <section className="mt-16">
          <h2 className="font-heading text-2xl mb-6">Liệu trình khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {services
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/dich-vu/${s.slug}`}
                  className="group relative rounded-lg overflow-hidden min-h-[160px] bg-cover bg-center flex items-end"
                  style={{ backgroundImage: `url('${s.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/85 to-dark/5" />
                  <div className="relative z-10 inline-block text-white p-4 transition-transform duration-200 group-hover:scale-110">
                    <p className="font-heading text-base">{s.name}</p>
                    <p className="text-xs">{s.duration}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </Reveal>
    </main>
  );
}
