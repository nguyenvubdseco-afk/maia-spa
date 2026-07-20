import Link from "next/link";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import Reveal from "@/components/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return { title: `Tuyển dụng – ${siteConfig.name}` };
}

export default function CareersPage() {
  const siteConfig = getSiteConfig();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Reveal>
        <h1 className="font-heading text-2xl text-center mb-6">
          [Điền tiêu đề tin tuyển dụng, ví dụ: Tuyển gấp Kỹ thuật viên Massage Trị liệu]
        </h1>

        <p className="mb-6">
          {siteConfig.name} luôn tìm kiếm kỹ thuật viên và nhân sự yêu nghề, mong muốn phát triển trong lĩnh
          vực chăm sóc sức khoẻ – dưỡng sinh cổ truyền.
        </p>
      </Reveal>

      <Reveal>
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-creamLight rounded-lg p-6">
            <h2 className="font-heading text-xl mb-3">Yêu cầu</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>[Điền yêu cầu kinh nghiệm]</li>
              <li>[Điền yêu cầu độ tuổi/giới tính nếu có]</li>
              <li>[Điền yêu cầu khác]</li>
            </ul>
          </div>
          <div className="bg-creamLight rounded-lg p-6">
            <h2 className="font-heading text-xl mb-3">Quyền lợi</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>[Điền mức lương/thu nhập]</li>
              <li>[Điền chế độ đào tạo]</li>
              <li>[Điền chế độ đãi ngộ khác]</li>
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <h2 className="font-heading text-xl mb-3">Cách ứng tuyển</h2>
        <p className="mb-6 italic">[Điền cách thức ứng tuyển: gọi điện, nộp hồ sơ trực tiếp, gửi email...]</p>
      </Reveal>

      <Link
        href="/lien-he?type=job"
        className="inline-block bg-primary text-white px-7 py-3 rounded hover:bg-secondary transition-colors"
      >
        Liên hệ ứng tuyển
      </Link>
    </main>
  );
}
