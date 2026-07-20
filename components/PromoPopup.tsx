"use client";

import { useRef, useState } from "react";

export default function PromoPopup({
  title,
  items,
  phone,
}: {
  title: string;
  items: string[];
  phone: string;
}) {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  function startDrag(e: React.PointerEvent) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    // Lần kéo đầu tiên: chuyển từ vị trí canh giữa (CSS) sang toạ độ x/y cụ thể.
    if (position === null) {
      setPosition({ x: rect.left, y: rect.top });
    }

    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onDrag(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const card = cardRef.current;
    const width = card?.offsetWidth ?? 0;
    const height = card?.offsetHeight ?? 0;

    const x = Math.min(Math.max(0, e.clientX - offsetRef.current.x), window.innerWidth - width);
    const y = Math.min(Math.max(0, e.clientY - offsetRef.current.y), window.innerHeight - height);
    setPosition({ x, y });
  }

  function stopDrag() {
    draggingRef.current = false;
  }

  if (!visible) return null;

  return (
    <div
      ref={cardRef}
      onPointerDown={startDrag}
      onPointerMove={onDrag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      style={
        position
          ? { position: "fixed", left: position.x, top: position.y, zIndex: 50, touchAction: "none" }
          : { position: "relative", zIndex: 20, touchAction: "none" }
      }
      title="Kéo để di chuyển"
      className="w-full max-w-lg mx-auto text-left select-none cursor-move rounded-xl bg-dark/35 backdrop-blur-sm border border-white/10 text-white p-8 shadow-xl"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-white text-xl">{title}</h3>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setVisible(false)}
          aria-label="Đóng"
          className="shrink-0 w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white text-lg leading-none transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>
      <ul className="space-y-2 mb-5">
        {items.map((item) => (
          <li key={item}>✓ {item}</li>
        ))}
      </ul>
      <a
        href={`tel:${phone}`}
        onPointerDown={(e) => e.stopPropagation()}
        className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-secondary transition-colors cursor-pointer"
      >
        📞 {phone}
      </a>
    </div>
  );
}
