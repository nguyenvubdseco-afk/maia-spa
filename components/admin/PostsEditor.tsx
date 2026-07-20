"use client";

import { useState } from "react";
import type { Post } from "@/lib/posts";
import ImageUploadField from "./ImageUploadField";

function emptyPost(): Post {
  return {
    slug: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    image: "",
    excerpt: "",
    content: [""],
  };
}

export default function PostsEditor({ initial }: { initial: Post[] }) {
  const [items, setItems] = useState<Post[]>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(index: number, patch: Partial<Post>) {
    setItems((list) => list.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function updateParagraph(postIndex: number, paraIndex: number, value: string) {
    setItems((list) =>
      list.map((p, i) => {
        if (i !== postIndex) return p;
        const content = [...p.content];
        content[paraIndex] = value;
        return { ...p, content };
      })
    );
  }

  function addParagraph(postIndex: number) {
    setItems((list) =>
      list.map((p, i) => (i === postIndex ? { ...p, content: [...p.content, ""] } : p))
    );
  }

  function removeParagraph(postIndex: number, paraIndex: number) {
    setItems((list) =>
      list.map((p, i) =>
        i === postIndex ? { ...p, content: p.content.filter((_, j) => j !== paraIndex) } : p
      )
    );
  }

  function remove(index: number) {
    if (!confirm("Xoá bài viết này?")) return;
    setItems((list) => list.filter((_, i) => i !== index));
  }

  function addNew() {
    setItems((list) => [...list, emptyPost()]);
  }

  async function save() {
    const slugs = items.map((p) => p.slug.trim());
    if (slugs.some((s) => !s)) {
      setMessage("Mỗi bài viết cần có slug (đường dẫn).");
      return;
    }
    if (new Set(slugs).size !== slugs.length) {
      setMessage("Slug bị trùng — mỗi bài viết cần một slug riêng.");
      return;
    }

    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/posts", {
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
      {items.map((p, i) => (
        <div key={i} className="border border-creamLight rounded-lg p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg">{p.title || "(Bài viết mới)"}</h3>
            <button onClick={() => remove(i)} className="text-sm text-red-600 hover:underline">
              Xoá
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Tiêu đề</label>
              <input className={field} value={p.title} onChange={(e) => update(i, { title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Slug (đường dẫn, không dấu)</label>
              <input className={field} value={p.slug} onChange={(e) => update(i, { slug: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Ngày đăng</label>
              <input
                type="date"
                className={field}
                value={p.date}
                onChange={(e) => update(i, { date: e.target.value })}
              />
            </div>
          </div>

          <ImageUploadField label="Ảnh bài viết" value={p.image} onChange={(v) => update(i, { image: v })} />

          <div>
            <label className="block text-xs font-medium mb-1">Tóm tắt (hiển thị ở lưới bài viết)</label>
            <textarea
              className={field}
              rows={2}
              value={p.excerpt}
              onChange={(e) => update(i, { excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Nội dung (mỗi đoạn 1 ô)</label>
            <div className="space-y-2">
              {p.content.map((para, j) => (
                <div key={j} className="flex gap-2">
                  <textarea
                    className={field}
                    rows={3}
                    value={para}
                    onChange={(e) => updateParagraph(i, j, e.target.value)}
                  />
                  <button
                    onClick={() => removeParagraph(i, j)}
                    className="text-red-600 text-xs shrink-0"
                    title="Xoá đoạn này"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addParagraph(i)} className="text-primary text-xs hover:underline mt-2">
              + Thêm đoạn văn
            </button>
          </div>
        </div>
      ))}

      <button onClick={addNew} className="text-primary hover:underline text-sm">
        + Thêm bài viết mới
      </button>

      <div className="flex items-center gap-4 sticky bottom-4 bg-white/95 backdrop-blur border border-creamLight rounded-lg p-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded hover:bg-secondary transition-colors disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu tất cả bài viết"}
        </button>
        {message && <span className="text-sm">{message}</span>}
      </div>
    </div>
  );
}
