"use client";

import { useState } from "react";
import type { ContactType } from "@/lib/contacts";

export default function ContactForm({ type = "booking" }: { type?: ContactType }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const isJob = type === "job";

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (phone.length < 10 || phone.length > 11) {
      setError("Số điện thoại phải gồm 10-11 chữ số.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name, phone, date, time, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gửi thất bại, vui lòng thử lại.");
        return;
      }

      setShowThankYou(true);
      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setMessage("");
    } catch {
      setError("Không thể kết nối tới máy chủ, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  }

  const field = "w-full border border-creamLight rounded px-3 py-2";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Họ tên
          </label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="phone">
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            minLength={10}
            maxLength={11}
            pattern="[0-9]{10,11}"
            title="Số điện thoại gồm 10-11 chữ số"
            value={phone}
            onChange={handlePhoneChange}
            className={field}
          />
        </div>
        {!isJob && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" htmlFor="date">
                Ngày mong muốn
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="time">
                Giờ mong muốn
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={field}
              />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm mb-1" htmlFor="message">
            {isJob ? "Vị trí ứng tuyển / kinh nghiệm" : "Lời nhắn"}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={field}
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="bg-primary text-white px-7 py-3 rounded hover:bg-secondary transition-colors disabled:opacity-60"
        >
          {sending ? "Đang gửi..." : "Gửi"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {showThankYou && (
        <div
          className="fixed inset-0 z-[80] bg-dark/60 flex items-center justify-center p-4"
          onClick={() => setShowThankYou(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-sm w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowThankYou(false)}
              aria-label="Đóng"
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center"
            >
              ×
            </button>
            <p className="font-heading text-xl mb-3 text-primary">Cảm ơn quý khách!</p>
            <p>
              Cảm ơn quý khách hàng đã tin tưởng sử dụng dịch vụ, chúng tôi sẽ liên hệ lại ngay. Chúc quý
              khách một ngày tốt lành.
            </p>
            <button
              onClick={() => setShowThankYou(false)}
              className="mt-6 bg-primary text-white px-6 py-2.5 rounded hover:bg-secondary transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
