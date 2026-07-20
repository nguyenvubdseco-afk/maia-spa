import Image from "next/image";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import Reveal from "@/components/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return { title: `Giới thiệu – ${siteConfig.name}` };
}

export default async function AboutPage() {
  const siteConfig = await getSiteConfig();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Reveal>
        <h1 className="font-heading text-3xl mb-6">Câu chuyện của {siteConfig.name}</h1>
        <Image
          src="/images/massage-head.jpg"
          alt={`Chăm sóc trị liệu tại ${siteConfig.name}`}
          width={800}
          height={534}
          className="w-full h-auto rounded-lg mb-6"
        />
        <p className="mb-6">
          {siteConfig.name} ra đời với mong muốn mang y học cổ truyền phương Đông đến gần hơn với cuộc sống
          hiện đại. Chúng tôi tin rằng khi kinh mạch lưu thông, khí huyết điều hoà, cơ thể sẽ tự khắc phục
          hồi và duy trì trạng thái khoẻ mạnh bền vững.
        </p>
      </Reveal>

      <Reveal>
        <h2 className="font-heading text-2xl mb-3">Sứ mệnh</h2>
        <p className="mb-6">
          Đồng hành cùng khách hàng chăm sóc sức khoẻ chủ động — không chỉ giảm đau tức thời mà còn hướng
          đến cân bằng thể chất và tinh thần lâu dài, thông qua các liệu pháp xoa bóp, bấm huyệt, giác hơi
          và tư vấn dưỡng sinh.
        </p>
      </Reveal>

      <Reveal>
        <h2 className="font-heading text-2xl mb-3">Đội ngũ kỹ thuật viên</h2>
        <p className="mb-2">
          Đội ngũ kỹ thuật viên tại {siteConfig.name} được đào tạo bài bản về giải phẫu, huyệt đạo và các kỹ
          thuật trị liệu cổ truyền, thường xuyên cập nhật phương pháp mới để đảm bảo hiệu quả và an toàn cho
          khách hàng.
        </p>
        <p className="italic mb-6">
          [Điền thông tin chi tiết về đội ngũ, chứng chỉ, số năm kinh nghiệm...]
        </p>
      </Reveal>

      <Reveal>
        <h2 className="font-heading text-2xl mb-3">Cam kết</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Quy trình vô trùng, an toàn tuyệt đối</li>
          <li>Tư vấn rõ ràng trước khi thực hiện liệu trình</li>
          <li>Theo dõi và báo cáo hiệu quả sau mỗi buổi trị liệu</li>
        </ul>
      </Reveal>
    </main>
  );
}
