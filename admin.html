<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quản trị cuộc thi</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,600;0,700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --paper: #F6F1E4;
    --ink: #232323;
    --ink-soft: #5b5346;
    --seal: #A9342A;
    --seal-dark: #7d2620;
    --gold: #B8892B;
    --line: #d9cfb4;
  }
  *{ box-sizing:border-box; }
  html, body{
    margin:0; min-height:100vh;
    background:
      radial-gradient(1200px 800px at 15% -10%, #fffdf7 0%, transparent 55%),
      radial-gradient(1000px 700px at 110% 110%, #efe5c8 0%, transparent 60%),
      var(--paper);
    font-family:'Be Vietnam Pro', sans-serif;
    color: var(--ink);
    display:flex; align-items:center; justify-content:center;
    padding: 32px 16px;
  }
  .card{
    width:100%; max-width: 640px;
    background: #FFFDF8;
    border: 1px solid var(--line);
    border-radius: 14px;
    box-shadow: 0 1px 2px rgba(35,30,20,0.04), 0 20px 50px -20px rgba(35,30,20,0.35);
    padding: 34px 34px 30px;
  }
  .eyebrow{
    text-align:center; font-size: 11px; letter-spacing: 0.22em;
    color: var(--gold); font-weight: 700; text-transform: uppercase;
    margin: 0 0 8px;
  }
  h1{
    font-family:'Noto Serif', serif; font-weight:700; text-align:center;
    font-size: 22px; margin: 0 0 6px;
  }
  .rule{ width:56px; height:3px; background:var(--seal); margin:0 auto 24px; border-radius:2px; }
  label{ display:block; font-size:13px; font-weight:600; color:var(--ink-soft); margin-bottom:7px; }
  .field{ margin-bottom:18px; }
  input[type="text"], input[type="password"], input[type="datetime-local"]{
    width:100%; font-family:inherit; font-size:14.5px; padding:11px 13px;
    border:1.5px solid var(--line); border-radius:8px; background:#FFFEFB;
    color:var(--ink); outline:none; transition:border-color .15s ease, box-shadow .15s ease;
  }
  input:focus{ border-color: var(--seal); box-shadow:0 0 0 3px rgba(169,52,42,0.12); }
  .btn{
    width:100%; border:none; border-radius:9px; padding:13px 18px;
    font-family:inherit; font-size:14.5px; font-weight:700; letter-spacing:0.02em;
    color:#fff; background:linear-gradient(180deg, var(--seal) 0%, var(--seal-dark) 100%);
    cursor:pointer; margin-top:6px; box-shadow:0 8px 18px -8px rgba(169,52,42,0.55);
    transition:transform .12s ease, box-shadow .12s ease, opacity .12s ease;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .btn:hover:not(:disabled){ transform:translateY(-1px); }
  .btn:disabled{ opacity:0.65; cursor:not-allowed; }
  .spinner{
    width:14px; height:14px; border:2.5px solid rgba(255,255,255,0.4);
    border-top-color:#fff; border-radius:50%; animation: spin .7s linear infinite; display:none;
  }
  .btn.loading .spinner{ display:inline-block; }
  @keyframes spin{ to{ transform: rotate(360deg); } }
  .msg{ font-size:12.5px; text-align:center; margin-top:12px; display:none; }
  .msg.error{ color: var(--seal); }
  .msg.success{ color:#4c6b4f; }
  hr.divider{ border:none; border-top:1px dashed var(--line); margin:22px 0; }
  .hint{ font-size:11.5px; color:var(--ink-soft); opacity:0.8; margin-top:-10px; margin-bottom:18px; }

  .section-title{
    font-family:'Noto Serif', serif; font-weight:700; font-size:16px;
    margin: 0 0 4px;
  }
  .section-sub{ font-size:12px; color:var(--ink-soft); margin:0 0 14px; }

  .btn-secondary{
    background: transparent; color: var(--ink); border:1.5px solid var(--line);
    box-shadow:none; font-weight:600;
  }
  .btn-secondary:hover:not(:disabled){ border-color: var(--gold); color: var(--gold); }
  .btn-row{ display:flex; gap:10px; }
  .btn-row .btn{ margin-top:0; }

  .btn-new-contest{
    background: linear-gradient(180deg, var(--gold) 0%, #96701f 100%);
    box-shadow: 0 8px 18px -8px rgba(184,137,43,0.55);
    margin-top: 10px;
    font-size: 13.5px;
  }

  .entries-wrap{ margin-top:16px; }
  .entries-empty{
    font-size:13px; color:var(--ink-soft); text-align:center; padding:18px 0;
  }
  .entries-table{
    width:100%; border-collapse:collapse; font-size:13px; margin-top:12px;
  }
  .entries-table th{
    text-align:left; font-size:11px; letter-spacing:0.04em; text-transform:uppercase;
    color:var(--ink-soft); border-bottom:1.5px solid var(--line); padding:6px 6px;
  }
  .entries-table td{
    padding:9px 6px; border-bottom:1px solid var(--line); vertical-align:top;
  }
  .entries-table td.stt{ width:28px; color:var(--ink-soft); }
  .entries-table a{ color: var(--seal); text-decoration:none; font-weight:600; }
  .entries-table a:hover{ text-decoration:underline; }
  .entries-table .time{ font-size:11.5px; color:var(--ink-soft); white-space:nowrap; }
  .del-btn{
    border:none; background:transparent; color:var(--seal); cursor:pointer;
    font-size:12px; font-weight:700; padding:4px 6px; border-radius:6px;
  }
  .del-btn:hover{ background:#F8EDE9; }
  .del-btn:disabled{ opacity:0.5; cursor:not-allowed; }

  .contests-table{
    width:100%; border-collapse:collapse; font-size:12.5px; margin-top:4px;
  }
  .contests-table th{
    text-align:left; font-size:10.5px; letter-spacing:0.04em; text-transform:uppercase;
    color:var(--ink-soft); border-bottom:1.5px solid var(--line); padding:6px 5px;
  }
  .contests-table td{
    padding:9px 5px; border-bottom:1px solid var(--line); vertical-align:middle;
  }
  .contests-table .cname{ font-weight:700; color:var(--ink); }
  .contests-table .cdate{ font-size:11px; color:var(--ink-soft); white-space:nowrap; }
  .badge{
    display:inline-block; font-size:10.5px; font-weight:700; padding:3px 8px;
    border-radius:20px; white-space:nowrap;
  }
  .badge-open{ background:#E4EFE1; color:#3f6b3f; }
  .badge-upcoming{ background:#FBF1DC; color:#8a6a1c; }
  .badge-closed{ background:#EFEAE0; color:var(--ink-soft); }
  .row-actions{ display:flex; gap:4px; white-space:nowrap; }
  .row-actions button{
    border:none; background:transparent; cursor:pointer; font-size:11.5px;
    font-weight:700; padding:4px 7px; border-radius:6px; color:var(--ink-soft);
  }
  .row-actions button:hover{ background:#F1EBDC; color:var(--ink); }
  .row-actions button.view-btn:hover{ color:var(--seal); }
  .contests-empty{ font-size:13px; color:var(--ink-soft); text-align:center; padding:16px 0; }
  .editing-banner{
    display:flex; align-items:center; justify-content:space-between;
    background:#FBF1DC; border:1px solid #EAD9A6; border-radius:8px;
    padding:9px 12px; font-size:12.5px; color:#8a6a1c; margin-bottom:16px;
  }
  .editing-banner button{
    border:none; background:none; color:#8a6a1c; font-weight:700;
    text-decoration:underline; cursor:pointer; font-size:12px;
  }
  .active-contest-note{
    font-size:12px; color:var(--ink-soft); margin: -6px 0 14px;
  }
  .active-contest-note b{ color:var(--ink); }

  .logout-link{
    display:block; text-align:center; font-size:12px; color:var(--ink-soft);
    opacity:0.7; text-decoration:none; margin-top:18px; cursor:pointer;
    background:none; border:none; font-family:inherit; width:100%;
  }
  .logout-link:hover{ opacity:1; color:var(--seal); }
  .gate-icon{
    width:44px; height:44px; margin:0 auto 14px; border-radius:50%;
    background: linear-gradient(180deg, var(--seal) 0%, var(--seal-dark) 100%);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:19px; box-shadow:0 8px 18px -8px rgba(169,52,42,0.55);
  }
</style>
</head>
<body>
<div class="card">
  <div class="eyebrow">Quản trị</div>
  <h1>THIẾT LẬP CUỘC THI</h1>
  <div class="rule"></div>

  <div id="loginGate">
    <div class="gate-icon">🔒</div>
    <div class="field">
      <label for="loginPassword">Mật khẩu quản trị</label>
      <input type="password" id="loginPassword" placeholder="Nhập mật khẩu để vào trang quản trị" autocomplete="current-password">
    </div>
    <button class="btn" id="loginBtn">
      <span class="spinner"></span>
      <span id="loginLabel">ĐĂNG NHẬP</span>
    </button>
    <div class="msg" id="loginMsg"></div>
  </div>

  <div id="adminPanel" style="display:none">

  <div class="section-title">Danh sách cuộc thi</div>
  <div class="section-sub">Có thể tạo nhiều cuộc thi chạy song song cùng lúc. Bấm "Sửa" để đổi tên/ngày, hoặc "Bài nộp" để xem danh sách nộp bài của cuộc thi đó.</div>

  <div class="msg" id="contestsMsg"></div>
  <div id="contestsEmpty" class="contests-empty" style="display:none">Chưa có cuộc thi nào. Tạo cuộc thi đầu tiên ở form bên dưới.</div>
  <table class="contests-table" id="contestsTable" style="display:none">
    <thead>
      <tr>
        <th>Tên cuộc thi</th>
        <th>Trạng thái</th>
        <th>Thời gian nhận bài</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="contestsBody"></tbody>
  </table>

  <hr class="divider">

  <div class="editing-banner" id="editingBanner" style="display:none">
    <span>Đang sửa: <b id="editingContestName"></b></span>
    <button id="cancelEditBtn">Huỷ sửa</button>
  </div>

  <div class="section-title" id="formSectionTitle">Tạo cuộc thi mới</div>

  <div class="field">
    <label for="contestName">Tên cuộc thi</label>
    <input type="text" id="contestName" placeholder="VD: Cuộc thi ảnh nghệ thuật 2026">
  </div>

  <div class="field">
    <label for="openDate">Ngày mở nhận bài</label>
    <input type="datetime-local" id="openDate">
  </div>

  <div class="field">
    <label for="endDate">Ngày kết thúc nhận bài</label>
    <input type="datetime-local" id="endDate">
  </div>

  <input type="hidden" id="password">

  <button class="btn btn-new-contest" id="newContestBtn">
    <span class="spinner"></span>
    <span id="newContestLabel">🆕 TẠO CUỘC THI MỚI (Sheet + Folder riêng)</span>
  </button>
  <div class="hint" id="newContestHint">Sẽ tạo 1 tab dữ liệu mới và 1 thư mục Drive mới đúng theo tên cuộc thi ở trên. Các cuộc thi khác đang chạy không bị ảnh hưởng.</div>

  <button class="btn" id="saveBtn" style="display:none">
    <span class="spinner"></span>
    <span id="saveLabel">LƯU THAY ĐỔI</span>
  </button>

  <div class="msg" id="msgBox"></div>

  <hr class="divider">

  <div class="section-title">Danh sách bài dự thi</div>
  <div class="section-sub" id="entriesSectionSub">Bấm "Bài nộp" ở 1 cuộc thi trong danh sách phía trên để xem tại đây.</div>
  <div class="active-contest-note" id="activeContestNote" style="display:none">Đang xem bài nộp của: <b id="viewingContestName"></b></div>

  <div class="btn-row">
    <button class="btn btn-secondary" id="loadEntriesBtn" style="flex:1" disabled>
      <span class="spinner"></span>
      <span id="loadEntriesLabel">XEM DANH SÁCH</span>
    </button>
    <button class="btn btn-secondary" id="exportBtn" style="flex:1" disabled>TẢI CSV</button>
  </div>

  <div class="msg" id="entriesMsg"></div>

  <div class="entries-wrap" id="entriesWrap" style="display:none">
    <table class="entries-table">
      <thead>
        <tr>
          <th>Stt</th>
          <th>Họ và tên</th>
          <th>File</th>
          <th>Thời gian</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="entriesBody"></tbody>
    </table>
  </div>

  <button class="logout-link" id="logoutBtn">Đăng xuất</button>

  </div>
</div>

<script>
  // Dán URL Web App (Google Apps Script) — giống hệt URL dùng trong index.html
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjBo6nvQ9HZ0-aboX-FME1scjHF6JdKbcscmlQX3yg7OSLWfNpLtlU6LZihgV2fchsOg/exec";

  const contestName = document.getElementById('contestName');
  const openDate = document.getElementById('openDate');
  const endDate = document.getElementById('endDate');
  const password = document.getElementById('password');
  const saveBtn = document.getElementById('saveBtn');
  const saveLabel = document.getElementById('saveLabel');
  const msgBox = document.getElementById('msgBox');
  const formSectionTitle = document.getElementById('formSectionTitle');
  const newContestBtn = document.getElementById('newContestBtn');
  const newContestLabel = document.getElementById('newContestLabel');
  const newContestHint = document.getElementById('newContestHint');
  const editingBanner = document.getElementById('editingBanner');
  const editingContestNameEl = document.getElementById('editingContestName');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const NEW_CONTEST_LABEL_DEFAULT = '🆕 TẠO CUỘC THI MỚI (Sheet + Folder riêng)';

  const contestsMsg = document.getElementById('contestsMsg');
  const contestsEmpty = document.getElementById('contestsEmpty');
  const contestsTable = document.getElementById('contestsTable');
  const contestsBody = document.getElementById('contestsBody');

  const loadEntriesBtn = document.getElementById('loadEntriesBtn');
  const loadEntriesLabel = document.getElementById('loadEntriesLabel');
  const exportBtn = document.getElementById('exportBtn');
  const entriesMsg = document.getElementById('entriesMsg');
  const entriesWrap = document.getElementById('entriesWrap');
  const entriesBody = document.getElementById('entriesBody');
  const entriesSectionSub = document.getElementById('entriesSectionSub');
  const activeContestNote = document.getElementById('activeContestNote');
  const viewingContestNameEl = document.getElementById('viewingContestName');

  let allContests = [];      // danh sách tất cả cuộc thi (từ listContestsAdmin)
  let editingContestId = '';  // '' = đang ở chế độ TẠO MỚI; khác '' = đang SỬA cuộc thi này
  let viewingContestId = '';  // cuộc thi đang xem danh sách bài nộp
  let currentEntries = [];

  function showMsg(text, type){
    msgBox.textContent = text;
    msgBox.className = `msg ${type}`;
    msgBox.style.display = 'block';
  }
  function showContestsMsg(text, type){
    contestsMsg.textContent = text;
    contestsMsg.className = `msg ${type}`;
    contestsMsg.style.display = 'block';
  }
  function showEntriesMsg(text, type){
    entriesMsg.textContent = text;
    entriesMsg.className = `msg ${type}`;
    entriesMsg.style.display = 'block';
  }

  function toLocalInputValue(isoStr){
    if(!isoStr) return '';
    const d = new Date(isoStr);
    const pad = n => n.toString().padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function formatVN(dateStr){
    if(!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric' });
  }
  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
  function contestStatus(c){
    const now = new Date();
    const o = c.openDate ? new Date(c.openDate) : null;
    const e = c.endDate ? new Date(c.endDate) : null;
    if(o && now < o) return { key:'upcoming', label:'Sắp mở' };
    if(e && now > e) return { key:'closed', label:'Đã đóng' };
    return { key:'open', label:'Đang mở' };
  }

  // ---------------------- Đăng nhập / chắn mật khẩu ----------------------
  const loginGate = document.getElementById('loginGate');
  const adminPanel = document.getElementById('adminPanel');
  const loginPassword = document.getElementById('loginPassword');
  const loginBtn = document.getElementById('loginBtn');
  const loginLabel = document.getElementById('loginLabel');
  const loginMsg = document.getElementById('loginMsg');
  const logoutBtn = document.getElementById('logoutBtn');

  function showLoginMsg(text){
    loginMsg.textContent = text;
    loginMsg.className = 'msg error';
    loginMsg.style.display = 'block';
  }

  async function attemptLogin(){
    if(SCRIPT_URL.includes('PASTE_YOUR')){
      showLoginMsg('Chưa cấu hình SCRIPT_URL trong file admin.html.');
      return;
    }
    if(!loginPassword.value){
      showLoginMsg('Vui lòng nhập mật khẩu quản trị.');
      return;
    }

    loginMsg.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    loginLabel.textContent = 'ĐANG KIỂM TRA...';

    try{
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'verifyPassword', password: loginPassword.value })
      });
      const data = await res.json();
      if(data.status === 'success'){
        password.value = loginPassword.value; // dùng lại cho các thao tác bên trong
        loginGate.style.display = 'none';
        adminPanel.style.display = 'block';
        loadContestsList();
      } else {
        showLoginMsg(data.message || 'Sai mật khẩu quản trị.');
      }
    }catch(err){
      console.error(err);
      showLoginMsg('Có lỗi khi kiểm tra mật khẩu. Vui lòng thử lại.');
    }finally{
      loginBtn.disabled = false;
      loginBtn.classList.remove('loading');
      loginLabel.textContent = 'ĐĂNG NHẬP';
    }
  }

  loginBtn.addEventListener('click', attemptLogin);
  loginPassword.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') attemptLogin();
  });

  logoutBtn.addEventListener('click', () => {
    password.value = '';
    loginPassword.value = '';
    adminPanel.style.display = 'none';
    loginGate.style.display = 'block';
    loginMsg.style.display = 'none';
    entriesWrap.style.display = 'none';
    entriesMsg.style.display = 'none';
    msgBox.style.display = 'none';
    contestsMsg.style.display = 'none';
    exitEditMode();
    allContests = [];
    viewingContestId = '';
    activeContestNote.style.display = 'none';
    loadEntriesBtn.disabled = true;
  });

  // ---------------------- Danh sách cuộc thi ----------------------
  async function loadContestsList(){
    contestsMsg.style.display = 'none';
    try{
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'listContestsAdmin', password: password.value })
      });
      const data = await res.json();
      if(data.status !== 'success'){
        showContestsMsg(data.message || 'Không tải được danh sách cuộc thi.', 'error');
        return;
      }
      allContests = data.contests || [];
      renderContestsList();
    }catch(err){
      console.error(err);
      showContestsMsg('Có lỗi khi tải danh sách cuộc thi.', 'error');
    }
  }

  function renderContestsList(){
    if(allContests.length === 0){
      contestsTable.style.display = 'none';
      contestsEmpty.style.display = 'block';
      return;
    }
    contestsEmpty.style.display = 'none';
    contestsTable.style.display = 'table';
    contestsBody.innerHTML = '';

    allContests.forEach(c => {
      const st = contestStatus(c);
      const dateRange = (c.openDate && c.endDate)
        ? `${formatVN(c.openDate)} — ${formatVN(c.endDate)}`
        : 'Chưa đặt thời gian';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="cname">${escapeHtml(c.contestName)}</td>
        <td><span class="badge badge-${st.key}">${st.label}</span></td>
        <td class="cdate">${dateRange}</td>
        <td>
          <div class="row-actions">
            <button class="edit-btn" data-id="${c.id}">Sửa</button>
            <button class="view-btn" data-id="${c.id}">Bài nộp</button>
          </div>
        </td>
      `;
      contestsBody.appendChild(tr);
    });
  }

  contestsBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const viewBtn = e.target.closest('.view-btn');
    if(editBtn) enterEditMode(editBtn.dataset.id);
    if(viewBtn) selectContestForEntries(viewBtn.dataset.id);
  });

  // ---------------------- Chế độ Tạo mới / Sửa cuộc thi ----------------------
  function enterEditMode(id){
    const c = allContests.find(x => x.id === id);
    if(!c) return;
    editingContestId = id;
    contestName.value = c.contestName || '';
    openDate.value = toLocalInputValue(c.openDate);
    endDate.value = toLocalInputValue(c.endDate);

    formSectionTitle.textContent = 'Sửa cuộc thi';
    editingBanner.style.display = 'flex';
    editingContestNameEl.textContent = c.contestName;
    newContestBtn.style.display = 'none';
    newContestHint.style.display = 'none';
    saveBtn.style.display = 'flex';
    msgBox.style.display = 'none';

    window.scrollTo({ top: document.getElementById('formSectionTitle').offsetTop - 20, behavior: 'smooth' });
  }

  function exitEditMode(){
    editingContestId = '';
    contestName.value = '';
    openDate.value = '';
    endDate.value = '';
    formSectionTitle.textContent = 'Tạo cuộc thi mới';
    editingBanner.style.display = 'none';
    newContestBtn.style.display = 'flex';
    newContestHint.style.display = 'block';
    saveBtn.style.display = 'none';
  }

  cancelEditBtn.addEventListener('click', exitEditMode);

  saveBtn.addEventListener('click', async () => {
    msgBox.style.display = 'none';

    if(!contestName.value.trim()){
      showMsg('Vui lòng nhập tên cuộc thi.', 'error');
      return;
    }
    if(openDate.value && endDate.value && new Date(openDate.value) >= new Date(endDate.value)){
      showMsg('Ngày kết thúc phải sau ngày mở.', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.classList.add('loading');
    saveLabel.textContent = 'ĐANG LƯU...';

    try{
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateSettings',
          password: password.value,
          contestId: editingContestId,
          contestName: contestName.value.trim(),
          openDate: openDate.value ? new Date(openDate.value).toISOString() : '',
          endDate: endDate.value ? new Date(endDate.value).toISOString() : ''
        })
      });
      const data = await res.json();
      if(data.status === 'success'){
        showMsg('Đã lưu thay đổi.', 'success');
        exitEditMode();
        loadContestsList();
      } else {
        showMsg(data.message || 'Không thể lưu thay đổi.', 'error');
      }
    }catch(err){
      console.error(err);
      showMsg('Có lỗi khi lưu. Vui lòng thử lại.', 'error');
    }finally{
      saveBtn.disabled = false;
      saveBtn.classList.remove('loading');
      saveLabel.textContent = 'LƯU THAY ĐỔI';
    }
  });

  newContestBtn.addEventListener('click', async () => {
    msgBox.style.display = 'none';

    if(!contestName.value.trim()){
      showMsg('Vui lòng nhập tên cuộc thi trước khi tạo.', 'error');
      return;
    }
    if(openDate.value && endDate.value && new Date(openDate.value) >= new Date(endDate.value)){
      showMsg('Ngày kết thúc phải sau ngày mở.', 'error');
      return;
    }

    const confirmed = confirm(
      `Tạo cuộc thi mới "${contestName.value.trim()}"?\n\n` +
      `Hệ thống sẽ tự động tạo 1 tab dữ liệu mới và 1 thư mục Drive mới đúng tên cuộc thi này. ` +
      `Cuộc thi này sẽ chạy SONG SONG với các cuộc thi khác đang có, không thay thế hay ảnh hưởng gì đến chúng.`
    );
    if(!confirmed) return;

    newContestBtn.disabled = true;
    newContestBtn.classList.add('loading');
    newContestLabel.textContent = 'ĐANG TẠO...';

    try{
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'createContest',
          password: password.value,
          contestName: contestName.value.trim(),
          openDate: openDate.value ? new Date(openDate.value).toISOString() : '',
          endDate: endDate.value ? new Date(endDate.value).toISOString() : ''
        })
      });
      const data = await res.json();
      if(data.status === 'success'){
        showMsg(`Đã tạo cuộc thi mới. Tab: "${data.sheetName}". Đã tạo thư mục Drive mới.`, 'success');
        contestName.value = '';
        openDate.value = '';
        endDate.value = '';
        loadContestsList();
      } else {
        showMsg(data.message || 'Không thể tạo cuộc thi mới.', 'error');
      }
    }catch(err){
      console.error(err);
      showMsg('Có lỗi khi tạo cuộc thi mới. Vui lòng thử lại.', 'error');
    }finally{
      newContestBtn.disabled = false;
      newContestBtn.classList.remove('loading');
      newContestLabel.textContent = NEW_CONTEST_LABEL_DEFAULT;
    }
  });

  // ---------------------- Danh sách bài dự thi (theo cuộc thi được chọn) ----------------------
  function selectContestForEntries(id){
    const c = allContests.find(x => x.id === id);
    if(!c) return;
    viewingContestId = id;
    viewingContestNameEl.textContent = c.contestName;
    activeContestNote.style.display = 'block';
    entriesSectionSub.style.display = 'none';
    loadEntriesBtn.disabled = false;
    entriesWrap.style.display = 'none';
    entriesMsg.style.display = 'none';
    currentEntries = [];
    exportBtn.disabled = true;
    loadEntries();
    window.scrollTo({ top: document.getElementById('activeContestNote').offsetTop - 20, behavior: 'smooth' });
  }

  function renderEntries(entries){
    currentEntries = entries;
    entriesBody.innerHTML = '';

    if(entries.length === 0){
      entriesWrap.innerHTML = '<div class="entries-empty">Chưa có bài dự thi nào.</div>';
      exportBtn.disabled = true;
      return;
    }

    entries.forEach(entry => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="stt">${entry.stt}</td>
        <td>${escapeHtml(entry.fullName)}</td>
        <td><a href="${entry.fileUrl}" target="_blank" rel="noopener">Xem file</a></td>
        <td class="time">${formatVN(entry.submittedAt)}</td>
        <td><button class="del-btn" data-row="${entry.row}">Xoá</button></td>
      `;
      entriesBody.appendChild(tr);
    });

    exportBtn.disabled = false;
  }

  async function loadEntries(){
    if(!viewingContestId){
      showEntriesMsg('Vui lòng chọn 1 cuộc thi ở danh sách phía trên trước.', 'error');
      return;
    }
    entriesMsg.style.display = 'none';
    loadEntriesBtn.disabled = true;
    loadEntriesBtn.classList.add('loading');
    loadEntriesLabel.textContent = 'ĐANG TẢI...';

    try{
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getEntries', password: password.value, contestId: viewingContestId })
      });
      const data = await res.json();
      if(data.status !== 'success'){
        showEntriesMsg(data.message || 'Không thể tải danh sách.', 'error');
        entriesWrap.style.display = 'none';
        return;
      }
      entriesWrap.style.display = 'block';
      renderEntries(data.entries);
      showEntriesMsg(`Đã tải ${data.entries.length} bài dự thi.`, 'success');
    }catch(err){
      console.error(err);
      showEntriesMsg('Có lỗi khi tải danh sách. Vui lòng thử lại.', 'error');
    }finally{
      loadEntriesBtn.disabled = false;
      loadEntriesBtn.classList.remove('loading');
      loadEntriesLabel.textContent = 'XEM DANH SÁCH';
    }
  }

  loadEntriesBtn.addEventListener('click', loadEntries);

  entriesBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('.del-btn');
    if(!btn) return;

    const row = btn.dataset.row;
    const entry = currentEntries.find(en => en.row.toString() === row);
    const name = entry ? entry.fullName : '';

    if(!confirm(`Xoá bài nộp của "${name}"? Thao tác này không thể hoàn tác (chỉ xoá dòng trên Sheet, KHÔNG xoá file trên Drive).`)){
      return;
    }

    btn.disabled = true;
    btn.textContent = '...';

    try{
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'deleteEntry', password: password.value, contestId: viewingContestId, row })
      });
      const data = await res.json();
      if(data.status === 'success'){
        loadEntries(); // tải lại danh sách để cập nhật Stt mới
      } else {
        showEntriesMsg(data.message || 'Không thể xoá.', 'error');
        btn.disabled = false;
        btn.textContent = 'Xoá';
      }
    }catch(err){
      console.error(err);
      showEntriesMsg('Có lỗi khi xoá. Vui lòng thử lại.', 'error');
      btn.disabled = false;
      btn.textContent = 'Xoá';
    }
  });

  exportBtn.addEventListener('click', () => {
    if(currentEntries.length === 0) return;

    const header = ['Stt','Họ và tên','Link file','Thời gian nộp'];
    const rows = currentEntries.map(en => [
      en.stt,
      `"${(en.fullName || '').replace(/"/g,'""')}"`,
      en.fileUrl,
      formatVN(en.submittedAt)
    ]);
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh-sach-bai-du-thi.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
</script>
</body>
</html>
