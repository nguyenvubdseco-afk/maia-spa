import ServiceGrid from "@/components/ServiceGrid";
import SplitSection from "@/components/SplitSection";
import Testimonials from "@/components/Testimonials";
import VoucherModal from "@/components/VoucherModal";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import Image from "next/image";
import { getSiteConfig } from "@/lib/config";
import { getZaloUrl } from "@/lib/urls";
import { getServices } from "@/lib/services";

const benefits = [
  { icon: "/images/icon-01b.png", text: "An toàn — quy trình vô trùng, kỹ thuật viên được đào tạo bài bản" },
  { icon: "/images/icon-02.png", text: "Giờ giấc linh hoạt — đặt lịch theo nhu cầu của bạn" },
  { icon: "/images/icon-03.png", text: "Không gian thư giãn — yên tĩnh, riêng tư" },
  { icon: "/images/icon-04.png", text: "Cân bằng cuộc sống — chăm sóc cả thể chất lẫn tinh thần" },
  { icon: "/images/icon-05.png", text: "Tư vấn sức khỏe tận tình trước và sau liệu trình" },
  { icon: "/images/icon-06.png", text: "Báo cáo hiệu quả điều trị rõ ràng sau mỗi liệu trình" },
];

const SERVICES_PER_COLUMN = 5;

export default async function HomePage() {
  const siteConfig = await getSiteConfig();
  const services = await getServices();
  const serviceColumns = [
    services.slice(0, SERVICES_PER_COLUMN),
    services.slice(SERVICES_PER_COLUMN, SERVICES_PER_COLUMN * 2),
    services.slice(SERVICES_PER_COLUMN * 2, SERVICES_PER_COLUMN * 3),
  ].filter((col) => col.length > 0);

  return (
    <main className="max-w-6xl mx-auto px-4">
      {/* Hero — hiện ngay khi tải trang, không cần hiệu ứng cuộn */}
      <div
        className="relative min-h-[480px] rounded-lg overflow-hidden bg-cover bg-center flex flex-col items-center justify-center text-center px-6 py-16 mt-6"
        style={{ backgroundImage: `url('${siteConfig.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-dark/55" />
        <div className="relative z-10 max-w-2xl">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={1419}
            height={704}
            className="h-20 sm:h-24 w-auto mx-auto mb-4"
          />
          <h1 className="sr-only">{siteConfig.name}</h1>
          <p className="font-script text-[#FEF1E5] text-4xl md:text-5xl">{siteConfig.heroQuote}</p>
        </div>
      </div>

      <div className="text-center mt-6 mb-4">
        <VoucherModal image={siteConfig.voucherImage} />
      </div>

      {/* Featured services */}
      <Reveal>
        <h2 className="font-heading text-3xl text-center mb-8">Các liệu trình nổi bật</h2>
        <ServiceGrid />
        <p className="text-center my-8">
          <Link
            href="/dich-vu"
            className="inline-block bg-primary text-white px-7 py-3 rounded hover:bg-secondary transition-colors"
          >
            Xem tất cả dịch vụ
          </Link>
        </p>
      </Reveal>

      {/* About */}
      <Reveal>
        <SplitSection
          eyebrow="Spa dưỡng sinh trị liệu đông y"
          title={siteConfig.name}
          text="Chuyên trị liệu đau mỏi vai gáy, đau thắt lưng, thần kinh tọa, tê bì chân tay, đau đầu mất ngủ, rối loạn tiền đình, suy giãn tĩnh mạch."
          image="/images/massage-full-body.jpg"
          imageAlt={siteConfig.name}
        />
      </Reveal>

      {/* Post-COVID */}
      <Reveal>
        <SplitSection
          eyebrow="Dưỡng Sinh kết hợp Trị liệu"
          title="Trị liệu - Dưỡng sinh hậu COVID"
          text="Đau nhức mỏi toàn thân, người uể oải, tóc rụng nhiều, mệt mỏi kéo dài, tức ngực, khó thở, đầy hơi — chương trình chăm sóc phục hồi dành riêng cho khách hàng gặp di chứng hậu COVID."
          image="/images/massage-head.jpg"
          imageAlt="Trị liệu dưỡng sinh hậu COVID"
          reverse
        />
      </Reveal>

      {/* Chuyên trị — lấy toàn bộ dịch vụ, chia 3 cột x 5 dịch vụ/cột */}
      <Reveal>
        <section className="my-12">
          <h3 className="font-heading text-2xl mb-4">Chuyên trị</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8">
            {serviceColumns.map((column, colIndex) => (
              <ul key={colIndex} className="list-disc list-inside space-y-1">
                {column.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/dich-vu/${s.slug}`}
                      className="link-hover hover:text-primary transition-colors"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Benefits */}
      <section className="my-12">
        <Reveal>
          <h3 className="font-heading text-2xl mb-6">Vì sao chọn {siteConfig.name}?</h3>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <Reveal key={b.text} delay={i * 100}>
              <div className="bg-creamLight rounded-lg p-5 text-center h-full">
                <Image src={b.icon} alt="" width={48} height={48} className="mx-auto mb-3" />
                <p className="font-body text-sm">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <Testimonials />
      </Reveal>

      {/* Hours + CTA */}
      <Reveal>
        <section className="my-12 text-center">
          <h3 className="font-heading text-2xl mb-2">Giờ mở cửa</h3>
          <p className="mb-6">Thứ 2 – Chủ nhật: {siteConfig.openingHours}</p>
          <div className="flex flex-wrap justify-center gap-3">
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
        </section>
      </Reveal>

      <div className="text-center pb-6">
        <Link href="/admin" className="link-hover text-xs text-body/50 hover:text-primary transition-colors">
          🔒 Đăng nhập quản trị
        </Link>
      </div>
    </main>
  );
}
