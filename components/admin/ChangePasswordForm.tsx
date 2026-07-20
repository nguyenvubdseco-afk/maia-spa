"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới nhập lại không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới cần ít nhất 6 ký tự.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setMessage("Đã đổi mật khẩu thành công.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(data.error || "Đổi mật khẩu thất bại.");
    }
  }

  const field = "w-full border border-creamLight rounded px-3 py-2";

  return (
    <form onSubmit={submit} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
        <input
          type="password"
          className={field}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
        <input
          type="password"
          className={field}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu mới</label>
        <input
          type="password"
          className={field}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white px-6 py-2.5 rounded hover:bg-secondary transition-colors disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Đổi mật khẩu"}
      </button>

      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
