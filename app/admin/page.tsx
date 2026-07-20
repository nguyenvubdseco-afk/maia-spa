"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/config";
import type { Service } from "@/lib/services";
import type { Post } from "@/lib/posts";
import SiteForm from "@/components/admin/SiteForm";
import ServicesEditor from "@/components/admin/ServicesEditor";
import PostsEditor from "@/components/admin/PostsEditor";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import ContactsList from "@/components/admin/ContactsList";
import NotificationBell from "@/components/admin/NotificationBell";

type Tab = "site" | "services" | "posts" | "contacts" | "password";

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("site");

  const [site, setSite] = useState<SiteConfig | null>(null);
  const [services, setServices] = useState<Service[] | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);

  async function loadData() {
    const res = await fetch("/api/admin/data");
    if (res.ok) {
      const data = await res.json();
      setSite(data.site);
      setServices(data.services);
      setPosts(data.posts);
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setAuthChecked(true);
  }

  useEffect(() => {
    loadData();
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "contacts") {
      setTab("contacts");
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      await loadData();
    } else {
      setLoginError("Sai mật khẩu.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setSite(null);
    setServices(null);
    setPosts(null);
  }

  if (!authChecked) {
    return <main className="max-w-md mx-auto px-4 py-20 text-center">Đang tải...</main>;
  }

  if (!authenticated) {
    return (
      <main className="max-w-sm mx-auto px-4 py-20">
        <h1 className="font-heading text-2xl mb-6 text-center">Đăng nhập quản trị</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full border border-creamLight rounded px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white px-6 py-2.5 rounded hover:bg-secondary transition-colors"
          >
            Đăng nhập
          </button>
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
        </form>
        <p className="text-xs text-secondary mt-4">
          Mật khẩu mặc định lấy từ biến môi trường <code>ADMIN_PASSWORD</code> trong file{" "}
          <code>.env.local</code> (chỉ dùng cho lần đầu) — có thể đổi trong tab &ldquo;Đổi mật
          khẩu&rdquo; sau khi đăng nhập.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl">Trang quản trị</h1>
        <div className="flex items-center gap-3">
          <NotificationBell onClick={() => setTab("contacts")} />
          <button onClick={handleLogout} className="text-sm text-secondary hover:underline">
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-creamLight">
        {(
          [
            ["site", "Thông tin chung"],
            ["services", "Dịch vụ"],
            ["posts", "Bài viết"],
            ["contacts", "Liên hệ"],
            ["password", "Đổi mật khẩu"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-body border-b-2 transition-colors ${
              tab === key ? "border-primary text-primary" : "border-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "site" && site && <SiteForm initial={site} />}
      {tab === "services" && services && <ServicesEditor initial={services} />}
      {tab === "posts" && posts && <PostsEditor initial={posts} />}
      {tab === "contacts" && <ContactsList />}
      {tab === "password" && <ChangePasswordForm />}
    </main>
  );
}
