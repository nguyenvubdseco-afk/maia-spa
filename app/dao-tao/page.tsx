import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { getZaloUrl } from "@/lib/urls";
import Reveal from "@/components/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return { title: `Đào tạo – ${siteConfig.name}` };
}

const benefits = [
  "Giảm đau mỏi vai gáy, lưng, tê bì tay chân",
  "Cải thiện tuần hoàn khí huyết",
  "Hỗ trợ giấc ngủ, giảm căng thẳng",
  "Tăng cường sức đề kháng, phục hồi thể lực",
];

export default function TrainingPage() {
  const siteConfig = getSiteConfig();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Reveal>
        <h1 className="font-heading text-3xl mb-6">Đào tạo</h1>
        <Image
          src="/images/massage-full-body.jpg"
          alt="Đào tạo kỹ thuật viên"
          width={800}
          height={534}
          className="w-full h-auto rounded-lg mb-6"
        />
        <p className="mb-6">
          {siteConfig.name} tổ chức các khoá đào tạo kỹ thuật xoa bóp, bấm huyệt và dưỡng sinh cổ truyền
          dành cho học viên mong muốn theo nghề hoặc nâng cao tay nghề.
        </p>
      </Reveal>

      <Reveal>
        <h2 className="font-heading text-2xl mb-4">Các công dụng mà trị liệu dưỡng sinh đông y mang lại</h2>
        <ul className="list-disc list-inside space-y-1 mb-8">
          {benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <div className="bg-creamLight rounded-lg p-6 mb-8">
          <h3 className="font-heading text-xl mb-3">Thông tin khoá học</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>Nội dung:</strong> [Điền nội dung chương trình đào tạo]
            </li>
            <li>
              <strong>Thời lượng:</strong> [Điền số buổi / tuần học]
            </li>
            <li>
              <strong>Học phí:</strong> [Điền học phí]
            </li>
            <li>
              <strong>Lịch khai giảng:</strong> [Điền lịch khai giảng gần nhất]
            </li>
          </ul>
        </div>
      </Reveal>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/lien-he"
          className="inline-block bg-primary text-white px-7 py-3 rounded hover:bg-secondary transition-colors"
        >
          Đăng ký tư vấn
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
