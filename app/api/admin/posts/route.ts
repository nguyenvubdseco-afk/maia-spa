import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { savePosts, type Post } from "@/lib/posts";

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body: Post[] = await request.json();

  for (const p of body) {
    if (!p.slug || !p.title) {
      return NextResponse.json({ error: "Mỗi bài viết cần có slug và tiêu đề" }, { status: 400 });
    }
  }

  savePosts(body);
  return NextResponse.json({ ok: true });
}
