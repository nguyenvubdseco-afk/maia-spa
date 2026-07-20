"use client";

import { useState } from "react";
import Image from "next/image";

export default function VoucherModal({ image }: { image: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="animate-voucher-pulse inline-block bg-primary text-white rounded-full px-8 py-3 font-body font-semibold text-sm sm:text-base shadow-lg hover:bg-secondary transition-colors"
      >
        🎁 Click Để Nhận Quà
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-dark/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center"
            >
              ×
            </button>
            <Image
              src={image}
              alt="Voucher ưu đãi"
              width={600}
              height={400}
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </>
  );
}
