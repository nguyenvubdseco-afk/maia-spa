import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getSiteConfig } from "@/lib/config";
import { ensureAbsoluteUrl } from "@/lib/urls";
import Reveal from "@/components/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return { title: `Liên hệ – ${siteConfig.name}` };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const siteConfig = await getSiteConfig();
  const { type } = await searchParams;
  const isJob = type === "job";
  const mapsUrl = ensureAbsoluteUrl(siteConfig.googleMaps);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Reveal>
        <h1 className="font-heading text-3xl mb-6">{isJob ? "Ứng tuyển" : "Liên hệ"}</h1>

        <div className="mb-8 space-y-1">
          <p><strong>Địa chỉ:</strong> {siteConfig.address}</p>
          <p><strong>Điện thoại:</strong> {siteConfig.phone}</p>
          <p><strong>Zalo:</strong> {siteConfig.zalo}</p>
          <p><strong>Facebook:</strong> {siteConfig.facebook}</p>
          <p><strong>Giờ mở cửa:</strong> Thứ 2 – Chủ nhật, {siteConfig.openingHours}</p>
        </div>

        <h2 className="font-heading text-2xl mb-3">Bản đồ</h2>
        {mapsUrl === "#" ? (
          <p className="italic mb-8">[Chèn link Google Maps trong trang quản trị để hiện nút xem bản đồ tại đây]</p>
        ) : (
          <p className="mb-8">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded hover:bg-secondary transition-colors"
            >
              📍 Xem trên Google Maps
            </a>
          </p>
        )}
      </Reveal>

      <Reveal>
        <h2 className="font-heading text-2xl mb-4">
          {isJob ? "Gửi thông tin ứng tuyển" : "Gửi tin nhắn cho chúng tôi"}
        </h2>
        <ContactForm type={isJob ? "job" : "booking"} />
      </Reveal>
    </main>
  );
}
