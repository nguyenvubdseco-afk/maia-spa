import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/lib/config";
import { getZaloUrl } from "@/lib/urls";

export default function SplitSection({
  eyebrow,
  title,
  text,
  image,
  imageAlt,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  const siteConfig = getSiteConfig();

  return (
    <div className={`flex flex-col md:flex-row items-center gap-10 my-12 ${reverse ? "md:flex-row-reverse" : ""}`}>
      <div className="flex-1">
        <p className="font-body text-secondary uppercase tracking-wide text-xs mb-2">{eyebrow}</p>
        <h2 className="font-heading text-3xl mb-4">{title}</h2>
        <p className="font-body mb-6">{text}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/lien-he"
            className="inline-block bg-primary text-white font-body px-7 py-3 rounded hover:bg-secondary transition-colors"
          >
            Đặt Lịch
          </Link>
          <a
            href={getZaloUrl(siteConfig.zalo)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-primary text-primary font-body px-7 py-3 rounded hover:bg-primary hover:text-white transition-colors"
          >
            Liên hệ ngay
          </a>
        </div>
      </div>
      <div className="flex-1 w-full">
        <Image
          src={image}
          alt={imageAlt}
          width={600}
          height={400}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    </div>
  );
}
