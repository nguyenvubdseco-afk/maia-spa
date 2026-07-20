"use client";

import { useCallback, useEffect, useState } from "react";

const POLL_MS = 30 * 1000; // 30 giây

export default function NotificationBell({ onClick }: { onClick: () => void }) {
  const [counts, setCounts] = useState({ booking: 0, job: 0, total: 0 });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/contacts/unread-count");
    if (res.ok) {
      setCounts(await res.json());
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  const label =
    counts.total === 0
      ? "Không có thông báo mới"
      : `${counts.booking} liên hệ/đặt lịch mới, ${counts.job} ứng tuyển mới`;

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-creamLight transition-colors"
    >
      <span className="text-xl" aria-hidden="true">
        🔔
      </span>
      {counts.total > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] leading-[18px] font-semibold animate-spa-pulse">
          {counts.total > 99 ? "99+" : counts.total}
        </span>
      )}
    </button>
  );
}
