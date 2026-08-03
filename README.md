# Nộp bài dự thi — Static site (GitHub + Vercel)

## Cấu trúc thư mục
```
index.html      -> trang nộp bài (public), có nút "⚙ Quản trị" nhỏ ở góc
                   dẫn tới /admin, và thông báo lỗi dạng toast nổi lên đầu màn hình
admin.html      -> trang quản trị: có màn hình đăng nhập bằng mật khẩu (mọi thứ
                   khác ẩn cho tới khi đăng nhập đúng), đặt tên cuộc thi,
                   ngày mở/đóng, TẠO CUỘC THI MỚI (tự tạo Sheet + Folder Drive
                   riêng), xem danh sách bài nộp, xoá bài, xuất CSV
Code.gs         -> code backend Google Apps Script (KHÔNG deploy lên Vercel,
                   chỉ dùng để dán vào script.google.com)
vercel.json     -> cấu hình để /admin hiển thị đẹp thay vì /admin.html
robots.txt      -> chặn công cụ tìm kiếm index trang /admin
```

## Tính năng chính
- **Nộp bài dự thi**: người dùng nhập họ tên + chọn file, kiểm tra thời gian
  mở/đóng cuộc thi phía server.
- **Chặn nộp trùng**: nếu tên đã có trong danh sách của cuộc thi hiện tại,
  hệ thống báo lỗi ngay và không cho nộp lại (so khớp không phân biệt hoa/thường,
  bỏ khoảng trắng thừa).
- **Thông báo nổi (toast)**: mọi lỗi khi nộp bài đều hiện thành banner đỏ nổi
  lên đầu màn hình, tự ẩn sau 5 giây hoặc bấm ✕ để đóng.
- **Đa cuộc thi**: mỗi lần admin bấm "TẠO CUỘC THI MỚI", hệ thống tự động tạo
  1 tab (Sheet) dữ liệu mới + 1 thư mục Drive mới đặt tên theo tên cuộc thi.
  Dữ liệu của cuộc thi cũ vẫn được giữ nguyên, không bị mất hay ghi đè.
- **Trang quản trị có màn hình đăng nhập**: `/admin` chỉ hiện ô nhập mật khẩu;
  mọi thiết lập/chức năng khác chỉ hiện ra sau khi xác thực đúng mật khẩu.
  Mật khẩu chỉ cần nhập 1 lần, dùng ngầm cho các thao tác sau đó trong phiên
  làm việc (lưu thiết lập, tạo cuộc thi, xem/xoá danh sách).

## Trước khi đẩy lên GitHub/Vercel
1. Deploy `Code.gs` trên script.google.com trước (xem hướng dẫn trong chính file đó),
   lấy URL dạng `.../exec`.
2. Dán URL đó vào biến `SCRIPT_URL` trong **cả `index.html` và `admin.html`**.
3. Trong `Code.gs`, đặt:
   - `SHEET_ID`: ID Google Sheet dùng làm nơi lưu dữ liệu (chứa các tab cuộc thi).
   - `FOLDER_ID`: ID thư mục Drive dùng làm **thư mục CHA** — mỗi cuộc thi
     tạo mới sẽ có 1 thư mục con nằm bên trong thư mục cha này.
   - `ADMIN_PASSWORD`: mật khẩu quản trị của bạn.
4. Vì `index.html`/`admin.html` sẽ public trên GitHub nên **không** để lộ
   thông tin nhạy cảm nào khác trong 2 file này (mật khẩu, SHEET_ID, FOLDER_ID
   chỉ nằm trong `Code.gs`, không nằm trong 2 file HTML).

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
thật sự — ai biết URL `/admin` vẫn mở được giao diện đăng nhập, nhưng
**không xem được nội dung admin** (thiết lập, danh sách bài nộp...) nếu
không nhập đúng `ADMIN_PASSWORD` — server (`Code.gs`) kiểm tra mật khẩu ở
mọi thao tác lưu/xem danh sách/xoá/tạo cuộc thi, màn hình đăng nhập chỉ là
lớp giao diện, không phải lớp bảo mật duy nhất. Nếu muốn chặt hơn nữa, có
thể bật "Vercel Password Protection" hoặc "Deployment Protection" trong
phần Settings của project trên Vercel (tính năng trả phí ở một số gói).

## Cách hoạt động của tính năng "Đa cuộc thi"
- Tab `CaiDat` trong Google Sheet lưu cấu hình: tên cuộc thi, ngày mở/đóng,
  và **tên tab + ID thư mục Drive đang active** (đang được dùng để nhận bài).
- Khi admin bấm **"TẠO CUỘC THI MỚI"**: hệ thống tạo 1 tab mới (tên theo tên
  cuộc thi, tự thêm hậu tố nếu trùng tên tab) + 1 thư mục Drive mới (nằm
  trong `FOLDER_ID`), rồi cập nhật "đang active" trỏ sang tab/thư mục mới đó.
- Khi admin chỉ bấm **"LƯU THIẾT LẬP"** (không tạo mới): chỉ sửa tên/ngày
  của cuộc thi hiện tại, KHÔNG tạo tab/thư mục mới.
- Toàn bộ dữ liệu (bài nộp) của các cuộc thi cũ vẫn nằm nguyên trong tab/thư
  mục cũ — admin có thể tự vào Google Sheet/Drive xem lại bất cứ lúc nào,
  chỉ là trang `/admin` chỉ thao tác lên cuộc thi đang active.

## Mỗi lần cần cập nhật code
1. Sửa file cần thiết (`index.html`, `admin.html`, hoặc `Code.gs`).
2. Nếu sửa `Code.gs`: dán lại vào script.google.com -> Deploy -> Manage
   deployments -> New version (URL không đổi nếu dùng "New version").
3. `git add . && git commit -m "..." && git push` -> Vercel tự động deploy
   lại bản mới trong vài giây, không cần thao tác gì thêm trên Vercel.

## Sau khi deploy, luôn kiểm tra
- Mở `/admin`, đăng nhập bằng mật khẩu quản trị -> vào được trang thiết lập.
- Nhập tên cuộc thi + ngày mở/đóng -> "LƯU THIẾT LẬP" -> lưu thành công.
- Thử bấm "TẠO CUỘC THI MỚI" với 1 tên khác -> kiểm tra Google Sheet có tab
  mới, Drive có thư mục mới đúng tên.
- Bấm "XEM DANH SÁCH" để kiểm tra tải được danh sách bài nộp của cuộc thi
  đang active.
- Mở trang chính, kiểm tra tên cuộc thi hiển thị đúng và form nộp bài hoạt động.
- Thử nộp 1 bài test, kiểm tra Google Sheet có dòng mới và file có trong Drive.
- Thử nộp lại bài với ĐÚNG tên vừa nộp -> phải bị chặn, hiện toast báo đã nộp rồi.
