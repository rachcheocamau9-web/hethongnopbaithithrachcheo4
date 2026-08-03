/**
 * ==============================================================
 *  BACKEND NHẬN BÀI DỰ THI — Google Apps Script
 *  - Mỗi cuộc thi có 1 TAB (Sheet) riêng + 1 THƯ MỤC Drive riêng,
 *    tự động tạo khi admin bấm "TẠO CUỘC THI MỚI" trên admin.html
 *  - Ghi thông tin người nộp vào tab dữ liệu đang active
 *  - Quản lý "Tên cuộc thi / Ngày mở / Ngày kết thúc" qua admin.html
 *  - Admin: xem danh sách bài nộp + xoá bài không hợp lệ
 *  - Chặn 1 người nộp nhiều lần (so khớp theo họ và tên, trong cuộc thi hiện tại)
 *
 *  Thứ tự cột mỗi tab dữ liệu: A=Stt | B=Họ và tên | C=Link file | D=Thời gian nộp
 * ==============================================================
 *
 * CÁCH CÀI ĐẶT:
 * 1. Tạo 1 Google Sheet mới, copy ID trong URL (giữa /d/ và /edit)
 *    -> dán vào SHEET_ID bên dưới.
 * 2. Tạo 1 thư mục Google Drive (thư mục CHA, sẽ chứa các thư mục con
 *    cho từng cuộc thi), copy ID thư mục -> dán vào FOLDER_ID bên dưới.
 * 3. Đặt 1 mật khẩu quản trị bất kỳ -> dán vào ADMIN_PASSWORD bên dưới.
 * 4. Vào https://script.google.com -> New project -> xoá code mẫu,
 *    dán toàn bộ nội dung file này vào.
 * 5. Deploy > New deployment > "Web app":
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Bấm Deploy, cấp quyền (Authorize) khi được hỏi.
 * 6. Copy URL Web app (dạng .../exec) -> dán vào biến SCRIPT_URL
 *    trong CẢ 2 file: index.html VÀ admin.html.
 *
 * Tab "CaiDat" sẽ được TỰ ĐỘNG tạo trong lần chạy đầu tiên, không
 * cần tạo tay. Lần đầu tiên hệ thống dùng luôn Sheet đang active mặc
 * định (Sheet1) và FOLDER_ID làm nơi lưu — admin có thể bấm
 * "TẠO CUỘC THI MỚI" bất cứ lúc nào để chuyển sang tab + thư mục mới.
 * ==============================================================
 */

const SHEET_ID = '1oZwEdTrl_NDaeH5vbrAhRop13_coZyNKbLhjXL9n0u4';
const SHEET_NAME = 'Sheet1';          // tab dữ liệu mặc định (dùng khi chưa tạo cuộc thi nào)
const SETTINGS_SHEET_NAME = 'CaiDat'; // tab chứa cấu hình cuộc thi (tự tạo)
const FOLDER_ID = '1w4QAeUANi9_M0e8kjGbAjgSmYwPaOPNU'; // thư mục CHA chứa các thư mục con của từng cuộc thi
const ADMIN_PASSWORD = '1231987';

const DATA_HEADER = ['Stt', 'Họ và tên', 'Link file', 'Thời gian nộp'];

// ============================== doGet ==============================
// Chỉ dùng để lấy cấu hình cuộc thi (tên, ngày mở, ngày kết thúc) — công khai,
// vì thông tin này vốn đã hiển thị sẵn trên trang nộp bài.
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getSettings') {
    return jsonOutput(getSettings());
  }
  return jsonOutput({ status: 'error', message: 'Action không hợp lệ.' });
}

// ============================== doPost ==============================
// Xử lý các yêu cầu: nộp bài (mặc định), tạo cuộc thi mới, cập nhật cấu hình,
// xem/xoá danh sách (admin).
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'submit';

    if (action === 'verifyPassword') return verifyPassword(data);
    if (action === 'createContest') return createContest(data);
    if (action === 'updateSettings') return updateSettings(data);
    if (action === 'getEntries') return getEntries(data);
    if (action === 'deleteEntry') return deleteEntry(data);

    return submitEntry(data);

  } catch (err) {
    return jsonOutput({ status: 'error', message: err.toString() });
  }
}

// Chỉ dùng để kiểm tra mật khẩu cho màn hình đăng nhập trang admin.html.
function verifyPassword(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  return jsonOutput({ status: 'success' });
}

// ---------------------- Nộp bài dự thi ----------------------
function submitEntry(data) {
  const fullName = (data.fullName || '').toString().trim();
  const fileName = (data.fileName || 'bai-du-thi').toString();
  const fileType = data.fileType || 'application/octet-stream';
  const fileData = data.fileData;

  if (!fullName || !fileData) {
    return jsonOutput({ status: 'error', message: 'Thiếu dữ liệu.' });
  }

  const cfg = getActiveConfig();
  const now = new Date();
  if (cfg.openDate && now < new Date(cfg.openDate)) {
    return jsonOutput({ status: 'error', message: 'Cuộc thi chưa đến thời gian nhận bài.' });
  }
  if (cfg.endDate && now > new Date(cfg.endDate)) {
    return jsonOutput({ status: 'error', message: 'Cuộc thi đã kết thúc nhận bài.' });
  }

  const sheet = getActiveDataSheet(cfg);

  // Kiểm tra người này đã nộp bài trước đó chưa (so khớp theo họ và tên,
  // chỉ trong phạm vi cuộc thi hiện tại)
  if (hasAlreadySubmitted(fullName, sheet)) {
    return jsonOutput({
      status: 'error',
      message: 'Bạn đã nộp bài trước đó rồi. Mỗi người chỉ được nộp 1 bài dự thi.'
    });
  }

  // 1) Lưu file vào Google Drive (thư mục riêng của cuộc thi hiện tại)
  const folder = DriveApp.getFolderById(cfg.activeFolderId);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(fileData),
    fileType,
    `${fullName} - ${fileName}`
  );
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // 2) Ghi vào Google Sheet — đúng thứ tự cột A, B, C, D
  const stt = sheet.getLastRow(); // dòng 1 là tiêu đề -> dòng dữ liệu đầu tiên Stt = 1

  sheet.appendRow([
    stt,             // Cột A - Stt
    fullName,        // Cột B - Họ và tên
    file.getUrl(),   // Cột C - Link file trên Drive
    new Date()       // Cột D - Thời gian nộp
  ]);

  return jsonOutput({ status: 'success' });
}

// Chuẩn hoá tên để so sánh: bỏ khoảng trắng thừa, không phân biệt hoa/thường.
function normalizeName(name) {
  return name.toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

// Kiểm tra xem tên này đã có trong danh sách bài nộp (cột B) của 1 sheet cụ thể chưa.
function hasAlreadySubmitted(fullName, sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  const target = normalizeName(fullName);
  const names = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // cột B
  return names.some(row => normalizeName(row[0]) === target);
}

// ---------------------- Cấu hình cuộc thi (admin) ----------------------

// Đọc đầy đủ cấu hình đang active, kèm tên sheet + folder Drive đang dùng.
// Dùng nội bộ cho submit/getEntries/deleteEntry/createContest.
function getActiveConfig() {
  const sheet = getOrCreateSettingsSheet();
  const values = sheet.getRange(2, 1, 1, 5).getValues()[0];
  return {
    contestName: values[0] ? values[0].toString() : '',
    openDate: values[1] ? new Date(values[1]).toISOString() : '',
    endDate: values[2] ? new Date(values[2]).toISOString() : '',
    activeSheetName: values[3] ? values[3].toString() : SHEET_NAME,
    activeFolderId: values[4] ? values[4].toString() : FOLDER_ID
  };
}

// Bản công khai (doGet) — chỉ trả tên cuộc thi + ngày mở/đóng, không lộ sheet/folder nội bộ.
function getSettings() {
  const cfg = getActiveConfig();
  return {
    status: 'success',
    contestName: cfg.contestName,
    openDate: cfg.openDate,
    endDate: cfg.endDate
  };
}

// Sửa tên/ngày của cuộc thi ĐANG active — KHÔNG tạo sheet/folder mới.
function updateSettings(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  const sheet = getOrCreateSettingsSheet();
  sheet.getRange(2, 1, 1, 3).setValues([[
    (data.contestName || '').toString(),
    data.openDate ? new Date(data.openDate) : '',
    data.endDate ? new Date(data.endDate) : ''
  ]]);
  return jsonOutput({ status: 'success' });
}

// Tạo 1 CUỘC THI MỚI: tự động tạo 1 Sheet mới + 1 Folder Drive mới (đặt tên
// theo tên cuộc thi), rồi chuyển "active" sang sheet/folder vừa tạo.
// Dữ liệu của (các) cuộc thi cũ vẫn giữ nguyên trong sheet/folder cũ, không mất.
function createContest(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  const contestName = (data.contestName || '').toString().trim();
  if (!contestName) {
    return jsonOutput({ status: 'error', message: 'Vui lòng nhập tên cuộc thi.' });
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);

  // 1) Tạo Sheet mới cho cuộc thi này (tên tab lấy theo tên cuộc thi, tự chống trùng)
  const sheetName = uniqueSheetName(ss, sanitizeSheetName(contestName));
  const newSheet = ss.insertSheet(sheetName);
  newSheet.getRange(1, 1, 1, DATA_HEADER.length).setValues([DATA_HEADER]);
  newSheet.setFrozenRows(1);

  // 2) Tạo Folder Drive mới cho cuộc thi này, nằm trong thư mục cha FOLDER_ID
  const parentFolder = DriveApp.getFolderById(FOLDER_ID);
  const newFolder = parentFolder.createFolder(contestName);

  // 3) Cập nhật CaiDat: chuyển active sang sheet/folder vừa tạo
  const settingsSheet = getOrCreateSettingsSheet();
  settingsSheet.getRange(2, 1, 1, 5).setValues([[
    contestName,
    data.openDate ? new Date(data.openDate) : '',
    data.endDate ? new Date(data.endDate) : '',
    sheetName,
    newFolder.getId()
  ]]);

  return jsonOutput({
    status: 'success',
    sheetName: sheetName,
    folderId: newFolder.getId(),
    folderUrl: newFolder.getUrl()
  });
}

// Bỏ các ký tự Google Sheets không cho phép trong tên tab: [ ] * ? / \ :
function sanitizeSheetName(name) {
  let s = name.replace(/[\[\]\*\?\/\\:]/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length > 90) s = s.substring(0, 90).trim();
  if (!s) s = 'Cuoc thi';
  return s;
}

// Nếu tên tab đã tồn tại (vd tạo trùng tên cuộc thi), tự thêm hậu tố (2), (3)...
function uniqueSheetName(ss, baseName) {
  let name = baseName;
  let i = 2;
  while (ss.getSheetByName(name)) {
    name = `${baseName} (${i})`;
    i++;
  }
  return name;
}

function getOrCreateSettingsSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SETTINGS_SHEET_NAME);
    sheet.getRange(1, 1, 1, 5).setValues([[
      'Tên cuộc thi', 'Ngày mở', 'Ngày kết thúc', 'Sheet đang dùng', 'Folder ID đang dùng'
    ]]);
    const now = new Date();
    const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    sheet.getRange(2, 1, 1, 5).setValues([[
      'Cuộc thi dự thi', now, in30days, SHEET_NAME, FOLDER_ID
    ]]);
  }
  return sheet;
}

// Lấy đúng Sheet dữ liệu đang active (tự tạo lại nếu lỡ bị xoá tay trên Sheets).
function getActiveDataSheet(cfg) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(cfg.activeSheetName);
  if (!sheet) {
    sheet = ss.insertSheet(cfg.activeSheetName);
    sheet.getRange(1, 1, 1, DATA_HEADER.length).setValues([DATA_HEADER]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---------------------- Danh sách bài nộp (admin) ----------------------
// Trả về toàn bộ danh sách bài đã nộp CỦA CUỘC THI ĐANG ACTIVE,
// kèm số dòng thật trên Sheet (để xoá đúng dòng).
function getEntries(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  const cfg = getActiveConfig();
  const sheet = getActiveDataSheet(cfg);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return jsonOutput({ status: 'success', entries: [], sheetName: cfg.activeSheetName });
  }
  const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  const entries = values.map((row, idx) => ({
    row: idx + 2, // số dòng thật trên Sheet, dùng khi xoá
    stt: row[0],
    fullName: row[1],
    fileUrl: row[2],
    submittedAt: row[3] ? new Date(row[3]).toISOString() : ''
  }));
  return jsonOutput({ status: 'success', entries: entries, sheetName: cfg.activeSheetName });
}

// Xoá 1 dòng bài nộp (trong sheet đang active) theo số dòng thật trên Sheet,
// sau đó đánh lại Stt cho liền mạch.
function deleteEntry(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  const rowIndex = parseInt(data.row, 10);
  if (!rowIndex || rowIndex < 2) {
    return jsonOutput({ status: 'error', message: 'Dòng không hợp lệ.' });
  }
  const cfg = getActiveConfig();
  const sheet = getActiveDataSheet(cfg);
  sheet.deleteRow(rowIndex);
  renumberStt(sheet);
  return jsonOutput({ status: 'success' });
}

function renumberStt(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const numRows = lastRow - 1;
  const sttValues = [];
  for (let i = 1; i <= numRows; i++) sttValues.push([i]);
  sheet.getRange(2, 1, numRows, 1).setValues(sttValues);
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
