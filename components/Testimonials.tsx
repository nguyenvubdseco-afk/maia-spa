"use client";

import { useEffect, useState } from "react";

const placeholders = [
  { initial: "A", name: "[Tên khách hàng 1]", quote: "[Điền cảm nhận thật của khách hàng số 1 về trải nghiệm dịch vụ tại đây.]" },
  { initial: "B", name: "[Tên khách hàng 2]", quote: "[Điền cảm nhận thật của khách hàng số 2 về trải nghiệm dịch vụ tại đây.]" },
  { initial: "C", name: "[Tên khách hàng 3]", quote: "[Điền cảm nhận thật của khách hàng số 3 về trải nghiệm dịch vụ tại đây.]" },
  { initial: "D", name: "[Tên khách hàng 4]", quote: "[Điền cảm nhận thật của khách hàng số 4 về trải nghiệm dịch vụ tại đây.]" },
];

const SLIDES_PER_VIEW = 2;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const pageCount = Math.ceil(placeholders.length / SLIDES_PER_VIEW);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % pageCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [pageCount]);

  const visible = placeholders.slice(index * SLIDES_PER_VIEW, index * SLIDES_PER_VIEW + SLIDES_PER_VIEW);

  return (
    <section className="my-16">
      <h2 className="font-heading text-3xl text-center mb-8">Mọi người nói gì về chúng tôi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[180px]">
        {visible.map((t) => (
          <div key={t.initial} className="bg-creamLight rounded-lg p-6">
            <p className="italic mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading shrink-0">
                {t.initial}
              </div>
              <strong className="font-body text-heading">{t.name}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? "bg-primary" : "bg-creamLight"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
