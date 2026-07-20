"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactSubmission } from "@/lib/contacts";

const PAGE_SIZE = 5;
const AUTO_REFRESH_MS = 5 * 60 * 1000; // 5 phút

export default function ContactsList() {
  const [contacts, setContacts] = useState<ContactSubmission[] | null>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    const res = await fetch("/api/admin/contacts");
    const data = await res.json();
    setContacts(data.contacts ?? []);
  }, []);

  useEffect(() => {
    loadContacts();
    const timer = setInterval(loadContacts, AUTO_REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadContacts]);

  // Chỉ đánh dấu đã đọc khi admin thật sự bấm xem/trả lời từng liên hệ —
  // KHÔNG tự động đánh dấu hàng loạt khi mở tab (khác hành vi trước đây).
  async function markRead(id: string) {
    setContacts((list) =>
      list ? list.map((c) => (c.id === id ? { ...c, read: true } : c)) : list
    );
    await fetch(`/api/admin/contacts/${id}/read`, { method: "POST" });
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Xoá liên hệ này? Không thể hoàn tác.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setContacts((list) => (list ? list.filter((c) => c.id !== id) : list));
    }
    setDeletingId(null);
  }

  if (contacts === null) {
    return <p>Đang tải...</p>;
  }

  if (contacts.length === 0) {
    return <p>Chưa có khách hàng nào gửi form liên hệ.</p>;
  }

  const totalPages = Math.ceil(contacts.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const visible = contacts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="max-w-2xl">
      <p className="text-xs text-secondary mb-4">
        Bấm vào một liên hệ (hoặc nút &ldquo;Nhắn Zalo cho khách&rdquo;) để đánh dấu là đã xem — liên hệ
        chưa xem sẽ luôn hiển thị nổi bật kèm nhãn &ldquo;Mới&rdquo;.
      </p>

      <div className="space-y-4">
        {visible.map((c) => (
          <div
            key={c.id}
            onClick={() => !c.read && markRead(c.id)}
            className={`border rounded-lg p-4 transition-colors ${
              c.read
                ? "border-creamLight"
                : "border-primary bg-creamLight/60 cursor-pointer hover:bg-creamLight"
            }`}
          >
            <div className="flex justify-between items-start mb-2 gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-heading text-lg">{c.name}</p>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      c.type === "job" ? "bg-secondary/20 text-secondary" : "bg-primary/15 text-primary"
                    }`}
                  >
                    {c.type === "job" ? "Ứng tuyển" : "Đặt lịch"}
                  </span>
                  {!c.read && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-red-600 text-white">
                      Mới
                    </span>
                  )}
                </div>
                <p className="text-sm text-secondary">{c.phone}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-secondary mb-2">{new Date(c.createdAt).toLocaleString("vi-VN")}</p>
                <button
                  onClick={(e) => handleDelete(c.id, e)}
                  disabled={deletingId === c.id}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50"
                >
                  {deletingId === c.id ? "Đang xoá..." : "Xoá"}
                </button>
              </div>
            </div>
            {(c.date || c.time) && (
              <p className="text-sm mb-2">
                <strong>Lịch hẹn mong muốn:</strong> {c.date || "(chưa chọn ngày)"}{" "}
                {c.time && `— ${c.time}`}
              </p>
            )}
            {c.message && <p className="text-sm mb-3">{c.message}</p>}
            <a
              href={`https://zalo.me/${c.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => !c.read && markRead(c.id)}
              className="inline-block text-sm bg-[#0068FF] text-white px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
            >
              Nhắn Zalo cho khách
            </a>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-creamLight rounded disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border border-creamLight rounded disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
