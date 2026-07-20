"use client";

import { useState } from "react";
import type { Service } from "@/lib/services";
import ImageUploadField from "./ImageUploadField";

function emptyService(): Service {
  return { slug: "", name: "", duration: "", price: "", image: "", summary: "", description: "" };
}

export default function ServicesEditor({ initial }: { initial: Service[] }) {
  const [items, setItems] = useState<Service[]>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(index: number, patch: Partial<Service>) {
    setItems((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function remove(index: number) {
    if (!confirm("Xoá dịch vụ này?")) return;
    setItems((list) => list.filter((_, i) => i !== index));
  }

  function addNew() {
    setItems((list) => [...list, emptyService()]);
  }

  async function save() {
    const slugs = items.map((s) => s.slug.trim());
    if (slugs.some((s) => !s)) {
      setMessage("Mỗi dịch vụ cần có slug (đường dẫn).");
      return;
    }
    if (new Set(slugs).size !== slugs.length) {
      setMessage("Slug bị trùng — mỗi dịch vụ cần một slug riêng.");
      return;
    }

    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    setSaving(false);
    setMessage(res.ok ? "Đã lưu." : "Lưu thất bại.");
  }

  const field = "w-full border border-creamLight rounded px-3 py-2 text-sm";

  return (
    <div className="space-y-8">
      {items.map((s, i) => (
        <div key={i} className="border border-creamLight rounded-lg p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg">{s.name || "(Dịch vụ mới)"}</h3>
            <button onClick={() => remove(i)} className="text-sm text-red-600 hover:underline">
              Xoá
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Tên dịch vụ</label>
              <input className={field} value={s.name} onChange={(e) => update(i, { name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Slug (đường dẫn, không dấu)</label>
              <input
                className={field}
                value={s.slug}
                onChange={(e) => update(i, { slug: e.target.value })}
                placeholder="vd: massage-chan-tay"
              />
              <p className="text-[11px] text-secondary mt-1">
                Chỉ dùng chữ thường a-z, số, dấu gạch ngang &ldquo;-&rdquo; (không dấu, không khoảng trắng),
                và phải khác với slug của các dịch vụ khác. Đây là phần đường dẫn trang riêng của dịch vụ:{" "}
                <code>/dich-vu/[slug]</code>. Sau khi lưu, dịch vụ sẽ tự xuất hiện ở mọi nơi hiển thị danh
                sách dịch vụ trên site (lưới dịch vụ nổi bật, trang Dịch vụ, mục Chuyên trị ở trang chủ) —
                không cần cấu hình gì thêm.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Thời gian</label>
              <input className={field} value={s.duration} onChange={(e) => update(i, { duration: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Giá</label>
              <input
                className={field}
                value={s.price ?? ""}
                onChange={(e) => update(i, { price: e.target.value })}
                placeholder="VD: 350.000đ"
              />
            </div>
          </div>

          <ImageUploadField label="Ảnh dịch vụ" value={s.image} onChange={(v) => update(i, { image: v })} />

          <div>
            <label className="block text-xs font-medium mb-1">Mô tả ngắn (hiển thị ở lưới dịch vụ)</label>
            <textarea
              className={field}
              rows={2}
              value={s.summary}
              onChange={(e) => update(i, { summary: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Mô tả chi tiết (trang riêng)</label>
            <textarea
              className={field}
              rows={4}
              value={s.description}
              onChange={(e) => update(i, { description: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button onClick={addNew} className="text-primary hover:underline text-sm">
        + Thêm dịch vụ mới
      </button>

      <div className="flex items-center gap-4 sticky bottom-4 bg-white/95 backdrop-blur border border-creamLight rounded-lg p-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded hover:bg-secondary transition-colors disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu tất cả dịch vụ"}
        </button>
        {message && <span className="text-sm">{message}</span>}
      </div>
    </div>
  );
}
