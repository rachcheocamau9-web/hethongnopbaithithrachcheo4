/**
 * ==============================================================
 *  BACKEND NHẬN BÀI DỰ THI — Google Apps Script
 *  - Hỗ trợ NHIỀU CUỘC THI chạy SONG SONG cùng lúc, mỗi cuộc thi có
 *    1 TAB (Sheet) riêng + 1 THƯ MỤC Drive riêng, tự động tạo khi
 *    admin bấm "TẠO CUỘC THI MỚI" trên admin.html
 *  - Người nộp bài chọn đúng cuộc thi (nếu có nhiều cuộc thi đang mở)
 *    rồi mới nộp — không bị lẫn dữ liệu giữa các cuộc thi
 *  - Admin: xem danh sách bài nộp + xoá bài không hợp lệ theo từng cuộc thi
 *  - Chặn 1 người nộp nhiều lần trong CÙNG 1 cuộc thi (so khớp theo họ và tên)
 *
 *  Thứ tự cột mỗi tab dữ liệu: A=Stt | B=Họ và tên | C=Link file | D=Thời gian nộp
 *  Thứ tự cột tab CaiDat (danh sách cuộc thi):
 *    A=ID | B=Tên cuộc thi | C=Ngày mở | D=Ngày kết thúc | E=Sheet dữ liệu | F=Folder ID
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
 * cần tạo tay. Vào admin.html, đăng nhập, bấm "TẠO CUỘC THI MỚI" để
 * thêm 1 cuộc thi — có thể tạo bao nhiêu cuộc thi cũng được, chạy
 * song song cùng lúc.
 *
 * ⚠️ NÂNG CẤP TỪ BẢN CŨ (chỉ có 1 cuộc thi active): nếu Google Sheet
 * của bạn đã có tab "CaiDat" theo cấu trúc cũ (5 cột), hãy XOÁ tab đó
 * đi (chuột phải vào tab -> Delete) rồi chạy lại — hệ thống sẽ tự tạo
 * lại tab CaiDat theo cấu trúc mới (6 cột). Các tab dữ liệu bài nộp cũ
 * và Drive không bị ảnh hưởng.
 * ==============================================================
 */

const SHEET_ID = '1oZwEdTrl_NDaeH5vbrAhRop13_coZyNKbLhjXL9n0u4';
const SETTINGS_SHEET_NAME = 'CaiDat'; // tab chứa danh sách cuộc thi (tự tạo)
const FOLDER_ID = '1w4QAeUANi9_M0e8kjGbAjgSmYwPaOPNU'; // thư mục CHA chứa các thư mục con của từng cuộc thi
const ADMIN_PASSWORD = '1231987';

const DATA_HEADER = ['Stt', 'Họ và tên', 'Link file', 'Thời gian nộp'];
const SETTINGS_HEADER = ['ID', 'Tên cuộc thi', 'Ngày mở', 'Ngày kết thúc', 'Sheet dữ liệu', 'Folder ID'];

// ============================== doGet ==============================
// Trả về danh sách TẤT CẢ cuộc thi (công khai: tên + ngày mở/đóng) để
// trang nộp bài hiển thị / cho người dùng chọn cuộc thi muốn tham gia.
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getSettings') {
    return jsonOutput(getPublicContestList());
  }
  if (action === 'getPublicEntries') {
    return jsonOutput(getPublicEntries(e.parameter.contestId));
  }
  return jsonOutput({ status: 'error', message: 'Action không hợp lệ.' });
}

// ============================== doPost ==============================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'submit';

    if (action === 'verifyPassword') return verifyPassword(data);
    if (action === 'createContest') return createContest(data);
    if (action === 'updateSettings') return updateSettings(data);
    if (action === 'listContestsAdmin') return listContestsAdmin(data);
    if (action === 'getEntries') return getEntries(data);
    if (action === 'deleteEntry') return deleteEntry(data);

    return submitEntry(data);

  } catch (err) {
    return jsonOutput({ status: 'error', message: err.toString() });
  }
}

// ---------------------- Nộp bài dự thi ----------------------
function submitEntry(data) {
  const fullName = (data.fullName || '').toString().trim();
  const fileName = (data.fileName || 'bai-du-thi').toString();
  const fileType = data.fileType || 'application/octet-stream';
  const fileData = data.fileData;
  const contestId = (data.contestId || '').toString().trim();

  if (!fullName || !fileData) {
    return jsonOutput({ status: 'error', message: 'Thiếu dữ liệu.' });
  }
  if (!contestId) {
    return jsonOutput({ status: 'error', message: 'Vui lòng chọn cuộc thi bạn muốn tham gia.' });
  }

  const contest = getContestById(contestId);
  if (!contest) {
    return jsonOutput({ status: 'error', message: 'Cuộc thi không tồn tại hoặc đã bị gỡ.' });
  }

  const now = new Date();
  if (contest.openDate && now < new Date(contest.openDate)) {
    return jsonOutput({ status: 'error', message: 'Cuộc thi chưa đến thời gian nhận bài.' });
  }
  if (contest.endDate && now > new Date(contest.endDate)) {
    return jsonOutput({ status: 'error', message: 'Cuộc thi đã kết thúc nhận bài.' });
  }

  const sheet = getOrCreateDataSheet(contest.sheetName);

  // Kiểm tra người này đã nộp bài trước đó chưa TRONG CUỘC THI NÀY
  if (hasAlreadySubmitted(fullName, sheet)) {
    return jsonOutput({
      status: 'error',
      code: 'DUPLICATE',
      message: 'Bạn đã nộp bài trước đó rồi. Mỗi người chỉ được nộp 1 bài dự thi.'
    });
  }

  // 1) Lưu file vào Google Drive (thư mục riêng của cuộc thi này)
  const folder = DriveApp.getFolderById(contest.folderId);
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

// ---------------------- Xác thực admin ----------------------
function verifyPassword(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  return jsonOutput({ status: 'success' });
}

// ---------------------- Danh sách cuộc thi (CaiDat) ----------------------

function getOrCreateSettingsSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SETTINGS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SETTINGS_SHEET_NAME);
    sheet.getRange(1, 1, 1, SETTINGS_HEADER.length).setValues([SETTINGS_HEADER]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Đọc toàn bộ danh sách cuộc thi (nội bộ — có kèm sheetName/folderId).
function getAllContests() {
  const sheet = getOrCreateSettingsSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, SETTINGS_HEADER.length).getValues();
  return values
    .map((row, idx) => ({
      row: idx + 2,
      id: row[0] ? row[0].toString() : '',
      contestName: row[1] ? row[1].toString() : '',
      openDate: row[2] ? new Date(row[2]).toISOString() : '',
      endDate: row[3] ? new Date(row[3]).toISOString() : '',
      sheetName: row[4] ? row[4].toString() : '',
      folderId: row[5] ? row[5].toString() : ''
    }))
    .filter(c => c.id); // bỏ dòng trống
}

function getContestById(id) {
  return getAllContests().find(c => c.id === id) || null;
}

// Bản công khai (doGet) — chỉ trả tên/ngày, không lộ sheetName/folderId nội bộ.
function getPublicContestList() {
  const contests = getAllContests().map(c => ({
    id: c.id,
    contestName: c.contestName,
    openDate: c.openDate,
    endDate: c.endDate
  }));
  return { status: 'success', contests: contests };
}

// Danh sách CÔNG KHAI người đã nộp bài của 1 cuộc thi — dùng cho trang
// "Xem kết quả" mà ai cũng xem được (KHÔNG cần mật khẩu). Chỉ trả về
// Họ và tên, KHÔNG trả link file hay bất kỳ dữ liệu nội bộ nào khác.
function getPublicEntries(contestId) {
  contestId = (contestId || '').toString().trim();
  if (!contestId) {
    return { status: 'error', message: 'Thiếu ID cuộc thi.' };
  }
  const contest = getContestById(contestId);
  if (!contest) {
    return { status: 'error', message: 'Không tìm thấy cuộc thi.' };
  }
  const sheet = getOrCreateDataSheet(contest.sheetName);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { status: 'success', contestName: contest.contestName, names: [] };
  }
  const values = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // cột B - Họ và tên
  const names = values
    .map(row => (row[0] ? row[0].toString().trim() : ''))
    .filter(n => n);
  return { status: 'success', contestName: contest.contestName, names: names };
}

// Bản đầy đủ cho admin (yêu cầu mật khẩu) — không lộ folderId ra ngoài nhưng
// vẫn cần cho các thao tác quản trị, nên trả kèm.
function listContestsAdmin(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  return jsonOutput({ status: 'success', contests: getAllContests() });
}

// Sửa tên/ngày của 1 cuộc thi đã có (theo id) — KHÔNG tạo sheet/folder mới.
function updateSettings(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  const contestId = (data.contestId || '').toString().trim();
  if (!contestId) {
    return jsonOutput({ status: 'error', message: 'Thiếu ID cuộc thi cần sửa.' });
  }
  const sheet = getOrCreateSettingsSheet();
  const contests = getAllContests();
  const target = contests.find(c => c.id === contestId);
  if (!target) {
    return jsonOutput({ status: 'error', message: 'Không tìm thấy cuộc thi cần sửa.' });
  }
  sheet.getRange(target.row, 2, 1, 3).setValues([[
    (data.contestName || '').toString(),
    data.openDate ? new Date(data.openDate) : '',
    data.endDate ? new Date(data.endDate) : ''
  ]]);
  return jsonOutput({ status: 'success' });
}

// Tạo 1 CUỘC THI MỚI: tự động tạo 1 Sheet mới + 1 Folder Drive mới (đặt tên
// theo tên cuộc thi), thêm 1 dòng mới vào CaiDat — KHÔNG đụng tới các
// cuộc thi khác đang có, nên nhiều cuộc thi có thể cùng chạy song song.
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

  // 3) Thêm 1 dòng mới vào CaiDat (KHÔNG ghi đè các cuộc thi khác)
  const contestId = 'c' + new Date().getTime();
  const settingsSheet = getOrCreateSettingsSheet();
  settingsSheet.appendRow([
    contestId,
    contestName,
    data.openDate ? new Date(data.openDate) : '',
    data.endDate ? new Date(data.endDate) : '',
    sheetName,
    newFolder.getId()
  ]);

  return jsonOutput({
    status: 'success',
    id: contestId,
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

// Lấy đúng Sheet dữ liệu theo tên (tự tạo lại nếu lỡ bị xoá tay trên Sheets).
function getOrCreateDataSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, DATA_HEADER.length).setValues([DATA_HEADER]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---------------------- Danh sách bài nộp (admin) ----------------------
// Trả về toàn bộ danh sách bài đã nộp CỦA 1 CUỘC THI CỤ THỂ (theo contestId),
// kèm số dòng thật trên Sheet (để xoá đúng dòng).
function getEntries(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  const contestId = (data.contestId || '').toString().trim();
  const contest = getContestById(contestId);
  if (!contest) {
    return jsonOutput({ status: 'error', message: 'Không tìm thấy cuộc thi.' });
  }
  const sheet = getOrCreateDataSheet(contest.sheetName);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return jsonOutput({ status: 'success', entries: [], contestName: contest.contestName });
  }
  const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  const entries = values.map((row, idx) => ({
    row: idx + 2, // số dòng thật trên Sheet, dùng khi xoá
    stt: row[0],
    fullName: row[1],
    fileUrl: row[2],
    submittedAt: row[3] ? new Date(row[3]).toISOString() : ''
  }));
  return jsonOutput({ status: 'success', entries: entries, contestName: contest.contestName });
}

// Xoá 1 dòng bài nộp (của 1 cuộc thi cụ thể) theo số dòng thật trên Sheet,
// sau đó đánh lại Stt cho liền mạch.
function deleteEntry(data) {
  if (data.password !== ADMIN_PASSWORD) {
    return jsonOutput({ status: 'error', message: 'Sai mật khẩu quản trị.' });
  }
  const contestId = (data.contestId || '').toString().trim();
  const contest = getContestById(contestId);
  if (!contest) {
    return jsonOutput({ status: 'error', message: 'Không tìm thấy cuộc thi.' });
  }
  const rowIndex = parseInt(data.row, 10);
  if (!rowIndex || rowIndex < 2) {
    return jsonOutput({ status: 'error', message: 'Dòng không hợp lệ.' });
  }
  const sheet = getOrCreateDataSheet(contest.sheetName);
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
