"use client";

import { useState } from "react";
import type { SiteConfig } from "@/lib/config";
import ImageUploadField from "./ImageUploadField";

export default function SiteForm({ initial }: { initial: SiteConfig }) {
  const [config, setConfig] = useState<SiteConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  function setPromoItem(index: number, value: string) {
    setConfig((c) => {
      const items = [...c.promoItems];
      items[index] = value;
      return { ...c, promoItems: items };
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setMessage(res.ok ? "Đã lưu." : "Lưu thất bại.");
  }

  const field = "w-full border border-creamLight rounded px-3 py-2";

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Tên spa</label>
        <input className={field} value={config.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tagline</label>
        <input className={field} value={config.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Câu quote hero (chữ script)</label>
        <input className={field} value={config.heroQuote} onChange={(e) => set("heroQuote", e.target.value)} />
      </div>

      <ImageUploadField
        label="Ảnh nền hero (trang chủ)"
        value={config.heroImage}
        onChange={(v) => set("heroImage", v)}
      />
      <ImageUploadField
        label="Ảnh voucher (popup 'Nhận quà')"
        value={config.voucherImage}
        onChange={(v) => set("voucherImage", v)}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Tiêu đề khối ưu đãi</label>
        <input className={field} value={config.promoTitle} onChange={(e) => set("promoTitle", e.target.value)} />
      </div>
      {config.promoItems.map((item, i) => (
        <div key={i}>
          <label className="block text-sm font-medium mb-1">Ưu đãi {i + 1}</label>
          <input className={field} value={item} onChange={(e) => setPromoItem(i, e.target.value)} />
        </div>
      ))}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <input className={field} value={config.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input className={field} value={config.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zalo (số hoặc link)</label>
          <input className={field} value={config.zalo} onChange={(e) => set("zalo", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link Facebook</label>
          <input className={field} value={config.facebook} onChange={(e) => set("facebook", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link Google Maps</label>
          <input
            className={field}
            value={config.googleMaps}
            onChange={(e) => set("googleMaps", e.target.value)}
            placeholder="Mở Google Maps, tìm địa chỉ, bấm Chia sẻ → Sao chép liên kết"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Giờ mở cửa</label>
          <input className={field} value={config.openingHours} onChange={(e) => set("openingHours", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên pháp lý công ty</label>
          <input className={field} value={config.legalName} onChange={(e) => set("legalName", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Câu châm ngôn footer — dòng 1</label>
        <input
          className={field}
          value={config.footerQuoteLine1}
          onChange={(e) => set("footerQuoteLine1", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Câu châm ngôn footer — dòng 2</label>
        <input
          className={field}
          value={config.footerQuoteLine2}
          onChange={(e) => set("footerQuoteLine2", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded hover:bg-secondary transition-colors disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu thông tin chung"}
        </button>
        {message && <span className="text-sm">{message}</span>}
      </div>
    </div>
  );
}
