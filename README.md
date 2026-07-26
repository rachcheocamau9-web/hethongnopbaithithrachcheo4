# Nộp bài dự thi — Static site (GitHub + Vercel)

## Cấu trúc thư mục
```
index.html      -> trang nộp bài (public)
admin.html      -> trang quản trị: đặt tên cuộc thi, ngày mở/đóng,
                   xem danh sách bài nộp, xoá bài, xuất CSV
Code.gs         -> code backend Google Apps Script (KHÔNG deploy lên Vercel,
                   chỉ dùng để dán vào script.google.com)
vercel.json     -> cấu hình để /admin hiển thị đẹp thay vì /admin.html
robots.txt      -> chặn công cụ tìm kiếm index trang /admin
```

Sau khi deploy, trang quản trị chạy live tại `https://<project>.vercel.app/admin`
— admin có thể xử lý mọi việc (đổi tên cuộc thi, đổi ngày mở/đóng, xem/xoá
bài nộp, xuất CSV) trực tiếp trên trình duyệt bất cứ khi nào cần, không cần
sửa code hay mở Google Sheet.

## Trước khi đẩy lên GitHub/Vercel
1. Deploy `Code.gs` trên script.google.com trước (xem hướng dẫn trong chính file đó),
   lấy URL dạng `.../exec`.
2. Dán URL đó vào biến `SCRIPT_URL` trong **cả `index.html` và `admin.html`**.
3. Đặt `ADMIN_PASSWORD` trong `Code.gs` — vì `index.html`/`admin.html` sẽ public
   trên GitHub nên **không** để lộ thông tin nhạy cảm nào khác trong 2 file này.

## Đẩy lên GitHub
```bash
git init
git add .
git commit -m "Contest submission site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## Deploy lên Vercel
1. Vào vercel.com -> New Project -> Import repo GitHub vừa tạo.
2. Framework Preset: chọn **Other** (đây là static site, không cần build).
3. Build Command: để trống. Output Directory: để trống hoặc `.`
4. Bấm Deploy.
5. Sau khi xong: trang chính ở `https://<project>.vercel.app`,
   trang quản trị ở `https://<project>.vercel.app/admin`.

## Vì sao không lỗi CORS?
`index.html`/`admin.html` gọi sang Google Apps Script bằng `fetch` với
`Content-Type: text/plain` để tránh preflight request — cách này hoạt động
ổn định dù chạy ở domain nào (localhost, GitHub Pages, Vercel...). Không cần
cấu hình CORS thêm ở Vercel.

## Về bảo mật trang /admin
`robots.txt` chỉ ngăn công cụ tìm kiếm index trang này, KHÔNG phải bảo mật
thật sự — ai biết URL `/admin` vẫn mở được giao diện, nhưng **không đọc/sửa
được dữ liệu** nếu không có đúng `ADMIN_PASSWORD` (mọi thao tác lưu/xem
danh sách/xoá đều được `Code.gs` kiểm tra mật khẩu phía server). Nếu muốn
chặt hơn nữa, có thể bật "Vercel Password Protection" hoặc "Deployment
Protection" trong phần Settings của project trên Vercel (tính năng trả phí
ở một số gói).

## Mỗi lần cần cập nhật code
1. Sửa file cần thiết (`index.html`, `admin.html`, hoặc `Code.gs`).
2. Nếu sửa `Code.gs`: dán lại vào script.google.com -> Deploy -> Manage
   deployments -> New version (URL không đổi nếu dùng "New version").
3. `git add . && git commit -m "..." && git push` -> Vercel tự động deploy
   lại bản mới trong vài giây, không cần thao tác gì thêm trên Vercel.

## Sau khi deploy, luôn kiểm tra
- Mở `/admin`, nhập thử tên cuộc thi + ngày mở/đóng + mật khẩu -> Lưu thành công.
- Bấm "Xem danh sách" để kiểm tra tải được danh sách bài nộp.
- Mở trang chính, kiểm tra tên cuộc thi hiển thị đúng và form nộp bài hoạt động.
- Thử nộp 1 bài test, kiểm tra Google Sheet có dòng mới và file có trong Drive.
