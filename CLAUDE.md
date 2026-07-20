# Cổ Y Dưỡng Sinh Maia — Website (Next.js)

## Tổng quan
Website spa y học cổ truyền (xoa bóp, bấm huyệt, trị đau vai gáy/lưng/thần kinh tọa, phục hồi hậu COVID...), tham khảo bố cục/màu sắc/font từ https://spamoclinhduong.com/ (người dùng xác nhận sở hữu site đó). Thương hiệu dùng cho site này: **Cổ Y Dưỡng Sinh Maia** (giữ tên riêng, không dùng tên/logo "Mộc Linh Đường" của site tham khảo).

## Lịch sử quyết định quan trọng
- Bản đầu build bằng **WordPress + Astra + Elementor** qua LocalWP — đã bỏ, không dùng nữa (site LocalWP `c-y-dng-sinh-maia` vẫn còn trên máy nhưng không còn là hướng đi chính).
- Người dùng sau đó chuyển hẳn sang **Next.js + React + Tailwind CSS**, build trực tiếp trong thư mục dự án này. Toàn bộ phần dưới đây mô tả bản Next.js.

## Stack
- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 3** cho styling (config màu/font riêng trong `tailwind.config.ts`)
- Font qua `next/font/google`: **Prata** (heading), **Josefin Sans** (body/nút), **Alex Brush** (chữ script trang trí ở hero/footer)
  - Lưu ý: ban đầu dùng Marcellus + Tenor Sans (giống thẩm mỹ site tham khảo), nhưng 2 font này **không có subset "vietnamese"** trong Google Fonts → chữ có dấu tổ hợp (ề, ữ, ố...) bị fallback sang font hệ thống, gây lệch font giữa các ký tự trong cùng một từ. Đã đổi sang Prata (rất giống Marcellus về phong cách) và Josefin Sans (rất giống Tenor Sans, mảnh và geometric) — cả hai đều có subset `vietnamese` đầy đủ. Đã xác nhận qua CSS build có `unicode-range: U+1EA0-1EF9` (dải ký tự Việt) cho cả hai font.
  - Nếu muốn đổi font khác trong tương lai: **luôn kiểm tra subset trước** bằng `node -e 'console.log(require("next/dist/compiled/@next/font/dist/google/google-fonts-metadata.js").googleFontsMetadata["Tên Font"])'` — chỉ chọn font có `"vietnamese"` trong danh sách subsets.
- Không có backend/CMS — nội dung là static/hardcoded trong từng trang, ảnh tĩnh trong `public/images`

## Bảng màu (khớp Elementor Global Colors của site tham khảo)
- Primary/nút: `#C47A5E` — Heading: `#513125` — Text: `#807673`
- Nền: `#FEFAF6` (cream) / `#FEF1E5` (creamLight) — Footer: `#21130D` (dark)
- Định nghĩa trong `tailwind.config.ts` (`colors.primary/heading/body/cream/creamLight/dark/secondary`)

## Cấu trúc dự án
- `app/layout.tsx` — layout gốc: load font, bọc `Header` + `FloatingContacts` + `Footer`
- `app/page.tsx` — Trang chủ: hero (ảnh nền + overlay + icon + tiêu đề + dòng script font) + `VoucherModal` + card khuyến mãi, lưới 6 dịch vụ nổi bật (`ServiceGrid`), 2 khối `SplitSection` (Về chúng tôi / Hậu COVID), danh sách "Chuyên trị", lưới lợi ích (icon), `Testimonials` (carousel), giờ mở cửa + CTA
- `app/gioi-thieu/` — trang giới thiệu (tĩnh)
- `app/dao-tao/` — trang đào tạo: mô tả + danh sách lợi ích + khối "Thông tin khoá học" (placeholder)
- `app/dich-vu/page.tsx` — **catalog dịch vụ** (grid toàn bộ `services` từ `lib/services.ts`, link tới trang chi tiết)
- `app/dich-vu/[slug]/page.tsx` — **trang chi tiết dịch vụ** (giá/thời gian/mô tả/ảnh + gợi ý liệu trình khác), dùng `generateStaticParams` để build tĩnh cho từng service
- `app/goc-chia-se/page.tsx` — **danh sách bài viết** (grid từ `lib/posts.ts`)
- `app/goc-chia-se/[slug]/page.tsx` — **trang chi tiết bài viết**, `generateStaticParams` tương tự
- `app/tim-kiem/page.tsx` — **trang kết quả tìm kiếm** (server component, đọc `searchParams.q`, lọc cả `services` và `posts` bằng `lib/search.ts`)
- `app/tuyen-dung/` — trang tuyển dụng có cấu trúc thật (tiêu đề tin/yêu cầu/quyền lợi/cách ứng tuyển, placeholder)
- `app/lien-he/` — trang liên hệ + `ContactForm`
- `components/` — `Header` (có `SearchBox`), `Footer`, `FloatingContacts`, `LogoIcon` (SVG tự thiết kế), `ServiceGrid`, `SplitSection`, `Testimonials` (carousel tự-động-xoay, dots, client component), `VoucherModal` (modal ảnh voucher, tương đương nút "Click Để Nhận Quà" bản gốc), `SearchBox` (modal tìm kiếm trong header), `ContactForm` (**chưa nối backend thật**)
- `lib/site.ts` — cấu hình chung (tên site, tagline, quote, `navLinks`)
- `lib/services.ts` — data 9 dịch vụ (slug/tên/giá/thời gian/ảnh/mô tả) — nguồn cho cả `ServiceGrid`, `/dich-vu`, `/dich-vu/[slug]`, tìm kiếm
- `lib/posts.ts` — data 6 bài viết mẫu (chủ đề lấy cảm hứng từ site tham khảo nhưng **nội dung tự viết, không dịch/copy nguyên văn**)
- `lib/search.ts` — `normalizeSearch`/`matchesQuery`: chuẩn hoá Unicode NFD + bỏ dấu để tìm kiếm tiếng Việt không phân biệt dấu (tránh lỗi so khớp do tổ hợp dấu NFC/NFD khác nhau)
- `lib/config.ts` — đọc/ghi `data/site.json` (thông tin chung của site)
- `lib/adminAuth.ts` — helper check/set/clear cookie đăng nhập admin
- `data/site.json`, `data/services.json`, `data/posts.json` — **nguồn dữ liệu thật**, sửa được qua `/admin` hoặc sửa tay trực tiếp file JSON
- `data/admin.json` — salt/hash mật khẩu admin (tự tạo lần đầu đăng nhập, **không commit file này nếu dùng git**)
- `data/.sessions.json` — danh sách session token admin đang hoạt động (tự quản lý, không cần sửa tay)
- `app/admin/page.tsx` + `components/admin/*` (`SiteForm`, `ServicesEditor`, `PostsEditor`, `ChangePasswordForm`, `ContactsList`, `ImageUploadField`) — trang quản trị
- `app/api/admin/*` — route handlers: `login`, `logout`, `change-password`, `data` (GET), `site`/`services`/`posts` (PUT), `upload` (POST ảnh), `contacts` (GET — xem form khách gửi)
- `data/contacts.json` — danh sách khách hàng đã gửi form Liên hệ (**chứa thông tin cá nhân — không commit nếu dùng git**), quản lý qua `lib/contacts.ts`
- `app/api/contact/route.ts` — nhận form từ `ContactForm.tsx`: lưu vào `data/contacts.json` + thử gửi thông báo Zalo cho admin qua `lib/zaloOA.ts` (best-effort, không làm lỗi form nếu chưa cấu hình)
- `public/images/` — ảnh tải từ site tham khảo: `hero.jpg`, `massage-full-body.jpg`, `massage-head.jpg`, `service-pexels.jpg`, `icon-01b.png`...`icon-06.png`
  - Lưu ý: `massage-full-body.jpg`/`massage-head.jpg` là ảnh stock (EXIF ghi rõ nguồn), không phải ảnh tự chụp — kiểm tra lại giấy phép stock nếu deploy production dùng domain khác site gốc

## Các module chức năng đã nghiên cứu & tái tạo từ site tham khảo
Đã truy cập trực tiếp `/dich-vu/`, `/dich-vu/combo-khoe-.../`, `/blog/`, `/dao-tao/`, `/tuyen-dung/` của site gốc để hiểu cấu trúc thật (không chỉ dựa vào ảnh chụp màn hình), từ đó tái tạo các module tương ứng:
- **Catalog + chi tiết dịch vụ** (site gốc có custom post type "dịch vụ" với giá/thời gian/ảnh riêng từng trang) → `lib/services.ts` + route động `/dich-vu/[slug]`
- **Blog/bài viết** (site gốc dùng Elementor Posts widget, mỗi bài 1 trang `/bai-viet/[slug]`) → `lib/posts.ts` + route động `/goc-chia-se/[slug]` — **tiêu đề bài viết lấy cảm hứng từ chủ đề thật, nội dung do tôi viết mới hoàn toàn**, không dịch/copy văn bản gốc
- **Tìm kiếm** (site gốc có modal search + form GET `tim-kiem`) → `SearchBox` (modal trong header) + `/tim-kiem` (lọc services + posts)
- **Voucher/quà tặng** (site gốc có nút "Click Để Nhận Quà" mở lightbox ảnh voucher) → `VoucherModal` (dùng ảnh placeholder, cần thay ảnh voucher thật)
- **Testimonial carousel** (site gốc dùng Elementor testimonial-carousel tự động xoay + dots) → `Testimonials.tsx` nâng cấp thành carousel thật (tự xoay 5s + dots), nội dung vẫn placeholder theo lý do đã nêu ở trên

## Form Liên hệ → thông báo Zalo cho admin
Khách điền form ở `/lien-he` → bấm Gửi → `ContactForm.tsx` gọi `POST /api/contact`:
1. **Luôn lưu** submission vào `data/contacts.json` — admin xem trong tab **"Liên hệ"** ở `/admin` (kèm nút "Nhắn Zalo cho khách" mở `zalo.me/<sđt khách>` để admin chủ động nhắn lại)
2. **Hiện popup cảm ơn** cho khách ngay khi lưu thành công (không phụ thuộc việc gửi Zalo có thành công hay không) — nội dung đúng theo yêu cầu người dùng, có nút đóng (×) và nút "Đóng", bấm ra ngoài popup cũng đóng được
3. **Thử gửi Zalo cho admin** qua `lib/zaloOA.ts` — **hiện CHƯA hoạt động thật** vì thiếu cấu hình (đã hỏi người dùng, xác nhận chưa có Zalo OA + access token, chọn dùng giải pháp thay thế là mục 1+2 ở trên)

**Để bật gửi Zalo thật cho admin sau này**, cần:
1. Đăng ký **Zalo Official Account** (OA) tại https://oa.zalo.me, xác minh doanh nghiệp
2. Tạo app tại https://developers.zalo.me, lấy `access_token` cho OA đó (access token hết hạn theo thời gian, cần refresh token để tự gia hạn — có thể cần nâng cấp `lib/zaloOA.ts` để tự refresh nếu muốn chạy dài hạn không cần cập nhật tay)
3. Admin phải từng **nhắn tin cho chính OA đó ít nhất 1 lần** (chính sách Zalo: OA chỉ được chủ động gửi tin cho user đã tương tác trong 7 ngày gần nhất) → lấy `user_id` Zalo của admin từ webhook/API follower của OA
4. Điền `ZALO_OA_ACCESS_TOKEN` và `ZALO_OA_ADMIN_USER_ID` vào `.env.local` — `lib/zaloOA.ts` đã viết sẵn, chỉ cần có 2 giá trị này là hoạt động ngay, không cần sửa code

## Chuông thông báo admin (liên hệ mới / ứng tuyển mới)
Mỗi `ContactSubmission` (`lib/contacts.ts`) giờ có thêm `type: "booking" | "job"` và `read: boolean`:
- `type` được xác định bằng query param `?type=job` trên URL `/lien-he` (trang Tuyển dụng trỏ nút "Liên hệ ứng tuyển" tới `/lien-he?type=job`; mọi nơi khác — nút Đặt Lịch, Liên hệ ngay — dùng form mặc định `type=booking`). `app/lien-he/page.tsx` đọc `searchParams.type` (Server Component) rồi truyền prop `type` xuống `ContactForm`; form khi `type="job"` tự ẩn 2 ô ngày/giờ hẹn (không phù hợp ngữ cảnh ứng tuyển) và đổi nhãn "Lời nhắn" thành "Vị trí ứng tuyển / kinh nghiệm".
- `read` mặc định `false` khi tạo mới; dữ liệu cũ (trước khi có field này) được `getContacts()` tự chuẩn hoá thành `read: true` (coi như admin đã biết từ trước, tránh chuông báo sai số lượng lớn khi mới triển khai tính năng).
- `components/admin/NotificationBell.tsx` — chuông 🔔, tự poll `GET /api/admin/contacts/unread-count` mỗi 30 giây, hiện badge đỏ số lượng tổng (hover/title xem chi tiết "X liên hệ/đặt lịch mới, Y ứng tuyển mới"). Nhận `onClick` tuỳ ngữ cảnh:
  - Trong `/admin` (`app/admin/page.tsx`) — bấm chuông chuyển tab sang "Liên hệ" (cùng state cục bộ, không load lại trang)
  - Trong `components/Header.tsx` (hiển thị **ở mọi trang, kể cả trang chủ**) — bấm chuông điều hướng sang `/admin?tab=contacts`; `app/admin/page.tsx` đọc query `tab` qua `window.location.search` trong `useEffect` (không dùng `useSearchParams` để tránh phải bọc Suspense) để tự mở đúng tab
  - Chuông chỉ hiện khi đã đăng nhập admin: `app/layout.tsx` (Server Component, `async`) gọi `isAdminAuthenticated()` rồi truyền `isAdmin` xuống `Header` — **vì `layout.tsx` giờ đọc cookie nên toàn bộ site chuyển từ prerender tĩnh (○) sang render động (ƒ) ở mọi trang** (xem build output). Đây là đánh đổi hợp lý cho site này: tốc độ giảm nhẹ nhưng đổi lại sửa được một vấn đề tiềm ẩn — trước đây nếu chạy `next build && next start` (không phải `next dev`), các trang tĩnh chỉ đọc `data/*.json` **một lần lúc build**, nghĩa là sửa nội dung qua `/admin` sẽ không hiện ra cho tới khi build lại; giờ mọi trang luôn đọc dữ liệu mới nhất mỗi request.
- **Đánh dấu đã đọc theo từng liên hệ, KHÔNG tự động đánh dấu hàng loạt** (khác thiết kế ban đầu — đã đổi theo yêu cầu người dùng): mở tab "Liên hệ" hay trang `/admin` **không** làm chuông tắt. Chỉ khi admin bấm vào 1 liên hệ cụ thể (cả khối, trừ nút Xoá) hoặc bấm "Nhắn Zalo cho khách" của đúng liên hệ đó thì mới gọi `POST /api/admin/contacts/[id]/read` để đánh dấu riêng liên hệ đó đã đọc (`lib/contacts.ts` → `markContactRead(id)`). Liên hệ chưa đọc có viền màu cam + nền nổi bật + nhãn đỏ "Mới"; liên hệ đã đọc hiển thị bình thường.
- Mỗi liên hệ vẫn hiển thị nhãn màu phân biệt loại "Đặt lịch" (cam) / "Ứng tuyển" (nâu) cạnh tên khách.
- API liên quan: `GET /api/admin/contacts/unread-count` (đếm), `POST /api/admin/contacts/[id]/read` (đánh dấu 1 liên hệ), `POST /api/admin/contacts/mark-read` (đánh dấu hàng loạt — vẫn giữ trong code nếu sau này cần nút "đánh dấu tất cả đã đọc", nhưng **không còn được gọi tự động** ở đâu nữa).

## Nút "Đặt Lịch" (→ form `/lien-he`) + nút "Liên hệ ngay" (→ Zalo) đi cùng nhau
**Lịch sử:** ban đầu nút Đặt Lịch dẫn `/lien-he`, sau đó đổi tạm sang mở thẳng Zalo theo yêu cầu, rồi người dùng **đổi ý và yêu cầu khôi phục lại** — hiện tại (trạng thái cuối cùng, đúng ý người dùng) là mỗi nơi có nút đặt lịch đều hiện **2 nút cạnh nhau**:
- **"Đặt Lịch"/"Đặt lịch hẹn ngay"/"Đăng ký tư vấn"** (nút đặc, `bg-primary`) → dẫn tới form `/lien-he` (Next `<Link>`, route nội bộ)
- **"Liên hệ ngay"** (nút viền, `border-2 border-primary`) → mở thẳng Zalo qua `getZaloUrl(siteConfig.zalo)` (`target="_blank"`)

Áp dụng ở: `components/Header.tsx` (desktop + mobile), `components/SplitSection.tsx` (dùng ở 2 khối trang chủ: Về chúng tôi + Hậu COVID), `app/page.tsx` (khối "Giờ mở cửa"), `app/dich-vu/page.tsx`, `app/dich-vu/[slug]/page.tsx`, `app/dao-tao/page.tsx`. Trang Tuyển dụng giữ nguyên chỉ 1 nút "Liên hệ ứng tuyển" → `/lien-he` (không thêm nút Zalo vì là ứng tuyển việc làm, không phải đặt lịch).

**Form `/lien-he` (`ContactForm.tsx`) đã có thêm 2 ô: Ngày mong muốn (`type="date"`) và Giờ mong muốn (`type="time"`)** — gửi kèm `date`/`time` lên `POST /api/contact`, lưu vào `data/contacts.json` (field `date`/`time`, optional), hiển thị trong `/admin` → tab Liên hệ (`ContactsList.tsx`) dưới dạng "Lịch hẹn mong muốn: <ngày> — <giờ>" nếu có điền, và đưa vào nội dung tin nhắn Zalo gửi admin (`app/api/contact/route.ts`) khi Zalo OA được cấu hình.

**Bug đã gặp & đã sửa:** admin điền ô Zalo trong `/admin` là `zalo.me/0942262126` (thiếu `https://`) → trình duyệt hiểu nhầm thành đường dẫn nội bộ của site (vd. `localhost:3002/zalo.me/...`) → 404. Đã sửa bằng cách tạo `lib/urls.ts` (hàm thuần, không đụng `fs`/`path` nên dùng được cả trong Client Component) với 2 hàm:
- `getZaloUrl(zalo)` — nếu admin điền số điện thoại thuần thì tự ghép thành `https://zalo.me/<số>`; nếu thiếu `https://` thì tự thêm vào; nếu rỗng hoặc còn là placeholder `[Điền ...]` thì trả về `"#"`
- `ensureAbsoluteUrl(value)` — tương tự, dùng chung cho các link ngoài khác (hiện dùng cho link Facebook ở `FloatingContacts.tsx`)

Mọi nơi render `href` từ `siteConfig.zalo`/`siteConfig.facebook` phải đi qua 2 hàm này (không dùng trực tiếp `siteConfig.zalo || "#"` nữa) để tránh lặp lại lỗi 404 này nếu admin điền thiếu `https://` lần nữa.

**Lưu ý kỹ thuật quan trọng:** `lib/config.ts` dùng `fs`/`path` (đọc file `data/site.json`) nên **chỉ được import vào Server Component**. Các Client Component (`Header.tsx`, `FloatingContacts.tsx` — có `"use client"`) chỉ được `import type { SiteConfig } from "@/lib/config"` (type-only, bị xoá lúc build) và phải lấy `getZaloUrl`/`ensureAbsoluteUrl` từ `@/lib/urls` — nếu lỡ import 2 hàm này từ `@/lib/config` vào file `"use client"` sẽ gây lỗi build `Module not found: Can't resolve 'fs'` (đã gặp lỗi này 1 lần khi mới thêm `getZaloUrl`, đã tách file để tránh lặp lại).

## Icon Facebook / Google Maps / Điện thoại (`components/icons/SocialIcons.tsx`)
4 icon liên hệ (`FloatingContacts.tsx` bên trái màn hình + `Footer.tsx`) ban đầu dùng chữ "f"/"Zalo" thuần và emoji 📍/📞 — trông thô, không đồng nhất. Đã thay bằng SVG tự vẽ tay (`FacebookIcon`, `MapPinIcon`, `PhoneIcon` trong `components/icons/SocialIcons.tsx`), lấy cảm hứng hình dáng quen thuộc (chữ "f" Facebook, ghim định vị, ống nghe điện thoại) theo ảnh tham khảo người dùng gửi — **không phải file gốc từ Facebook/Google** (tránh dùng logo thương hiệu có bản quyền/trademark của bên thứ ba), mà là icon dạng đường nét tối giản (path SVG tự soạn) theo phong cách icon set thông dụng (kiểu Material Icons/Font Awesome), tô màu `currentColor` nên đổi màu nền/màu icon dễ dàng qua className. Zalo vẫn giữ dạng chữ "Zalo" như cũ (người dùng chưa gửi ảnh tham khảo cho icon này).
- Toàn bộ bố cục section, bảng màu, font, cấu trúc 7 trang + menu
- Mô tả chuyên môn (đau vai gáy, hậu COVID...) — nội dung tổng quát, không định danh thương hiệu gốc

**Cố tình KHÔNG copy** (giữ nguyên quyết định đã thống nhất với người dùng qua nhiều lượt):
- **Logo/tên "Mộc Linh Đường"** — dùng icon tự vẽ (`LogoIcon.tsx`) + tên "Cổ Y Dưỡng Sinh Maia"
- **Testimonial thật** (tên khách hàng thật + nội dung nhắc "Spa Mộc Linh Đường") — thay bằng placeholder rõ ràng trong `Testimonials.tsx`, vì đây là dữ liệu cá nhân của khách hàng bên site khác
- **Grid ảnh chụp màn hình chat khách hàng** ("Hình ảnh khách hàng trải nghiệm...") — bỏ hẳn, không có trong bản Next.js, vì là dữ liệu riêng tư của bên thứ ba
- **Thông tin pháp lý thật** (tên công ty TNHH, địa chỉ, SĐT, Zalo thật của Mộc Linh Đường) — vẫn để `[Điền ...]` trong `Footer.tsx` và trang Liên hệ

## Việc còn lại cần người dùng bổ sung (tìm theo `[Điền ...]`)
- Giá dịch vụ (`lib/services.ts` — hiện chỉ có `duration`, chưa có `price` thật)
- Địa chỉ, SĐT, Zalo, Facebook, giờ mở cửa (footer + `/lien-he`)
- Nội dung khuyến mãi thật ở card trên hero + ảnh voucher thật trong `VoucherModal`
- Testimonial thật của khách hàng Cổ Y Dưỡng Sinh Maia (`Testimonials.tsx`)
- Nội dung bài viết thật thay cho 6 bài mẫu trong `lib/posts.ts`
- Tên pháp lý công ty (footer)
- Link Google Maps nhúng thật (`/lien-he`)
- Thông tin tuyển dụng/khoá đào tạo thật (`/tuyen-dung`, `/dao-tao`)
- `ContactForm.tsx` cần nối với backend/API route hoặc dịch vụ email thật (hiện chỉ demo, không gửi đi đâu)
- `SearchBox`/`/tim-kiem` mới chỉ tìm trong `services` + `posts` hiện có (không có backend/index thật, phù hợp vì site chưa có CMS)

## Trang quản trị (/admin)
Đã thêm trang quản trị đơn giản để sửa nội dung/ảnh **không cần sửa code**, chạy tốt cho mục đích local (đã xác nhận với người dùng — site chỉ chạy local, chưa có kế hoạch deploy):
- **Link đăng nhập quản trị** đặt ở cuối Trang chủ (`app/page.tsx`, dòng nhỏ "🔒 Đăng nhập quản trị"), trỏ tới `/admin` — cố tình để nhỏ/mờ vì không phải CTA cho khách hàng
- Đăng nhập bằng mật khẩu (mặc định `changeme123`, lấy từ `.env.local` → `ADMIN_PASSWORD` **chỉ dùng cho lần đầu tiên**, sau đó đổi được qua tab "Đổi mật khẩu")
- 4 tab: **Thông tin chung**, **Dịch vụ**, **Bài viết** (như trước), và **Đổi mật khẩu** (form đổi mật khẩu, yêu cầu nhập đúng mật khẩu hiện tại)
- Upload ảnh trực tiếp trong form (lưu vào `public/images/uploads/`) hoặc gõ tay đường dẫn ảnh có sẵn
- Lưu nội dung bằng cách ghi trực tiếp vào file JSON trong `data/` (`site.json`, `services.json`, `posts.json`) qua các API route trong `app/api/admin/*` — **không có database**, không cần cài thêm gì

**Kiến trúc dữ liệu:** `lib/config.ts`, `lib/services.ts`, `lib/posts.ts` đều đọc/ghi trực tiếp file JSON bằng `fs` (đọc lại mỗi lần gọi, không cache) → sửa qua admin phản ánh ngay khi reload trang, không cần restart dev server.

**Auth (đã nâng cấp từ bản đầu):**
- Mật khẩu được **hash bằng `crypto.scryptSync`** (salt riêng), lưu trong `data/admin.json` — không còn lưu plaintext. File này tự tạo lần đầu tiên có người đăng nhập, dựa trên `ADMIN_PASSWORD` trong `.env.local`.
- Đăng nhập tạo **session token ngẫu nhiên** (`crypto.randomBytes`, không phải chính mật khẩu) lưu trong `data/.sessions.json`; cookie `admin_session` chỉ chứa token này, không lộ mật khẩu thật.
- Cookie **không đặt `maxAge`/`expires`** → là session cookie, tự bị trình duyệt xoá khi **đóng toàn bộ cửa sổ trình duyệt** (lưu ý: đóng 1 tab trong khi còn tab khác của cùng trình duyệt thì session vẫn còn, vì session cookie gắn theo phiên trình duyệt chứ không theo từng tab).
- Nút **"Đăng xuất"** trong `/admin` gọi `POST /api/admin/logout` để xoá session ngay lập tức (không cần đợi đóng browser).
- Đổi mật khẩu qua `POST /api/admin/change-password` (yêu cầu đăng nhập + đúng mật khẩu hiện tại), viết lại `data/admin.json` với salt/hash mới.
- Vẫn **chỉ phù hợp cho local** (đã xác nhận với người dùng): chưa có rate-limit chống brute-force, session lưu file JSON đơn giản. Nếu sau này deploy public, nên chuyển sang database thật + rate-limit + có thể thêm 2FA.

**Lưu ý đã gặp khi test:** gửi text tiếng Việt qua `curl -d` trong git-bash bị lỗi encoding (mojibake), làm hỏng `data/site.json` một lần — đã khôi phục lại. Đây là vấn đề của công cụ test qua shell, KHÔNG phải lỗi ứng dụng (form thật trong trình duyệt dùng `fetch`/`JSON.stringify` chuẩn UTF-8, không gặp vấn đề này). Nếu cần test API bằng tay có ký tự tiếng Việt, nên dùng Node script thay vì gõ trực tiếp trong lệnh shell.

## Chạy dự án
```
npm install
npm run dev     # dev server (Next tự chọn cổng nếu 3000 bận, xem log để biết cổng)
npm run build   # build production, đã test pass
```

## Ghi chú môi trường
- Máy có sẵn Node v24 / npm v11, không cần cài thêm
- Site LocalWP WordPress cũ (`C:\Users\dohoa\Local Sites\c-y-dng-sinh-maia`) không còn dùng, có thể bỏ qua hoặc tự xoá trong app Local nếu muốn dọn dẹp
