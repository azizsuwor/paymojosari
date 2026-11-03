// =========================================================================
// SIM-KAS & UANG MAKAN — PP. MOJOSARI LOCERET NGANJUK
// KOMPLEK TUBAN (RUMAH WAKAF)
// FINPILOT DESIGN ADAPTATION (100% VISUAL & INTERACTION PARITY)
// =========================================================================

const STORAGE_KEY = 'SIMKAS_MOJOSARI_FINPILOT_V13';
const BENDAHARA_WA = '081231256129';
const NOMOR_DANA_DEFAULT = '085335219903';
const DEFAULT_GRUP_LINK = 'https://chat.whatsapp.com/LgVFDhgRgHmDTuC3tCly7c';

const TARIF_DEFAULT = {
  makan: 50000,
  wifi: 20000,
  listrik: 20000,
  air: 10000
};

// Tagihan WiFi Induk bulanan yang dibayarkan oleh Bendahara (Rp 200.000/bulan; sisa iuran WiFi disimpan di Kas Komplek)
const TAGIHAN_WIFI_INDUK_DEFAULT = 200000;

function getTarif(monthKey) {
  const mKey = monthKey || state.activeMonth;
  const customWifi = state.tarifWifiPerBulan && state.tarifWifiPerBulan[mKey] !== undefined
    ? Number(state.tarifWifiPerBulan[mKey])
    : TARIF_DEFAULT.wifi;

  const makan = TARIF_DEFAULT.makan;
  const wifi = customWifi;
  const listrik = TARIF_DEFAULT.listrik;
  const air = TARIF_DEFAULT.air;
  const totalKas = wifi + listrik + air;
  const totalBulanan = makan + totalKas;

  return { makan, wifi, listrik, air, totalKas, totalBulanan };
}

const START_MONTH_KEY = '2026-10';

const AVAILABLE_MONTHS = [
  { key: '2026-10', label: 'Oktober 2026' },
  { key: '2026-11', label: 'November 2026' },
  { key: '2026-12', label: 'Desember 2026' },
  { key: '2027-01', label: 'Januari 2027' },
  { key: '2027-02', label: 'Februari 2027' },
  { key: '2027-03', label: 'Maret 2027' },
  { key: '2027-04', label: 'April 2027' },
  { key: '2027-05', label: 'Mei 2027' },
  { key: '2027-06', label: 'Juni 2027' },
  { key: '2027-07', label: 'Juli 2027' },
  { key: '2027-08', label: 'Agustus 2027' },
  { key: '2027-09', label: 'September 2027' },
  { key: '2027-10', label: 'Oktober 2027' },
  { key: '2027-11', label: 'November 2027' },
  { key: '2027-12', label: 'Desember 2027' }
];

const TRACKED_ARREARS_MONTHS = ['2026-10'];

function buildDefaultTarifMap() {
  const map = {};
  AVAILABLE_MONTHS.forEach(m => { map[m.key] = 20000; });
  return map;
}

function getInitials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getSantriAvatar(s, index = 0, is3x4 = false) {
  if (s && s.avatar && s.avatar.startsWith('data:image/')) {
    return s.avatar;
  }
  const name = s ? (s.nama || s.shortName || 'Santri') : 'Santri';
  const initials = getInitials(name);
  const palettes = [
    { bg: '#064e3b', text: '#ffffff' }, // deep emerald
    { bg: '#0f766e', text: '#ffffff' }, // teal
    { bg: '#1e3a8a', text: '#ffffff' }, // navy blue
    { bg: '#334155', text: '#ffffff' }, // slate
    { bg: '#047857', text: '#ffffff' }, // forest green
    { bg: '#374151', text: '#ffffff' }, // cool dark gray
    { bg: '#115e59', text: '#ffffff' }, // deep teal
    { bg: '#1e293b', text: '#ffffff' }  // dark blue-gray
  ];
  const p = palettes[Math.abs(index) % palettes.length];
  const w = is3x4 ? 90 : 120;
  const h = 120;
  const fs = is3x4 ? 30 : 42;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="${p.bg}"/>
    <text x="50%" y="54%" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="${fs}" font-weight="700" fill="${p.text}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">${initials}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const DEFAULT_SANTRI = [
  { id: 's1', nama: 'Muhammad Abdul Aziz', shortName: 'Aziz', alamat: 'Lampung', prodi: 'Sistem Informasi', wa: '081231256129', tanpaMakan: true, avatar: '' },
  { id: 's2', nama: 'Rahmat Taufik', shortName: 'Taufik', alamat: 'Rejoso', prodi: 'Sistem Informasi', wa: '0891209269', tanpaMakan: false, avatar: '' },
  { id: 's3', nama: 'Nailul Author Ahmad', shortName: 'Nailul', alamat: 'Boyolali', prodi: 'Sistem Informasi', wa: '082136066882', tanpaMakan: false, avatar: '' },
  { id: 's4', nama: 'Raihan Chayin', shortName: 'Raihan', alamat: 'Ngawi', prodi: 'Sistem Informasi', wa: '082331491897', tanpaMakan: false, avatar: '' },
  { id: 's5', nama: 'Angga Sanjaya', shortName: 'Angga', alamat: 'Purworejo', prodi: 'Sistem Informasi', wa: '083821865361', tanpaMakan: false, avatar: '' },
  { id: 's6', nama: 'Ahmad Dimas Nasrulloh', shortName: 'Dimas', alamat: 'Sidoarjo', prodi: 'Sistem Informasi', wa: '085645259514', tanpaMakan: false, avatar: '' },
  { id: 's7', nama: 'Ahmad Lukman Hakim', shortName: 'Lukman', alamat: 'Rejoso', prodi: 'Sistem Informasi', wa: '083849858925', tanpaMakan: false, avatar: '' },
  { id: 's8', nama: 'Riyadlus Sholikhin', shortName: 'Riyad', alamat: 'Loceret', prodi: 'Sistem Informasi', wa: '08318726592', tanpaMakan: false, avatar: '' },
  { id: 's9', nama: 'Muhammad Saiful Anam', shortName: 'Anam', alamat: 'Sawahan', prodi: 'Sistem Informasi', wa: '082146282076', tanpaMakan: false, avatar: '' },
  { id: 's10', nama: 'Ahmad Fathony Sidqan', shortName: 'Fathony', alamat: 'Berbek', prodi: 'Sistem Informasi', wa: '0895414997822', tanpaMakan: false, avatar: '' },
  { id: 's11', nama: 'Muhammad Nasikhul Umam', shortName: 'Umam', alamat: 'Loceret', prodi: 'Pendidikan Teknologi Informasi', wa: '085710272496', tanpaMakan: true, avatar: '' },
  { id: 's12', nama: 'Alwi Shihab Azzuhry', shortName: 'Alwi', alamat: 'Jambi', prodi: 'Pendidikan Teknologi Informasi', wa: '082294423387', tanpaMakan: false, avatar: '' },
  { id: 's13', nama: 'Muhammad Choirul Anwar', shortName: 'Anwar', alamat: 'Sawahan', prodi: 'Pendidikan Teknologi Informasi', wa: '081770092651', tanpaMakan: false, avatar: '' },
  { id: 's14', nama: 'Manshur Siroj', shortName: 'Manshur', alamat: 'Rejoso', prodi: 'Pendidikan Teknologi Informasi', wa: '085335219903', tanpaMakan: false, avatar: '' },
  { id: 's15', nama: 'Fadli Hibatulloh Ahmad', shortName: 'Fadli', alamat: 'Kudus', prodi: 'Teknik Industri', wa: '0887766847234', tanpaMakan: false, avatar: '' },
  { id: 's16', nama: 'Muhammad Rasyid Fathoni', shortName: 'Rasyid', alamat: 'Madiun', prodi: 'Akuntansi Bisnis Digital', wa: '082143460969', tanpaMakan: false, avatar: '' },
  { id: 's17', nama: 'Ahmad Zuhdi Affabillah', shortName: 'Zuhdi', alamat: 'Ngeronggot', prodi: 'Akuntansi Bisnis Digital', wa: '085704414868', tanpaMakan: false, avatar: '' }
];

let state = {
  activeMonth: '2026-10',
  activeTab: 'pembayaran', // Defaulting to Payments tab matching FinPilot
  selectedSantriId: 's1',  // Selected in Quick Transfer
  quickMode: 'full',       // 'full' (100k) | 'makan' (50k) | 'wifi' (manual)
  linkGrupWa: DEFAULT_GRUP_LINK,
  nomorDanaBendahara: NOMOR_DANA_DEFAULT,
  santri: JSON.parse(JSON.stringify(DEFAULT_SANTRI)),
  tarifWifiPerBulan: buildDefaultTarifMap(),
  pembayaran: {},
  setoranWifiBendahara: {},
  masakLogs: [],
  kasUmumLogs: [],
  konfirmasiBayar: [],
  utangKas: [],
  recentTransactions: []
};

let currentWifiModalCtx = {
  monthKey: null,
  tempImgDataUrl: ''
};

let currentBuktiSantriCtx = {
  santriId: null,
  monthKey: null,
  tempImgDataUrl: ''
};

let deferredPwaPrompt = null;

let currentSantriPhotoUrl = '';

// Fallback avatar helper
function getFallbackAvatar(index = 0) {
  return getSantriAvatar(null, index);
}

function createSampleWifiChatDataUrl(bulanLabel, nominalRp) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="300" viewBox="0 0 460 300">
    <rect width="460" height="300" rx="16" fill="#e5ddd5"/>
    <rect width="460" height="48" rx="16" fill="#064e3b"/>
    <circle cx="30" cy="24" r="14" fill="#047857"/>
    <text x="54" y="22" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">Pak H. Mahmud (Pemilik WiFi Tuban)</text>
    <text x="54" y="37" font-family="sans-serif" font-size="10" fill="#d1fae5">online • Chat Setoran WiFi Bulanan</text>
    
    <rect x="80" y="64" width="360" height="105" rx="12" fill="#dcf8c6" stroke="#c5e1a5"/>
    <text x="95" y="86" font-family="sans-serif" font-size="12" font-weight="bold" fill="#064e3b">Assalamu'alaikum Pak Haji,</text>
    <text x="95" y="106" font-family="sans-serif" font-size="12" fill="#1e293b">Saya Bendahara Komplek Tuban (Rumah Wakaf)</text>
    <text x="95" y="124" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Setor WiFi Bulanan (${bulanLabel}) — ${nominalRp}</text>
    <text x="95" y="144" font-family="monospace" font-size="11" fill="#047857">[BUKTI TRANSFER TERLAMPIR]</text>
    <text x="380" y="160" font-family="sans-serif" font-size="10" fill="#64748b">14:10 ✓✓</text>

    <rect x="20" y="185" width="335" height="82" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="35" y="208" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Wa'alaikumsalam Wr. Wb. Kang</text>
    <text x="35" y="228" font-family="sans-serif" font-size="12" fill="#334155">Dana WiFi ${bulanLabel} sudah masuk.</text>
    <text x="35" y="246" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857">Status: LUNAS &amp; Aktif.</text>
    <text x="305" y="258" font-family="sans-serif" font-size="10" fill="#64748b">14:12</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function createCashPaymentSvgDataUrl(santriName, nominalRp, bulanLabel) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="260" viewBox="0 0 460 260">
    <rect width="460" height="260" rx="20" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
    <rect width="460" height="52" rx="20" fill="#064e3b"/>
    <text x="30" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">💵 KONFIRMASI PEMBAYARAN TUNAI (CASH)</text>
    <circle cx="420" cy="26" r="10" fill="#10b981"/>
    
    <text x="30" y="90" font-family="sans-serif" font-size="12" fill="#64748b">Nama Santri:</text>
    <text x="30" y="112" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">${santriName}</text>
    
    <text x="30" y="145" font-family="sans-serif" font-size="12" fill="#64748b">Periode Iuran:</text>
    <text x="30" y="165" font-family="sans-serif" font-size="14" font-weight="bold" fill="#064e3b">${bulanLabel}</text>
    
    <text x="260" y="145" font-family="sans-serif" font-size="12" fill="#64748b">Total Nominal Tunai:</text>
    <text x="260" y="168" font-family="monospace" font-size="18" font-weight="bold" fill="#064e3b">${nominalRp}</text>
    
    <rect x="25" y="195" width="410" height="45" rx="10" fill="#dcfce7" stroke="#bbf7d0"/>
    <text x="40" y="222" font-family="sans-serif" font-size="11" font-weight="bold" fill="#166534">✓ Diserahkan langsung secara tunai/cash kepada Bendahara</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function getInitialDemoState() {
  return {
    activeMonth: '2026-10',
    activeTab: 'pembayaran',
    selectedSantriId: 's1',
    quickMode: 'full',
    linkGrupWa: DEFAULT_GRUP_LINK,
    nomorDanaBendahara: NOMOR_DANA_DEFAULT,
    santri: JSON.parse(JSON.stringify(DEFAULT_SANTRI)),
    tarifWifiPerBulan: buildDefaultTarifMap(),
    pembayaran: {},
    setoranWifiBendahara: {},
    masakLogs: [],
    kasUmumLogs: [],
    konfirmasiBayar: [],
    utangKas: [],
    recentTransactions: []
  };
}

function purgeOldMonthsFromState() {
  if (!AVAILABLE_MONTHS.some(m => m.key === state.activeMonth)) {
    state.activeMonth = START_MONTH_KEY;
  }
  if (!Array.isArray(state.kasUmumLogs)) state.kasUmumLogs = [];
  if (!Array.isArray(state.konfirmasiBayar)) state.konfirmasiBayar = [];
  if (!state.nomorDanaBendahara) state.nomorDanaBendahara = NOMOR_DANA_DEFAULT;
  state.tarifWifiPerBulan = { ...buildDefaultTarifMap(), ...(state.tarifWifiPerBulan || {}) };
  Object.keys(state.tarifWifiPerBulan).forEach(mKey => {
    if (mKey < START_MONTH_KEY) delete state.tarifWifiPerBulan[mKey];
  });
  Object.keys(state.pembayaran || {}).forEach(k => {
    const [, mKey] = k.split('_');
    if (!mKey || mKey < START_MONTH_KEY) delete state.pembayaran[k];
  });
  Object.keys(state.setoranWifiBendahara || {}).forEach(mKey => {
    if (mKey < START_MONTH_KEY) delete state.setoranWifiBendahara[mKey];
  });
}

// =========================================================================
// INITIALIZATION & PERSISTENCE
// =========================================================================

// =========================================================================
// ROLE & AUTHENTICATION (GUEST / SANTRI PRIBADI / ADMIN BENDAHARA)
// =========================================================================

let loginModalTempSantriId = 's1';
let loginModalTempAdminId = localStorage.getItem('paymojosari_logged_admin_id') || 's1';
let generatedAdminOtp = null;

// Daftar Pengurus Bendahara Resmi Komplek Tuban
const BENDAHARA_LIST = [
  { id: 's1', nama: 'Muhammad Abdul Aziz', jabatan: 'Bendahara Pusat', wa: '081231256129', inisial: 'AA' },
  { id: 's2', nama: 'Rahmat Taufik', jabatan: 'Bendahara', wa: '0891209269', inisial: 'RT' },
  { id: 's14', nama: 'Manshur Siroj', jabatan: 'Bendahara', wa: '085335219903', inisial: 'MS' }
];

function getValidAdminWas() {
  const list = ['081231256129', '0891209269', '085335219903', normalizeWaLocal(BENDAHARA_WA)];
  ['s1', 's2', 's14'].forEach(id => {
    const s = state.santri.find(x => x.id === id);
    if (s && s.wa) list.push(normalizeWaLocal(s.wa));
  });
  return Array.from(new Set(list.filter(Boolean)));
}

function getActiveAdminProfile() {
  const savedId = localStorage.getItem('paymojosari_logged_admin_id') || loginModalTempAdminId || 's1';
  const cfg = BENDAHARA_LIST.find(b => b.id === savedId) || BENDAHARA_LIST[0];
  const santriData = state.santri.find(s => s.id === cfg.id);
  const idx = state.santri.findIndex(s => s.id === cfg.id);
  return {
    ...cfg,
    nama: santriData ? santriData.nama : cfg.nama,
    wa: normalizeWaLocal(santriData && santriData.wa ? santriData.wa : cfg.wa),
    avatar: getSantriAvatar(santriData || cfg, idx >= 0 ? idx : 0)
  };
}

function renderAdminProfilePicker() {
  const container = document.getElementById('adminProfilePickerList');
  if (!container) return;

  container.innerHTML = BENDAHARA_LIST.map(b => {
    const s = state.santri.find(x => x.id === b.id);
    const idx = state.santri.findIndex(x => x.id === b.id);
    const avatarUrl = getSantriAvatar(s || b, idx >= 0 ? idx : 0);
    const isSel = b.id === loginModalTempAdminId;
    const nis = s ? getNomorIndukSantri(s, idx >= 0 ? idx : 0) : (b.id === 's1' ? 'NIS-TBN-2026-001' : (b.id === 's2' ? 'NIS-TBN-2026-002' : 'NIS-TBN-2026-014'));

    return `
      <div onclick="selectLoginAdminProfile('${b.id}')" class="p-2.5 rounded-xl border ${isSel ? 'bg-emerald-50/70 border-[#064e3b] ring-1 ring-[#064e3b]/20' : 'bg-[#f8fafc] border-slate-200/80 hover:bg-slate-50'} flex items-center gap-2.5 cursor-pointer transition">
        <div class="relative shrink-0">
          <img src="${avatarUrl}" alt="${b.nama}" class="w-9 h-9 rounded-full object-cover border ${isSel ? 'border-[#064e3b]' : 'border-slate-200'} bg-white" />
          ${isSel ? `<span class="w-3.5 h-3.5 rounded-full bg-[#064e3b] text-white flex items-center justify-center absolute -bottom-0.5 -right-0.5 text-[8px] font-bold">✓</span>` : ''}
        </div>
        <div class="min-w-0 flex-1">
          <span class="text-[11px] font-bold text-slate-900 block truncate leading-tight">${s ? s.nama : b.nama}</span>
          <span class="text-[10px] font-semibold text-emerald-800 block leading-tight mt-0.5">${b.jabatan}</span>
          <span class="text-[9px] font-mono text-slate-400 block truncate">${nis}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectLoginAdminProfile(adminId) {
  loginModalTempAdminId = adminId;
  renderAdminProfilePicker();
  const maskedEl = document.getElementById('resetAdminWaMasked');
  if (maskedEl) {
    const b = BENDAHARA_LIST.find(x => x.id === adminId) || BENDAHARA_LIST[0];
    const s = state.santri.find(x => x.id === b.id);
    const wa = normalizeWaLocal(s && s.wa ? s.wa : b.wa);
    maskedEl.textContent = maskPhoneNumber(wa);
  }
}

function getAuthToken() {
  return sessionStorage.getItem('paymojosari_auth_token') || localStorage.getItem('paymojosari_auth_token') || '';
}

function getAdminHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Admin-Token': getAuthToken()
  };
}

function getAdminKey() {
  return getAuthToken();
}

function normalizeWaLocal(wa) {
  let clean = String(wa || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('62')) {
    clean = '0' + clean.slice(2);
  } else if (clean.startsWith('8')) {
    clean = '0' + clean;
  }
  return clean;
}

function maskPhoneNumber(wa) {
  const clean = String(wa || '').trim();
  if (clean.length <= 6) return clean;
  return clean.slice(0, 4) + '••••' + clean.slice(-3);
}

function handleTopProfileClick() {
  openAdminLoginModal('santri');
}

function openAdminLoginModal(defaultTab = 'santri') {
  const modal = document.getElementById('modalAdminLogin');
  if (!modal) return;
  modal.classList.remove('hidden');

  if (!loginModalTempSantriId && state.santri.length > 0) {
    loginModalTempSantriId = state.loggedSantriId || state.selectedSantriId || state.santri[0].id;
  } else if (state.loggedSantriId) {
    loginModalTempSantriId = state.loggedSantriId;
  }

  renderLoginModalSantriPicker();
  switchLoginModalTab(defaultTab);

  const errAdmin = document.getElementById('adminLoginError');
  if (errAdmin) errAdmin.classList.add('hidden');
  const errSantri = document.getElementById('santriLoginError');
  if (errSantri) errSantri.classList.add('hidden');

  if (window.lucide) window.lucide.createIcons();
}

function closeAdminLoginModal() {
  const modal = document.getElementById('modalAdminLogin');
  if (modal) modal.classList.add('hidden');
}

function switchLoginModalTab(tab) {
  const formSantri = document.getElementById('formLoginSantri');
  const formResetSantri = document.getElementById('formResetSantriPassword');
  const formAdmin = document.getElementById('formLoginAdmin');
  const formResetAdmin = document.getElementById('formResetAdminPassword');
  const btnSantri = document.getElementById('tabBtnLoginSantri');
  const btnAdmin = document.getElementById('tabBtnLoginAdmin');

  if (formResetSantri) formResetSantri.classList.add('hidden');
  if (formResetAdmin) formResetAdmin.classList.add('hidden');

  // Pastikan daftar avatar & dropdown santri selalu ter-render
  renderLoginModalSantriPicker();

  if (tab === 'admin') {
    if (formSantri) formSantri.classList.add('hidden');
    if (formAdmin) formAdmin.classList.remove('hidden');
    if (btnAdmin) btnAdmin.className = 'py-2.5 rounded-lg bg-white text-slate-900 font-bold shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5';
    if (btnSantri) btnSantri.className = 'py-2.5 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition flex items-center justify-center gap-1.5';
    const waInput = document.getElementById('adminWaInput');
    const passInput = document.getElementById('adminPasswordInput');
    if (passInput) passInput.value = '';
    if (waInput && !waInput.value) {
      setTimeout(() => waInput.focus(), 100);
    } else if (passInput) {
      setTimeout(() => passInput.focus(), 100);
    }
  } else {
    if (formAdmin) formAdmin.classList.add('hidden');
    if (formSantri) formSantri.classList.remove('hidden');
    if (btnSantri) btnSantri.className = 'py-2.5 rounded-lg bg-white text-slate-900 font-bold shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5';
    if (btnAdmin) btnAdmin.className = 'py-2.5 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition flex items-center justify-center gap-1.5';
    const pinInput = document.getElementById('loginSantriPinInput');
    if (pinInput) {
      pinInput.value = '';
      setTimeout(() => pinInput.focus(), 100);
    }
  }
  if (window.lucide) window.lucide.createIcons();
}

function openResetAdminPasswordForm() {
  const modal = document.getElementById('modalAdminLogin');
  if (modal && modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
  }
  switchLoginModalTab('admin');
  const formAdmin = document.getElementById('formLoginAdmin');
  const formResetAdmin = document.getElementById('formResetAdminPassword');
  if (formAdmin) formAdmin.classList.add('hidden');
  if (formResetAdmin) formResetAdmin.classList.remove('hidden');

  const activeAdmin = getActiveAdminProfile();
  const maskedEl = document.getElementById('resetAdminWaMasked');
  if (maskedEl) maskedEl.textContent = maskPhoneNumber(activeAdmin.wa);

  const waInp = document.getElementById('resetAdminWaInput');
  const newInp = document.getElementById('resetAdminNewPassInput');
  const confInp = document.getElementById('resetAdminConfirmPassInput');
  const otpCont = document.getElementById('resetAdminOtpContainer');
  const otpInp = document.getElementById('resetAdminOtpInput');
  const errEl = document.getElementById('resetAdminError');

  generatedAdminOtp = null;
  if (waInp) waInp.value = '';
  if (newInp) newInp.value = '';
  if (confInp) confInp.value = '';
  if (otpInp) otpInp.value = '';
  if (otpCont) otpCont.classList.add('hidden');
  if (errEl) errEl.classList.add('hidden');

  if (waInp) setTimeout(() => waInp.focus(), 100);
  if (window.lucide) window.lucide.createIcons();
}

function toggleResetAdminPassVisibility() {
  const newInp = document.getElementById('resetAdminNewPassInput');
  const confInp = document.getElementById('resetAdminConfirmPassInput');
  if (!newInp) return;
  const nextType = newInp.type === 'password' ? 'text' : 'password';
  newInp.type = nextType;
  if (confInp) confInp.type = nextType;
}

async function sendAdminOtpViaWa() {
  const waInp = document.getElementById('resetAdminWaInput');
  const errEl = document.getElementById('resetAdminError');
  const otpCont = document.getElementById('resetAdminOtpContainer');
  const otpInp = document.getElementById('resetAdminOtpInput');

  const validWas = getValidAdminWas();
  const enteredWa = normalizeWaLocal(waInp ? waInp.value : '');

  if (!enteredWa || !validWas.includes(enteredWa)) {
    if (errEl) {
      errEl.textContent = 'Nomor WA Bendahara tidak sesuai';
      errEl.classList.remove('hidden');
    }
    showToast('Nomor WA salah', 'rose');
    return;
  }

  if (errEl) errEl.classList.add('hidden');

  let serverOtp = '';
  if (window.location.protocol !== 'file:') {
    try {
      const res = await fetch('api.php?action=send_admin_otp', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wa: enteredWa })
      });
      const json = await res.json();
      if (!res.ok || json.status !== 'success') {
        if (errEl) {
          errEl.textContent = json.message || 'Gagal membuat kode OTP';
          errEl.classList.remove('hidden');
        }
        return;
      }
      serverOtp = json.otp;
    } catch (err) {
      console.warn('Gagal request OTP server:', err);
    }
  }

  generatedAdminOtp = serverOtp || String(Math.floor(100000 + Math.random() * 900000));
  if (otpCont) otpCont.classList.remove('hidden');
  if (otpInp) setTimeout(() => otpInp.focus(), 100);

  const intlWa = '62' + enteredWa.replace(/^0+/, '');
  const msg = `*KODE VERIFIKASI RESMI PAYMOJOSARI*\nKode OTP Ganti Sandi Bendahara: *${generatedAdminOtp}*\n(Berlaku 5 menit)`;
  window.open(`https://wa.me/${intlWa}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('OTP terkirim ke WA', 'emerald');
}

async function handleResetAdminPasswordSubmit(e) {
  e.preventDefault();
  const waInp = document.getElementById('resetAdminWaInput');
  const otpInp = document.getElementById('resetAdminOtpInput');
  const newInp = document.getElementById('resetAdminNewPassInput');
  const confInp = document.getElementById('resetAdminConfirmPassInput');
  const sendWaCheck = document.getElementById('resetAdminSendWaCheck');
  const errEl = document.getElementById('resetAdminError');

  const enteredWa = normalizeWaLocal(waInp ? waInp.value : '');
  const enteredOtp = otpInp ? otpInp.value.trim() : '';
  const newPass = newInp ? newInp.value.trim() : '';
  const confPass = confInp ? confInp.value.trim() : '';
  const validWas = getValidAdminWas();

  const showErr = (txt) => {
    if (errEl) {
      errEl.textContent = txt;
      errEl.classList.remove('hidden');
    }
    showToast(txt, 'rose');
  };

  if (!enteredWa || !validWas.includes(enteredWa)) {
    showErr('Verifikasi gagal: Nomor WhatsApp tidak terdaftar sebagai Bendahara!');
    return;
  }

  if (!enteredOtp) {
    showErr('Masukkan kode OTP verifikasi WhatsApp!');
    return;
  }

  if (newPass.length < 4) {
    showErr('Sandi baru minimal harus 4 karakter!');
    return;
  }

  if (newPass !== confPass) {
    showErr('Konfirmasi sandi baru tidak cocok!');
    return;
  }

  // Simpan ke backend MySQL jika online
  if (window.location.protocol !== 'file:') {
    try {
      const res = await fetch('api.php?action=reset_admin_password', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wa: enteredWa, otp: enteredOtp, new_password: newPass })
      });
      const json = await res.json();
      if (!res.ok || json.status !== 'success') {
        showErr(json.message || 'Gagal memperbarui sandi di server.');
        return;
      }
    } catch (err) {
      console.warn('Mode lokal aktif untuk simpan sandi:', err);
    }
  }

  const matchedBend = BENDAHARA_LIST.find(b => normalizeWaLocal(b.wa) === enteredWa);
  if (matchedBend) {
    loginModalTempAdminId = matchedBend.id;
  }
  localStorage.setItem('paymojosari_logged_admin_id', loginModalTempAdminId);
  localStorage.removeItem('paymojosari_admin_pass'); // Keamanan: Jangan simpan password di localStorage!
  localStorage.setItem('paymojosari_role', 'admin');
  localStorage.removeItem('paymojosari_logged_santri_id');

  state.userRole = 'admin';
  state.isAdmin = true;
  state.loggedSantriId = null;

  if (sendWaCheck && sendWaCheck.checked) {
    const intlWa = '62' + enteredWa.replace(/^0+/, '');
    const msg = `*SANDI BENDAHARA PAYMOJOSARI*\nSandi Baru: *${newPass}*`;
    window.open(`https://wa.me/${intlWa}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  closeAdminLoginModal();
  updateRoleUI();
  renderAll();
  showToast('Sandi berhasil diubah', 'emerald');
}

function openResetSantriPasswordForm() {
  const modal = document.getElementById('modalAdminLogin');
  if (modal && modal.classList.contains('hidden')) {
    modal.classList.remove('hidden');
  }
  const selectEl = document.getElementById('loginSantriSelect');
  if (selectEl && selectEl.value) {
    loginModalTempSantriId = selectEl.value;
  } else if (state.loggedSantriId) {
    loginModalTempSantriId = state.loggedSantriId;
  }

  const s = state.santri.find(x => x.id === loginModalTempSantriId) || state.santri[0];
  if (!s) return;

  const formSantri = document.getElementById('formLoginSantri');
  const formResetSantri = document.getElementById('formResetSantriPassword');
  const formAdmin = document.getElementById('formLoginAdmin');
  const formResetAdmin = document.getElementById('formResetAdminPassword');

  if (formSantri) formSantri.classList.add('hidden');
  if (formAdmin) formAdmin.classList.add('hidden');
  if (formResetAdmin) formResetAdmin.classList.add('hidden');
  if (formResetSantri) formResetSantri.classList.remove('hidden');

  const nameEl = document.getElementById('resetSantriTargetName');
  const maskEl = document.getElementById('resetSantriWaMasked');
  if (nameEl) nameEl.textContent = `${s.nama} (${s.prodi})`;
  if (maskEl) maskEl.textContent = maskPhoneNumber(normalizeWaLocal(s.wa));

  const waInp = document.getElementById('resetSantriWaInput');
  const newInp = document.getElementById('resetSantriNewPinInput');
  const confInp = document.getElementById('resetSantriConfirmPinInput');
  const errEl = document.getElementById('resetSantriError');

  if (waInp) waInp.value = '';
  if (newInp) newInp.value = '';
  if (confInp) confInp.value = '';
  if (errEl) errEl.classList.add('hidden');

  if (waInp) setTimeout(() => waInp.focus(), 100);
  if (window.lucide) window.lucide.createIcons();
}

async function handleResetSantriPasswordSubmit(e) {
  e.preventDefault();
  const s = state.santri.find(x => x.id === loginModalTempSantriId);
  if (!s) return;

  const waInp = document.getElementById('resetSantriWaInput');
  const newInp = document.getElementById('resetSantriNewPinInput');
  const confInp = document.getElementById('resetSantriConfirmPinInput');
  const sendWaCheck = document.getElementById('resetSantriSendWaCheck');
  const errEl = document.getElementById('resetSantriError');

  const enteredWa = normalizeWaLocal(waInp ? waInp.value : '');
  const registeredWa = normalizeWaLocal(s.wa);
  const newPin = newInp ? newInp.value.trim() : '';
  const confPin = confInp ? confInp.value.trim() : '';

  const showErr = (txt) => {
    if (errEl) {
      errEl.textContent = txt;
      errEl.classList.remove('hidden');
    }
    showToast(txt, 'rose');
  };

  if (!enteredWa || enteredWa !== registeredWa) {
    showErr(`Nomor WhatsApp tidak cocok dengan nomor terdaftar milik ${s.nama}!`);
    return;
  }

  if (newPin.length < 4) {
    showErr('Sandi / PIN baru minimal 4 karakter!');
    return;
  }

  if (newPin !== confPin) {
    showErr('Konfirmasi sandi baru tidak cocok!');
    return;
  }

  if (window.location.protocol !== 'file:') {
    try {
      const res = await fetch('api.php?action=reset_santri_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ santri_id: s.id, wa: enteredWa, new_pin: newPin })
      });
      const json = await res.json();
      if (!res.ok || json.status !== 'success') {
        showErr(json.message || 'Gagal memperbarui sandi santri di server.');
        return;
      }
    } catch (err) {
      console.warn('Simpan sandi santri lokal:', err);
    }
  }

  s.pinSandi = newPin;
  saveState(true);

  state.userRole = 'santri';
  state.isAdmin = false;
  state.loggedSantriId = s.id;
  state.selectedSantriId = s.id;
  localStorage.setItem('paymojosari_role', 'santri');
  localStorage.setItem('paymojosari_logged_santri_id', s.id);
  localStorage.removeItem('paymojosari_admin_pass');

  if (sendWaCheck && sendWaCheck.checked) {
    const intlWa = '62' + registeredWa.replace(/^0+/, '');
    const msg = `*SANDI AKUN SANTRI PAYMOJOSARI*\nNama: *${s.nama}*\nSandi / Kode Akses Baru: *${newPin}*\n\nSimpan pesan ini untuk masuk ke PayMojosari.`;
    window.open(`https://wa.me/${intlWa}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  closeAdminLoginModal();
  updateRoleUI();
  renderAll();
  showToast(`✓ Sandi untuk ${s.nama} berhasil diperbarui!`, 'emerald');
}

function renderLoginModalSantriPicker() {
  const avatarContainer = document.getElementById('loginSantriAvatarList');
  const selectEl = document.getElementById('loginSantriSelect');
  const hintEl = document.getElementById('loginSantriWaHint');
  if (!avatarContainer || !selectEl) return;

  if (!state.santri.some(s => s.id === loginModalTempSantriId) && state.santri.length > 0) {
    loginModalTempSantriId = state.santri[0].id;
  }

  avatarContainer.innerHTML = state.santri.map((s, idx) => {
    const isSel = s.id === loginModalTempSantriId;
    const avatarUrl = getSantriAvatar(s, idx);
    return `
      <div onclick="selectLoginSantriAvatar('${s.id}')" class="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group">
        <div class="w-12 h-12 rounded-full p-[2px] transition-all flex items-center justify-center ${isSel ? 'ring-2 ring-[#064e3b] ring-offset-2 ring-offset-white' : 'border border-slate-200 group-hover:border-slate-300 opacity-80 group-hover:opacity-100'}">
          <img src="${avatarUrl}" alt="${s.nama}" class="w-full h-full rounded-full object-cover bg-slate-100" />
        </div>
        <span class="text-[10px] ${isSel ? 'font-bold text-[#064e3b]' : 'font-medium text-slate-500'} max-w-[56px] truncate text-center">${s.shortName || s.nama.split(' ')[0]}</span>
      </div>
    `;
  }).join('');

  selectEl.innerHTML = state.santri.map(s =>
    `<option value="${s.id}" ${s.id === loginModalTempSantriId ? 'selected' : ''}>${s.nama} — ${s.prodi}</option>`
  ).join('');

  const activeSantri = state.santri.find(s => s.id === loginModalTempSantriId);
  if (hintEl && activeSantri) {
    const cleanWa = String(activeSantri.wa || '').replace(/[^0-9]/g, '');
    hintEl.textContent = `WA: ${maskPhoneNumber(cleanWa)}`;
  }
}

function selectLoginSantriAvatar(santriId) {
  loginModalTempSantriId = santriId;
  renderLoginModalSantriPicker();
  const errSantri = document.getElementById('santriLoginError');
  if (errSantri) errSantri.classList.add('hidden');
}

async function handleSantriLoginSubmit(e) {
  e.preventDefault();
  const selectEl = document.getElementById('loginSantriSelect');
  const pinInput = document.getElementById('loginSantriPinInput');
  const errEl = document.getElementById('santriLoginError');

  const chosenId = selectEl ? selectEl.value : loginModalTempSantriId;
  const s = state.santri.find(x => x.id === chosenId);
  if (!s) return;

  const rawEntered = String(pinInput ? pinInput.value : '').trim();
  if (!rawEntered) return;

  // Verifikasi ke server backend (api.php?action=login_santri)
  if (window.location.protocol !== 'file:') {
    try {
      const res = await fetch('api.php?action=login_santri', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ santri_id: s.id, pin: rawEntered })
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        state.userRole = 'santri';
        state.isAdmin = false;
        state.loggedSantriId = s.id;
        state.selectedSantriId = s.id;
        if (json.token) {
          sessionStorage.setItem('paymojosari_auth_token', json.token);
          localStorage.setItem('paymojosari_auth_token', json.token);
        }
        localStorage.setItem('paymojosari_role', 'santri');
        localStorage.setItem('paymojosari_logged_santri_id', s.id);
        localStorage.removeItem('paymojosari_admin_pass');

        closeAdminLoginModal();
        updateRoleUI();
        renderAll();
        showToast(`Login: ${s.nama}`, 'emerald');
        return;
      } else {
        if (errEl) {
          errEl.textContent = json.message || 'Sandi atau PIN salah';
          errEl.classList.remove('hidden');
        }
        showToast('Sandi salah', 'rose');
        return;
      }
    } catch (err) {
      console.warn('Mode offline/file aktif untuk login santri:', err);
    }
  }

  // Fallback offline jika membuka via file:///
  const cleanWa = String(s.wa || '').replace(/[^0-9]/g, '');
  const last4 = cleanWa.slice(-4);
  const isMatch = (rawEntered === cleanWa || rawEntered === last4 || rawEntered.toLowerCase() === s.id.toLowerCase() || rawEntered === '1234');
  if (isMatch) {
    state.userRole = 'santri';
    state.isAdmin = false;
    state.loggedSantriId = s.id;
    state.selectedSantriId = s.id;
    localStorage.setItem('paymojosari_role', 'santri');
    localStorage.setItem('paymojosari_logged_santri_id', s.id);
    closeAdminLoginModal();
    updateRoleUI();
    renderAll();
    showToast(`Login: ${s.nama}`, 'emerald');
  } else {
    if (errEl) errEl.classList.remove('hidden');
    showToast('Sandi salah', 'rose');
  }
}

function togglePasswordVisibility() {
  const input = document.getElementById('adminPasswordInput');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

async function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const waInput = document.getElementById('adminWaInput');
  const input = document.getElementById('adminPasswordInput');
  const errEl = document.getElementById('adminLoginError');

  const enteredWa = normalizeWaLocal(waInput ? waInput.value : '');
  const enteredPass = input ? input.value.trim() : '';

  const validWas = getValidAdminWas();
  const isWaValid = Boolean(enteredWa && validWas.includes(enteredWa));
  if (!isWaValid) {
    if (errEl) {
      errEl.textContent = 'Nomor WhatsApp bukan nomor resmi Bendahara';
      errEl.classList.remove('hidden');
    }
    showToast('Nomor WA salah', 'rose');
    return;
  }

  // Verifikasi ke server backend (api.php?action=login_admin)
  if (window.location.protocol !== 'file:') {
    try {
      const res = await fetch('api.php?action=login_admin', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wa: enteredWa, password: enteredPass })
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        if (json.token) {
          sessionStorage.setItem('paymojosari_auth_token', json.token);
          localStorage.setItem('paymojosari_auth_token', json.token);
        }
        localStorage.setItem('paymojosari_role', 'admin');
        localStorage.removeItem('paymojosari_admin_pass'); // Keamanan: Jangan simpan password di localStorage!
        localStorage.removeItem('paymojosari_logged_santri_id');
        state.userRole = 'admin';
        state.isAdmin = true;
        state.loggedSantriId = null;
        closeAdminLoginModal();
        updateRoleUI();
        renderAll();
        showToast('Masuk Bendahara', 'emerald');
        return;
      } else {
        if (errEl) {
          errEl.textContent = json.message || 'Sandi salah';
          errEl.classList.remove('hidden');
        }
        showToast('Sandi salah', 'rose');
        return;
      }
    } catch (err) {
      console.warn('Mode offline/file aktif:', err);
    }
  }

  // Fallback offline bila membuka via file:///
  if (enteredPass && enteredPass.length >= 4) {
    localStorage.setItem('paymojosari_role', 'admin');
    localStorage.removeItem('paymojosari_logged_santri_id');
    state.userRole = 'admin';
    state.isAdmin = true;
    state.loggedSantriId = null;
    closeAdminLoginModal();
    updateRoleUI();
    renderAll();
    showToast('Masuk Bendahara', 'emerald');
  } else {
    if (errEl) {
      errEl.textContent = 'Sandi salah';
      errEl.classList.remove('hidden');
    }
    showToast('Sandi salah', 'rose');
  }
}

async function continueAsGuest() {
  if (window.location.protocol !== 'file:') {
    try {
      await fetch('api.php?action=logout', { method: 'POST', credentials: 'same-origin' });
    } catch (e) {}
  }
  sessionStorage.removeItem('paymojosari_auth_token');
  localStorage.removeItem('paymojosari_auth_token');
  localStorage.setItem('paymojosari_role', 'guest');
  localStorage.removeItem('paymojosari_logged_santri_id');
  localStorage.removeItem('paymojosari_admin_pass');
  localStorage.removeItem('paymojosari_custom_admin_pass');
  state.userRole = 'guest';
  state.isAdmin = false;
  state.loggedSantriId = null;
  closeAdminLoginModal();
  if (state.activeTab === 'tunggakan' || state.activeTab === 'utang') {
    switchTab('dashboard');
  } else {
    updateRoleUI();
    renderAll();
  }
  showToast('Mode Tamu', 'slate');
}

function logoutAdmin() {
  const roleLabel = state.userRole === 'admin' ? 'Bendahara' : 'Santri';
  if (!confirm(`Keluar ke Mode Tamu?`)) return;
  continueAsGuest();
}

function updateRoleUI() {
  renderLoginModalSantriPicker();

  const loggedSantri = state.userRole === 'santri'
    ? (state.santri.find(s => s.id === state.loggedSantriId) || state.santri[0])
    : null;
  const loggedIdx = loggedSantri ? state.santri.findIndex(s => s.id === loggedSantri.id) : 0;

  // 0. Top Profile Unified
  const desk = document.getElementById('adminRoleIndicatorDesktop');
  if (desk) {
    if (state.userRole === 'admin') {
      desk.innerHTML = `
        <div class="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs select-none">
          <div class="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 shrink-0">
            <img src="logo-mojosari.png?v=2" alt="Bendahara" class="w-full h-full object-contain" />
          </div>
          <div class="leading-tight text-left">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-900">Bendahara</span>
              <span class="text-[9px] font-bold text-[#005B52] bg-[#DDF1E5] px-1.5 py-0.5 rounded-full">Admin</span>
            </div>
            <span class="text-[10px] text-slate-400 font-medium block">PP. Mojosari Tuban</span>
          </div>
          <div class="flex items-center gap-1 ml-1.5 pl-2 border-l border-slate-200 text-slate-400">
            <button onclick="openResetAdminPasswordForm()" title="Ubah Sandi" class="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer">
              <i data-lucide="key" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="logoutAdmin()" title="Keluar Mode Admin" class="p-1 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer">
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    } else if (state.userRole === 'santri' && loggedSantri) {
      desk.innerHTML = `
        <div class="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs select-none">
          <img src="${getSantriAvatar(loggedSantri, loggedIdx)}" alt="${loggedSantri.nama}" class="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0" />
          <div class="leading-tight text-left max-w-[130px]">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-900 truncate">${loggedSantri.shortName || loggedSantri.nama.split(' ')[0]}</span>
              <span class="text-[9px] font-bold text-[#005B52] bg-[#DDF1E5] px-1.5 py-0.5 rounded-full">Santri</span>
            </div>
            <span class="text-[10px] text-slate-400 font-medium block truncate">${loggedSantri.prodi}</span>
          </div>
          <div class="flex items-center gap-1 ml-1.5 pl-2 border-l border-slate-200 text-slate-400">
            <button onclick="openResetSantriPasswordForm()" title="Ubah Sandi" class="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer">
              <i data-lucide="key" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="logoutAdmin()" title="Keluar Akun" class="p-1 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer">
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      desk.innerHTML = `
        <button onclick="openAdminLoginModal('santri')" class="flex items-center gap-2 bg-[#005B52] hover:bg-[#004740] text-white rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer shadow-2xs select-none">
          <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
          <span>Masuk Akun</span>
        </button>
      `;
    }
  }

  // 2. Mobile Role Indicator
  const mob = document.getElementById('adminRoleIndicatorMobile');
  if (mob) {
    if (state.userRole === 'admin') {
      mob.innerHTML = `
        <button onclick="openAdminLoginModal('santri')" class="px-2.5 py-1 bg-white text-slate-800 text-[10px] font-bold rounded-full border border-slate-200 cursor-pointer flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#005B52]"></span>
          <span>Bendahara</span>
        </button>
      `;
    } else if (state.userRole === 'santri' && loggedSantri) {
      mob.innerHTML = `
        <button onclick="openAdminLoginModal('santri')" class="px-2.5 py-1 bg-white text-slate-800 text-[10px] font-bold rounded-full border border-slate-200 cursor-pointer flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#005B52]"></span>
          <span class="max-w-[65px] truncate">${loggedSantri.shortName || loggedSantri.nama.split(' ')[0]}</span>
        </button>
      `;
    } else {
      mob.innerHTML = `
        <button onclick="openAdminLoginModal('santri')" class="px-2.5 py-1 bg-[#005B52] hover:bg-[#004740] text-white text-[10px] font-bold rounded-full cursor-pointer flex items-center gap-1 shadow-2xs">
          <i data-lucide="log-in" class="w-3 h-3"></i>
          <span>Masuk</span>
        </button>
      `;
    }
  }

  // 3. Mobile Drawer Role Indicator
  const drawer = document.getElementById('adminRoleIndicatorDrawer');
  if (drawer) {
    if (state.userRole === 'admin') {
      drawer.innerHTML = `
        <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full bg-[#064e3b] animate-pulse shrink-0"></span>
            <div class="min-w-0">
              <span class="text-xs font-bold block truncate leading-tight">Bendahara</span>
              <span class="text-[10px] text-emerald-700 font-semibold block">Admin</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="toggleMobileDrawer(false); openAdminLoginModal('santri');" class="px-2 py-1 rounded-lg bg-white text-slate-800 text-[10px] font-bold border border-emerald-200 cursor-pointer">Santri</button>
            <button onclick="toggleMobileDrawer(false); openResetAdminPasswordForm();" class="px-2 py-1 rounded-lg bg-white text-emerald-900 text-[10px] font-bold border border-emerald-200 cursor-pointer">Sandi</button>
            <button onclick="logoutAdmin()" class="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold hover:bg-rose-100 border border-rose-200 cursor-pointer">Keluar</button>
          </div>
        </div>
      `;
    } else if (state.userRole === 'santri' && loggedSantri) {
      drawer.innerHTML = `
        <div class="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-slate-900 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <img src="${getSantriAvatar(loggedSantri, loggedIdx)}" class="w-8 h-8 rounded-full object-cover border border-emerald-600 shrink-0" />
            <div class="min-w-0">
              <span class="text-xs font-bold block truncate">${loggedSantri.nama}</span>
              <span class="text-[10px] text-emerald-700 font-semibold block">Santri</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="toggleMobileDrawer(false); openResetSantriPasswordForm();" class="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 cursor-pointer">Sandi</button>
            <button onclick="logoutAdmin()" class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-bold cursor-pointer">Keluar</button>
          </div>
        </div>
      `;
    } else {
      drawer.innerHTML = `
        <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="user" class="w-4 h-4 text-slate-500"></i>
            <div>
              <span class="text-xs font-bold text-slate-800 block leading-tight">Mode Tamu</span>
              <span class="text-[10px] text-slate-500">Akses publik</span>
            </div>
          </div>
          <button onclick="toggleMobileDrawer(false); openAdminLoginModal('santri');" class="px-3 py-1.5 rounded-xl bg-[#064e3b] text-white text-[10px] font-bold hover:bg-[#065f46] shadow-2xs cursor-pointer">Masuk</button>
        </div>
      `;
    }
  }

  // 4. Quick Payment Card Controls (Admin vs Santri Pribadi vs Tamu)
  const qNotice = document.getElementById('quickPaymentSantriNotice');
  const qAdmin = document.getElementById('quickPaymentAdminSection');
  const qBadge = document.getElementById('quickPaymentRoleBadge');
  const qHint = document.getElementById('quickPaymentSubHint');

  if (state.userRole === 'admin') {
    if (qNotice) qNotice.classList.add('hidden');
    if (qAdmin) qAdmin.classList.remove('hidden');
    if (qBadge) {
      qBadge.textContent = 'Admin';
      qBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200';
    }
    if (qHint) qHint.textContent = 'Pilih santri';
  } else if (state.userRole === 'santri' && loggedSantri) {
    if (qAdmin) qAdmin.classList.add('hidden');
    if (qNotice) {
      qNotice.classList.remove('hidden');
      const rec = getPaymentRecord(loggedSantri.id, state.activeMonth);
      const sum = calculateRecordSummary(rec, state.activeMonth, loggedSantri);
      const nis = getNomorIndukSantri(loggedSantri, loggedIdx);
      const danaNum = state.nomorDanaBendahara || NOMOR_DANA_DEFAULT;
      const myProof = (state.konfirmasiBayar || []).find(kb => kb.santriId === loggedSantri.id && kb.periode === state.activeMonth);
      const myProofBanner = myProof
        ? `<div class="p-2.5 rounded-xl border ${myProof.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : myProof.status === 'rejected' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-900'} flex items-center justify-between gap-2 text-[11px]">
             <div class="flex items-center gap-2 min-w-0">
               <span class="font-bold truncate">${myProof.status === 'approved' ? '✓ Bukti Transfer Diverifikasi Bendahara' : myProof.status === 'rejected' ? '✗ Bukti Transfer Ditolak (Silakan upload ulang)' : '⏳ Bukti Transfer Menunggu Verifikasi Bendahara'}</span>
             </div>
             <button type="button" onclick="openPreviewBuktiBayarModal('${myProof.id}')" class="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700 shrink-0 cursor-pointer">Lihat Foto</button>
           </div>`
        : '';

      qNotice.className = 'p-5 rounded-xl bg-[#f8fafc] border border-slate-200/80 text-slate-900 space-y-4';
      qNotice.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
          <div class="flex items-center gap-3">
            <img src="${getSantriAvatar(loggedSantri, loggedIdx)}" class="w-12 h-12 rounded-full object-cover ring-2 ring-[#064e3b] ring-offset-2 bg-white" />
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="text-sm font-extrabold text-slate-900 font-display">${loggedSantri.nama}</h4>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${sum.isFullLunas ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
                  ${sum.isFullLunas ? '✓ Lunas' : `Kurang ${formatRp(sum.totalUnpaid)}`}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 font-mono mt-0.5">${nis} • ${loggedSantri.prodi}</p>
            </div>
          </div>
          <div class="text-left sm:text-right">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">${getMonthLabel(state.activeMonth)}</span>
            <span class="text-lg font-extrabold font-display text-[#064e3b]">${formatRp(sum.totalPaid)} <span class="text-xs font-normal text-slate-400">/ ${formatRp(sum.targetSantri)}</span></span>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="p-2.5 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between">
            <span class="text-slate-500 font-medium">Makan</span>
            <span class="font-bold ${sum.tanpaMakan ? 'text-slate-400' : (rec.makan ? 'text-emerald-700' : 'text-rose-600')}">${sum.tanpaMakan ? 'Bebas' : (rec.makan ? '✓ Lunas' : 'Belum')}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between">
            <span class="text-slate-500 font-medium">WiFi</span>
            <span class="font-bold ${rec.wifi ? 'text-emerald-700' : 'text-rose-600'}">${rec.wifi ? '✓ Lunas' : 'Belum'}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between">
            <span class="text-slate-500 font-medium">Listrik</span>
            <span class="font-bold ${rec.listrik ? 'text-emerald-700' : 'text-rose-600'}">${rec.listrik ? '✓ Lunas' : 'Belum'}</span>
          </div>
          <div class="p-2.5 rounded-xl bg-white border border-slate-200/70 flex items-center justify-between">
            <span class="text-slate-500 font-medium">Air</span>
            <span class="font-bold ${rec.air ? 'text-emerald-700' : 'text-rose-600'}">${rec.air ? '✓ Lunas' : 'Belum'}</span>
          </div>
        </div>

        <!-- Info Pembayaran Transfer DANA -->
        <div class="p-3 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2.5">
            <span class="px-2 py-1 rounded-lg bg-[#008CEB] text-white text-[10px] font-extrabold tracking-wide">DANA</span>
            <div>
              <span class="text-xs font-extrabold font-mono text-slate-900">${danaNum}</span>
              <span class="text-[10px] text-slate-400 block">Transfer Syahriyah & Kas (Bendahara Komplek)</span>
            </div>
          </div>
          <button type="button" onclick="copyDanaNumber()" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] text-[11px] font-bold transition cursor-pointer flex items-center gap-1">
            <i data-lucide="copy" class="w-3 h-3"></i>
            <span>Salin Nomor</span>
          </button>
        </div>

        ${myProofBanner}

        <div class="flex items-center justify-end gap-2 flex-wrap pt-1">
          <button type="button" onclick="openUploadBuktiSantriModal('${loggedSantri.id}', '${state.activeMonth}')" class="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i>
            <span>Upload Bukti Transfer</span>
          </button>
          <button type="button" onclick="openWaKonfirmasiKeBendahara('${loggedSantri.id}', '${state.activeMonth}')" class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5">
            <i data-lucide="message-circle" class="w-3.5 h-3.5 text-[#064e3b]"></i>
            <span>Konfirmasi WA</span>
          </button>
          <button type="button" onclick="openKartuSantriModal('${loggedSantri.id}')" class="px-3.5 py-2 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5">
            <i data-lucide="id-card" class="w-3.5 h-3.5"></i>
            <span>Kartu KTA</span>
          </button>
        </div>
      `;
    }
    if (qBadge) {
      qBadge.textContent = 'Santri';
      qBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200';
    }
    if (qHint) qHint.textContent = loggedSantri.nama;
  } else {
    if (qAdmin) qAdmin.classList.add('hidden');
    if (qNotice) {
      qNotice.classList.remove('hidden');
      qNotice.className = 'p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 text-slate-800 space-y-3';
      qNotice.innerHTML = `
        <div class="flex items-center gap-2.5 text-sm font-bold text-slate-900">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#064e3b] flex items-center justify-center shrink-0">
            <i data-lucide="lock" class="w-4 h-4"></i>
          </div>
          <span>Akses Data Pribadi</span>
        </div>
        <p class="text-xs text-slate-500">
          Masuk akun untuk melihat tagihan, riwayat bayar, dan Kartu Identitas Santri.
        </p>
        <div class="pt-1 flex items-center gap-2 flex-wrap">
          <button type="button" onclick="openAdminLoginModal('santri')" class="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
            <span>Masuk Santri</span>
          </button>
          <button type="button" onclick="openAdminLoginModal('admin')" class="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-slate-500"></i>
            <span>Bendahara</span>
          </button>
        </div>
      `;
    }
    if (qBadge) {
      qBadge.textContent = 'Tamu';
      qBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600';
    }
    if (qHint) qHint.textContent = 'Akses Publik';
  }

  // 5. Kas Masak & Kas Umum: Khusus Bendahara (Santri tidak dapat mencatat pengeluaran)
  const bendaharaForms = ['formMasak', 'formKasUmum'];
  bendaharaForms.forEach(fId => {
    const formEl = document.getElementById(fId);
    if (!formEl) return;
    const cardEl = formEl.closest('div.bg-white');
    if (cardEl) {
      if (state.isAdmin) {
        cardEl.classList.remove('opacity-60');
      } else {
        cardEl.classList.add('opacity-60');
      }
    }
    formEl.querySelectorAll('input, select, textarea, button[type="submit"]').forEach(inp => {
      inp.disabled = !state.isAdmin;
    });
  });

  const masakNotice = document.getElementById('masakAdminNotice');
  if (masakNotice) {
    if (state.isAdmin) masakNotice.classList.add('hidden');
    else masakNotice.classList.remove('hidden');
  }
  const kasUmumNotice = document.getElementById('kasUmumAdminNotice');
  if (kasUmumNotice) {
    if (state.isAdmin) kasUmumNotice.classList.add('hidden');
    else kasUmumNotice.classList.remove('hidden');
  }

  // 6. Form Santri: Santri BISA mengedit foto profil sendiri, namun data identitas/prodi dikunci khusus Bendahara
  const formSantriEl = document.getElementById('formSantri');
  if (formSantriEl) {
    const cardSantriEl = formSantriEl.closest('div.bg-white');
    const titleSantri = document.getElementById('formSantriTitle');
    const btnSaveText = document.getElementById('btnSaveSantriText');
    const cancelBtn = document.getElementById('btnCancelEditSantri');
    const santriNotice = document.getElementById('santriAdminNotice');

    if (state.isAdmin) {
      if (cardSantriEl) cardSantriEl.classList.remove('opacity-60');
      formSantriEl.querySelectorAll('input, select, textarea, button').forEach(inp => {
        inp.disabled = false;
      });
      if (santriNotice) {
        santriNotice.classList.add('hidden');
        santriNotice.innerHTML = '';
      }
      const editIdInp = document.getElementById('editSantriId');
      if (titleSantri) titleSantri.textContent = editIdInp && editIdInp.value ? 'Edit Data Santri' : 'Tambah Santri';
      if (btnSaveText) btnSaveText.textContent = editIdInp && editIdInp.value ? 'Simpan Perubahan' : 'Simpan Santri';
      if (cancelBtn && editIdInp && editIdInp.value) cancelBtn.classList.remove('hidden');
    } else if (state.userRole === 'santri' && loggedSantri) {
      if (cardSantriEl) cardSantriEl.classList.remove('opacity-60');
      // Kunci prodi, nama, alamat, no WA agar tidak dapat diubah oleh santri
      formSantriEl.querySelectorAll('input, select, textarea').forEach(inp => {
        if (inp.id === 'santriPhotoFile') {
          inp.disabled = false;
        } else {
          inp.disabled = true;
        }
      });
      // Tombol submit, upload, avatar, dan reset foto tetap aktif untuk santri
      formSantriEl.querySelectorAll('button').forEach(btn => {
        btn.disabled = false;
      });

      if (santriNotice) {
        santriNotice.classList.remove('hidden');
        santriNotice.className = 'p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs leading-relaxed';
        santriNotice.innerHTML = '<strong>📸 Ganti Pas Foto Profil:</strong> Anda dapat mengunggah atau mengganti pas foto (3:4) profil akun Anda sendiri di bawah. Data Nama, Alamat, dan Program Studi santri hanya dapat diubah oleh Bendahara Komplek.';
      }
      if (titleSantri) titleSantri.textContent = 'Ganti Foto Profil — ' + loggedSantri.nama;
      if (btnSaveText) btnSaveText.textContent = 'Simpan Foto Profil';
      if (cancelBtn) cancelBtn.classList.add('hidden');

      const editIdInp = document.getElementById('editSantriId');
      if (editIdInp && editIdInp.value !== loggedSantri.id) {
        populateSantriFormForSelf(loggedSantri);
      }
    } else {
      // Tamu / Belum Login
      if (cardSantriEl) cardSantriEl.classList.add('opacity-60');
      formSantriEl.querySelectorAll('input, select, textarea, button').forEach(inp => {
        inp.disabled = true;
      });
      if (santriNotice) {
        santriNotice.classList.remove('hidden');
        santriNotice.className = 'p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed';
        santriNotice.innerHTML = '🔒 <strong>Akses Khusus Bendahara:</strong> Data profil dan Program Studi santri hanya dapat diubah oleh Bendahara Komplek.';
      }
      if (titleSantri) titleSantri.textContent = 'Data Profil Santri';
      if (btnSaveText) btnSaveText.textContent = 'Khusus Bendahara';
      if (cancelBtn) cancelBtn.classList.add('hidden');
    }
  }

  // 7. Form Utang Kas: Santri BISA mengajukan pinjaman, Bendahara mencatat & menyetujui pencairan
  const formUtangEl = document.getElementById('formUtangKas');
  if (formUtangEl) {
    const cardUtangEl = formUtangEl.closest('div.bg-white');
    const titleUtang = document.getElementById('formUtangTitle');
    const btnSubmitUtangText = document.getElementById('btnSubmitUtangText');
    const noticeUtang = document.getElementById('utangNoticeContainer');
    const selSantri = document.getElementById('utangSantriId');

    if (state.isAdmin) {
      if (cardUtangEl) cardUtangEl.classList.remove('opacity-60');
      if (titleUtang) titleUtang.textContent = 'Catat Pinjaman Kas (Bendahara)';
      if (btnSubmitUtangText) btnSubmitUtangText.textContent = 'Simpan & Cairkan Langsung';
      if (noticeUtang) {
        noticeUtang.classList.add('hidden');
        noticeUtang.innerHTML = '';
      }
      formUtangEl.querySelectorAll('input, select, textarea, button[type="submit"]').forEach(inp => {
        inp.disabled = false;
      });
    } else if (state.userRole === 'santri' && loggedSantri) {
      if (cardUtangEl) cardUtangEl.classList.remove('opacity-60');
      if (titleUtang) titleUtang.textContent = 'Ajukan Pinjaman Kas';
      if (btnSubmitUtangText) btnSubmitUtangText.textContent = 'Ajukan Pinjaman & Hubungi WA Bendahara';
      if (noticeUtang) {
        noticeUtang.classList.remove('hidden');
        noticeUtang.innerHTML = `
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs space-y-1">
            <p class="font-bold">💡 Alur Pengajuan Pinjaman:</p>
            <p>1. Isi nominal dan keperluan Anda pada formulir di bawah.</p>
            <p>2. Saat formulir dikirim, Anda akan diarahkan ke WhatsApp Bendahara untuk konfirmasi persetujuan.</p>
            <p>3. Status pinjaman akan tercatat <em>Menunggu Persetujuan</em>. Dana kas baru akan <strong>cair</strong> setelah disetujui oleh Bendahara Komplek.</p>
          </div>
        `;
      }
      formUtangEl.querySelectorAll('input, textarea, button[type="submit"]').forEach(inp => {
        inp.disabled = false;
      });
      if (selSantri) {
        selSantri.value = loggedSantri.id;
        selSantri.disabled = true; // santri terkunci hanya untuk dirinya sendiri
      }
    } else {
      // Tamu / Belum Login
      if (cardUtangEl) cardUtangEl.classList.add('opacity-60');
      if (titleUtang) titleUtang.textContent = 'Ajukan Pinjaman Kas';
      if (btnSubmitUtangText) btnSubmitUtangText.textContent = 'Masuk Santri untuk Mengajukan';
      if (noticeUtang) {
        noticeUtang.classList.remove('hidden');
        noticeUtang.innerHTML = `
          <div class="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs">
            Silakan login dengan akun santri Anda untuk mengajukan pinjaman kas.
          </div>
        `;
      }
      formUtangEl.querySelectorAll('input, select, textarea, button[type="submit"]').forEach(inp => {
        inp.disabled = true;
      });
    }
  }

  // Sembunyikan tombol Reset, Upload Bukti, Export LPJ, dan Siaran Grup WA bagi selain Admin (Bendahara)
  document.querySelectorAll('[onclick*="resetBulanIni"], [onclick*="resetSemuaKeNol"], [onclick*="openBendaharaWifiModal"], [onclick*="ubahTarifWifiManual"], [onclick*="deleteMasakLog"], [onclick*="deleteKasUmumLog"], [onclick*="openRekapGrupModal"], [onclick*="openRekapGrupForMonth"], [onclick*="exportLpjExcel"], [onclick*="openModalLpjResmi"]').forEach(el => {
    if (state.isAdmin) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

function loadState() {
  try {
    localStorage.removeItem('SIMKAS_MOJOSARI_FINPILOT_V7');
    localStorage.removeItem('SIMKAS_MOJOSARI_FINPILOT_V8');
    localStorage.removeItem('SIMKAS_MOJOSARI_FINPILOT_V9');
    localStorage.removeItem('SIMKAS_MOJOSARI_FINPILOT_V10');
    localStorage.removeItem('SIMKAS_MOJOSARI_FINPILOT_V11');
    localStorage.removeItem('SIMKAS_MOJOSARI_FINPILOT_V12');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      if (Array.isArray(state.santri)) {
        state.santri.forEach(s => {
          if (s.avatar && !s.avatar.startsWith('data:image/')) {
            s.avatar = '';
          }
        });
      }
    } else {
      state = getInitialDemoState();
      saveState(true);
    }
    let savedRole = localStorage.getItem('paymojosari_role') || 'guest';
    const authToken = getAuthToken();
    if (savedRole === 'admin' && !authToken) {
      savedRole = 'guest';
      localStorage.setItem('paymojosari_role', 'guest');
    }
    const savedSantriId = localStorage.getItem('paymojosari_logged_santri_id') || null;
    state.userRole = ['admin', 'santri', 'guest'].includes(savedRole) ? savedRole : 'guest';
    state.isAdmin = state.userRole === 'admin';
    state.loggedSantriId = state.userRole === 'santri' ? savedSantriId : null;

    purgeOldMonthsFromState();
    if (state.userRole === 'santri' && state.loggedSantriId) {
      state.selectedSantriId = state.loggedSantriId;
    } else if (!state.selectedSantriId && state.santri.length > 0) {
      state.selectedSantriId = state.santri[0].id;
    }
  } catch (e) {
    console.error('Gagal memuat state:', e);
    state = getInitialDemoState();
    state.userRole = 'guest';
    state.isAdmin = false;
    state.loggedSantriId = null;
  }
  syncFromBackend();
}

async function syncFromBackend() {
  if (window.location.protocol === 'file:') return;
  try {
    // 1. Verifikasi status sesi resmi dari server backend
    try {
      const sessRes = await fetch('api.php?action=check_session', { credentials: 'same-origin' });
      if (sessRes.ok) {
        const sessJson = await sessRes.json();
        if (sessJson && sessJson.status === 'success') {
          if (sessJson.role === 'admin') {
            state.userRole = 'admin';
            state.isAdmin = true;
            state.loggedSantriId = null;
            if (sessJson.token) {
              sessionStorage.setItem('paymojosari_auth_token', sessJson.token);
              localStorage.setItem('paymojosari_auth_token', sessJson.token);
            }
          } else if (sessJson.role === 'santri') {
            state.userRole = 'santri';
            state.isAdmin = false;
            state.loggedSantriId = sessJson.santri_id;
            if (sessJson.token) {
              sessionStorage.setItem('paymojosari_auth_token', sessJson.token);
              localStorage.setItem('paymojosari_auth_token', sessJson.token);
            }
          } else {
            if (state.userRole === 'admin') {
              state.userRole = 'guest';
              state.isAdmin = false;
              sessionStorage.removeItem('paymojosari_auth_token');
              localStorage.removeItem('paymojosari_auth_token');
              localStorage.setItem('paymojosari_role', 'guest');
            }
          }
          updateRoleUI();
        }
      }
    } catch (e) {
      console.warn('Cek sesi server dilewati:', e);
    }

    // 2. Ambil data state terenkripsi/terfilter dari backend
    const res = await fetch('api.php?action=get_all', { credentials: 'same-origin' });
    if (!res.ok) return;
    const json = await res.json();
    if (json && json.status === 'success' && json.data) {
      const d = json.data;
      if (Array.isArray(d.santri)) {
        state.santri = d.santri.map(s => ({
          ...s,
          avatar: (s.avatar && s.avatar.startsWith('data:image/')) ? s.avatar : ''
        }));
      }
      if (d.tarifWifiPerBulan && Object.keys(d.tarifWifiPerBulan).length > 0) {
        state.tarifWifiPerBulan = { ...buildDefaultTarifMap(), ...d.tarifWifiPerBulan };
      }
      if (d.pembayaran !== undefined && typeof d.pembayaran === 'object') {
        state.pembayaran = Array.isArray(d.pembayaran) ? {} : d.pembayaran;
      }
      if (d.setoranWifiBendahara !== undefined && typeof d.setoranWifiBendahara === 'object') {
        if (Array.isArray(d.setoranWifiBendahara)) {
          state.setoranWifiBendahara = {};
        } else {
          Object.keys(d.setoranWifiBendahara).forEach(k => {
            const item = d.setoranWifiBendahara[k];
            const existingImg = state.setoranWifiBendahara[k]?.proofImg || '';
            const normNominal = (item.status === 'unpaid' && (!item.nominalBayar || Number(item.nominalBayar) === 340000))
              ? TAGIHAN_WIFI_INDUK_DEFAULT
              : Number(item.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT);
            state.setoranWifiBendahara[k] = {
              ...item,
              nominalBayar: normNominal,
              proofImg: item.proofImg || existingImg || createSampleWifiChatDataUrl(getMonthLabel(k), formatRp(normNominal))
            };
          });
        }
      }
      if (Array.isArray(d.masakLogs)) {
        state.masakLogs = d.masakLogs;
      }
      if (Array.isArray(d.kasUmumLogs)) {
        state.kasUmumLogs = d.kasUmumLogs;
      }
      if (Array.isArray(d.konfirmasiBayar)) {
        state.konfirmasiBayar = d.konfirmasiBayar;
      }
      if (Array.isArray(d.utangKas)) {
        state.utangKas = d.utangKas;
      }
      if (d.nomorDanaBendahara) {
        state.nomorDanaBendahara = d.nomorDanaBendahara;
      }
      if (d.linkGrupWa) {
        state.linkGrupWa = d.linkGrupWa;
      }
      purgeOldMonthsFromState();
      if (!state.selectedSantriId && state.santri.length > 0) {
        state.selectedSantriId = state.santri[0].id;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      initControls();
      renderAll();
    }
  } catch (err) {
    console.warn('Mode lokal aktif (Backend MySQL belum terjangkau):', err);
  }
}

function saveState(skipRemote = false) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!skipRemote && window.location.protocol !== 'file:' && state.isAdmin) {
    fetch('api.php?action=sync_all', {
      method: 'POST',
      credentials: 'same-origin',
      headers: getAdminHeaders(),
      body: JSON.stringify(state)
    }).catch(err => console.warn('Gagal sinkron ke MySQL:', err));
  }
}

// =========================================================================
// HELPERS & CALCULATIONS
// =========================================================================

function formatRp(num) {
  const n = Number(num) || 0;
  return 'Rp ' + n.toLocaleString('id-ID');
}

function getMonthLabel(monthKey) {
  const found = AVAILABLE_MONTHS.find(m => m.key === monthKey);
  return found ? found.label : monthKey;
}

function getPaymentRecord(santriId, monthKey) {
  const key = `${santriId}_${monthKey}`;
  if (!state.pembayaran[key]) {
    state.pembayaran[key] = {
      makan: false,
      wifi: false,
      listrik: false,
      air: false,
      updatedAt: '-'
    };
  }
  return state.pembayaran[key];
}

function getBendaharaWifiRecord(monthKey) {
  if (!state.setoranWifiBendahara[monthKey]) {
    state.setoranWifiBendahara[monthKey] = {
      status: 'unpaid',
      proofImg: '',
      proofNote: '',
      tanggalBayar: '2026-10-30',
      nominalBayar: TAGIHAN_WIFI_INDUK_DEFAULT
    };
  } else if (state.setoranWifiBendahara[monthKey].status === 'unpaid' && (!state.setoranWifiBendahara[monthKey].nominalBayar || state.setoranWifiBendahara[monthKey].nominalBayar === 340000)) {
    state.setoranWifiBendahara[monthKey].nominalBayar = TAGIHAN_WIFI_INDUK_DEFAULT;
  }
  return state.setoranWifiBendahara[monthKey];
}

function isSantriTanpaMakan(santriOrId) {
  if (!santriOrId) return false;
  if (typeof santriOrId === 'object') {
    return Boolean(santriOrId.tanpaMakan);
  }
  const s = state.santri.find(x => x.id === santriOrId);
  return s ? Boolean(s.tanpaMakan) : (santriOrId === 's1' || santriOrId === 's11');
}

function calculateRecordSummary(rec, monthKey, santriOrId = null) {
  const curTarif = getTarif(monthKey);
  const tanpaMakan = isSantriTanpaMakan(santriOrId);
  const targetMakan = tanpaMakan ? 0 : curTarif.makan;
  const targetSantri = targetMakan + curTarif.wifi + curTarif.listrik + curTarif.air;

  const paidMakan = (!tanpaMakan && rec.makan) ? curTarif.makan : 0;
  const paidWifi = rec.wifi ? curTarif.wifi : 0;
  const paidListrik = rec.listrik ? curTarif.listrik : 0;
  const paidAir = rec.air ? curTarif.air : 0;

  const totalPaid = paidMakan + paidWifi + paidListrik + paidAir;
  const totalUnpaid = Math.max(0, targetSantri - totalPaid);
  const isFullLunas = totalPaid >= targetSantri && (tanpaMakan || rec.makan) && rec.wifi && rec.listrik && rec.air;

  const unpaidItems = [];
  if (!tanpaMakan && !rec.makan) unpaidItems.push({ nama: 'Uang Makan', nominal: curTarif.makan });
  if (!rec.wifi) unpaidItems.push({ nama: `Kas WiFi (${formatRp(curTarif.wifi)})`, nominal: curTarif.wifi });
  if (!rec.listrik) unpaidItems.push({ nama: 'Kas Listrik', nominal: curTarif.listrik });
  if (!rec.air) unpaidItems.push({ nama: 'Kas Air', nominal: curTarif.air });

  const paidItems = [];
  if (!tanpaMakan && rec.makan) paidItems.push({ nama: 'Uang Makan', nominal: curTarif.makan });
  if (rec.wifi) paidItems.push({ nama: `Kas WiFi (${formatRp(curTarif.wifi)})`, nominal: curTarif.wifi });
  if (rec.listrik) paidItems.push({ nama: 'Kas Listrik', nominal: curTarif.listrik });
  if (rec.air) paidItems.push({ nama: 'Kas Air', nominal: curTarif.air });

  return {
    paidMakan,
    paidWifi,
    paidListrik,
    paidAir,
    totalPaid,
    totalUnpaid,
    targetSantri,
    tanpaMakan,
    isFullLunas,
    unpaidItems,
    paidItems,
    currentTarif: curTarif
  };
}

function calculateGlobalFinancials() {
  let allTimeMakanCollected = 0;
  let allTimeWifiCollected = 0;
  let allTimeListrikCollected = 0;
  let allTimeAirCollected = 0;

  let activeMonthMakan = 0;
  let activeMonthWifi = 0;
  let activeMonthListrik = 0;
  let activeMonthAir = 0;
  let activeMonthWifiSantriCount = 0;

  Object.keys(state.pembayaran).forEach(k => {
    const [sId, mKey] = k.split('_');
    if (!mKey || mKey < START_MONTH_KEY) return;
    const rec = state.pembayaran[k];
    const sum = calculateRecordSummary(rec, mKey, sId);

    allTimeMakanCollected += sum.paidMakan;
    allTimeWifiCollected += sum.paidWifi;
    allTimeListrikCollected += sum.paidListrik;
    allTimeAirCollected += sum.paidAir;

    if (mKey === state.activeMonth) {
      activeMonthMakan += sum.paidMakan;
      activeMonthWifi += sum.paidWifi;
      activeMonthListrik += sum.paidListrik;
      activeMonthAir += sum.paidAir;
      if (rec.wifi) activeMonthWifiSantriCount++;
    }
  });

  const totalKasCollectedAllTime = allTimeWifiCollected + allTimeListrikCollected + allTimeAirCollected;

  // Hitung total setoran WiFi Induk (Rp 200.000/bln) yang sudah dibayarkan oleh Bendahara; sisa uang WiFi otomatis tersimpan di Saldo Kas Komplek
  let totalSetoranWifiIndukPaid = 0;
  Object.keys(state.setoranWifiBendahara || {}).forEach(mKey => {
    if (!mKey || mKey < START_MONTH_KEY) return;
    const wRec = state.setoranWifiBendahara[mKey];
    if (wRec && wRec.status === 'paid') {
      totalSetoranWifiIndukPaid += Number(wRec.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT);
    }
  });

  const pemasukanKasUmumLain = (state.kasUmumLogs || [])
    .filter(k => k.tipe === 'pemasukan')
    .reduce((acc, k) => acc + Number(k.nominal), 0);
  const pengeluaranKasUmum = (state.kasUmumLogs || [])
    .filter(k => k.tipe === 'pengeluaran')
    .reduce((acc, k) => acc + Number(k.nominal), 0);

  const totalUtangAktif = state.utangKas
    .filter(u => u.status === 'belum_lunas')
    .reduce((acc, u) => acc + Number(u.nominal), 0);

  const totalUtangLunas = state.utangKas
    .filter(u => u.status === 'lunas')
    .reduce((acc, u) => acc + Number(u.nominal), 0);

  const saldoKasTersedia = totalKasCollectedAllTime + pemasukanKasUmumLain - totalSetoranWifiIndukPaid - pengeluaranKasUmum - totalUtangAktif;

  const pemasukanMasakLain = state.masakLogs
    .filter(m => m.tipe === 'pemasukan')
    .reduce((acc, m) => acc + Number(m.nominal), 0);
  const pengeluaranMasak = state.masakLogs
    .filter(m => m.tipe === 'pengeluaran')
    .reduce((acc, m) => acc + Number(m.nominal), 0);

  const totalDanaMakanMasuk = allTimeMakanCollected + pemasukanMasakLain;
  const saldoMasakTersedia = totalDanaMakanMasuk - pengeluaranMasak;

  const monthsToCheck = [state.activeMonth];

  let totalTunggakanBulanan = 0;
  let santriWithArrearsCount = 0;

  state.santri.forEach(s => {
    let sArrears = 0;
    monthsToCheck.forEach(mKey => {
      const rec = getPaymentRecord(s.id, mKey);
      const sum = calculateRecordSummary(rec, mKey, s);
      sArrears += sum.totalUnpaid;
    });
    const sUtang = state.utangKas
      .filter(u => u.santriId === s.id && u.status === 'belum_lunas')
      .reduce((acc, u) => acc + Number(u.nominal), 0);

    totalTunggakanBulanan += sArrears;
    if (sArrears > 0 || sUtang > 0) {
      santriWithArrearsCount++;
    }
  });

  const activeTarif = getTarif(state.activeMonth);
  const activeMonthTotalSent = activeMonthMakan + activeMonthWifi + activeMonthListrik + activeMonthAir;
  const activeMonthTarget = state.santri.reduce((acc, s) => {
    return acc + (isSantriTanpaMakan(s) ? activeTarif.totalKas : activeTarif.totalBulanan);
  }, 0);
  const activeMonthTunggakan = Math.max(0, activeMonthTarget - activeMonthTotalSent);

  return {
    allTimeMakanCollected,
    allTimeWifiCollected,
    allTimeListrikCollected,
    allTimeAirCollected,
    activeMonthMakan,
    activeMonthWifi,
    activeMonthListrik,
    activeMonthAir,
    activeMonthWifiSantriCount,
    activeMonthTotalSent,
    activeMonthTarget,
    activeMonthTunggakan,
    totalKasCollectedAllTime,
    totalSetoranWifiIndukPaid,
    pemasukanKasUmumLain,
    pengeluaranKasUmum,
    totalUtangAktif,
    totalUtangLunas,
    saldoKasTersedia,
    pemasukanMasakLain,
    pengeluaranMasak,
    totalDanaMakanMasuk,
    saldoMasakTersedia,
    totalTunggakanBulanan,
    grandTotalTunggakanDanUtang: totalTunggakanBulanan + totalUtangAktif,
    santriWithArrearsCount,
    monthsToCheck
  };
}

// =========================================================================
// ARUS KAS & SALDO BERGULIR ANTAR-BULAN (ROLL-FORWARD CASH FLOW)
// =========================================================================

function getMonthlyCashFlowRollForward() {
  const result = [];
  let prevRoll = null;

  AVAILABLE_MONTHS.forEach(m => {
    const mKey = m.key;

    // 1. Saldo Awal (Bawaan sisa dari bulan sebelumnya)
    const saldoAwalMakan = prevRoll ? prevRoll.saldoAkhirMakan : 0;
    const saldoAwalKasUmum = prevRoll ? prevRoll.saldoAkhirKasUmum : 0;
    const saldoAwalTotal = saldoAwalMakan + saldoAwalKasUmum;

    // 2. Iuran Santri yang terkumpul untuk periode ini
    let iuranMakanMasuk = 0;
    let iuranKasMasuk = 0;
    let santriLunasCount = 0;

    state.santri.forEach(s => {
      const rec = getPaymentRecord(s.id, mKey);
      const sum = calculateRecordSummary(rec, mKey, s);
      iuranMakanMasuk += sum.paidMakan;
      iuranKasMasuk += (sum.paidWifi + sum.paidListrik + sum.paidAir);
      if (sum.isFullLunas) santriLunasCount++;
    });

    // Pemasukan Masak Lain (Donasi dll)
    const pemasukanMasakLain = (state.masakLogs || [])
      .filter(x => x.tipe === 'pemasukan' && x.tanggal && x.tanggal.startsWith(mKey))
      .reduce((acc, x) => acc + Number(x.nominal || 0), 0);

    const totalMasukMakan = iuranMakanMasuk + pemasukanMasakLain;

    // Pengeluaran Belanja Masak
    const pengeluaranMasak = (state.masakLogs || [])
      .filter(x => x.tipe === 'pengeluaran' && x.tanggal && x.tanggal.startsWith(mKey))
      .reduce((acc, x) => acc + Number(x.nominal || 0), 0);

    // Pemasukan Kas Umum Lain
    const pemasukanKasUmumLain = (state.kasUmumLogs || [])
      .filter(x => x.tipe === 'pemasukan' && x.tanggal && x.tanggal.startsWith(mKey))
      .reduce((acc, x) => acc + Number(x.nominal || 0), 0);

    const totalMasukKasUmum = iuranKasMasuk + pemasukanKasUmumLain;

    // Pengeluaran Kas Umum
    const pengeluaranKasUmum = (state.kasUmumLogs || [])
      .filter(x => x.tipe === 'pengeluaran' && x.tanggal && x.tanggal.startsWith(mKey))
      .reduce((acc, x) => acc + Number(x.nominal || 0), 0);

    // Setoran WiFi Induk
    const wRec = (state.setoranWifiBendahara || {})[mKey];
    const setoranWifiInduk = (wRec && wRec.status === 'paid')
      ? Number(wRec.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT)
      : 0;

    // Dampak Utang Kas
    const utangKasBaru = (state.utangKas || [])
      .filter(u => u.tanggal && u.tanggal.startsWith(mKey))
      .reduce((acc, u) => acc + Number(u.nominal || 0), 0);

    const utangKasDilunasi = (state.utangKas || [])
      .filter(u => u.status === 'lunas' && ((u.tglLunas && u.tglLunas.startsWith(mKey)) || (!u.tglLunas && u.tanggal && u.tanggal.startsWith(mKey))))
      .reduce((acc, u) => acc + Number(u.nominal || 0), 0);

    const dampakUtangKas = utangKasBaru - utangKasDilunasi;

    // 3. Saldo Akhir (Kas Riil di Akhir Bulan)
    const saldoAkhirMakan = saldoAwalMakan + totalMasukMakan - pengeluaranMasak;
    const saldoAkhirKasUmum = saldoAwalKasUmum + totalMasukKasUmum - pengeluaranKasUmum - setoranWifiInduk - dampakUtangKas;
    const saldoAkhirTotal = saldoAkhirMakan + saldoAkhirKasUmum;

    const row = {
      key: mKey,
      label: m.label,
      isCurrent: mKey === state.activeMonth,
      saldoAwalMakan,
      saldoAwalKasUmum,
      saldoAwalTotal,
      iuranMakanMasuk,
      pemasukanMasakLain,
      totalMasukMakan,
      pengeluaranMasak,
      saldoAkhirMakan,
      iuranKasMasuk,
      pemasukanKasUmumLain,
      totalMasukKasUmum,
      pengeluaranKasUmum,
      setoranWifiInduk,
      dampakUtangKas,
      saldoAkhirKasUmum,
      totalMasukBulanIni: totalMasukMakan + totalMasukKasUmum,
      totalKeluarBulanIni: pengeluaranMasak + pengeluaranKasUmum + setoranWifiInduk + dampakUtangKas,
      saldoAkhirTotal,
      santriLunasCount
    };

    result.push(row);
    prevRoll = row;
  });

  return result;
}

// =========================================================================
// UI CONTROLS & ROUTING
// =========================================================================

function toggleMobileDrawer(show) {
  const drawer = document.getElementById('mobileDrawer');
  if (!drawer) return;
  if (show === undefined) {
    drawer.classList.toggle('hidden');
  } else if (show) {
    drawer.classList.remove('hidden');
  } else {
    drawer.classList.add('hidden');
  }
}

function initControls() {
  const select = document.getElementById('globalMonthSelect');
  const mobileSelect = document.getElementById('mobileMonthSelect');
  const monthOptions = AVAILABLE_MONTHS.map(m =>
    `<option value="${m.key}" ${m.key === state.activeMonth ? 'selected' : ''}>${m.label}</option>`
  ).join('');

  if (select) {
    select.innerHTML = monthOptions;
    select.onchange = (e) => {
      state.activeMonth = e.target.value;
      if (mobileSelect) mobileSelect.value = e.target.value;
      saveState(true);
      renderAll();
    };
  }

  if (mobileSelect) {
    mobileSelect.innerHTML = monthOptions;
    mobileSelect.onchange = (e) => {
      state.activeMonth = e.target.value;
      if (select) select.value = e.target.value;
      saveState(true);
      renderAll();
    };
  }

  const today = '2026-10-30';
  const masakDate = document.getElementById('masakTanggal');
  if (masakDate && !masakDate.value) masakDate.value = today;

  const kasUmumDate = document.getElementById('kasUmumTanggal');
  if (kasUmumDate && !kasUmumDate.value) kasUmumDate.value = today;

  const utangDate = document.getElementById('utangTanggal');
  if (utangDate && !utangDate.value) utangDate.value = today;
}

function switchTab(tabName) {
  // Jika Tamu Umum (Guest) mencoba menjelajah ke dalam fitur pribadi (Tunggakan / Utang Kas), minta login terlebih dahulu
  if (state.userRole === 'guest' && ['tunggakan', 'utang'].includes(tabName)) {
    toggleMobileDrawer(false);
    openAdminLoginModal('santri');
    showToast('Silakan login terlebih dahulu', 'amber');
    return;
  }

  state.activeTab = tabName;
  saveState(true);

  // Hide all panels
  document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(`view-${tabName}`);
  if (target) target.classList.remove('hidden');

  // Reset desktop sidebar nav buttons
  document.querySelectorAll('aside nav button').forEach(btn => {
    btn.className = 'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer font-medium text-[13px]';
  });
  const activeBtn = document.getElementById(`nav-${tabName}`);
  if (activeBtn) {
    activeBtn.className = 'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all bg-[#064e3b] text-white font-semibold shadow-xs cursor-pointer text-[13px]';
  }

  // Reset & update mobile drawer nav buttons
  document.querySelectorAll('#mobileDrawer nav button').forEach(btn => {
    btn.className = 'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all text-slate-600 hover:bg-slate-50 cursor-pointer font-medium text-[13px]';
  });
  const activeDrawerBtn = document.getElementById(`drawer-${tabName}`);
  if (activeDrawerBtn) {
    activeDrawerBtn.className = 'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all bg-[#064e3b] text-white font-semibold shadow-xs cursor-pointer text-[13px]';
  }

  // Reset & update mobile bottom navigation bar
  const bnavItems = ['pembayaran', 'dashboard', 'tunggakan', 'masak', 'santri'];
  bnavItems.forEach(item => {
    const bBtn = document.getElementById(`bnav-${item}`);
    if (bBtn) {
      if (item === tabName) {
        bBtn.className = 'flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition text-emerald-800 font-bold cursor-pointer';
      } else {
        bBtn.className = 'flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition text-slate-400 hover:text-slate-700 font-medium cursor-pointer';
      }
    }
  });

  // Close mobile drawer on navigation
  toggleMobileDrawer(false);

  // Update Page Header Titles
  const titles = {
    pembayaran: 'Pembayaran',
    dashboard: 'Dashboard',
    tunggakan: 'Tunggakan',
    masak: 'Kas Masak',
    kasumum: 'Kas Umum Komplek',
    utang: 'Pinjaman Kas',
    santri: 'Data Santri'
  };
  const titleText = titles[tabName] || 'Pembayaran';
  const titleEl = document.getElementById('pageHeadingTitle');
  if (titleEl) titleEl.textContent = titleText;
  const mobileTitleEl = document.getElementById('mobilePageHeadingTitle');
  if (mobileTitleEl) mobileTitleEl.textContent = titleText;

  renderAll();
}

function showToast(msg, color = 'emerald') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'bg-[#064e3b] text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-150';
  el.innerHTML = `<span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3200);
}

function ubahTarifWifiManual() {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const currentTarif = getTarif(state.activeMonth);
  const input = prompt(`Masukkan nominal manual tarif iuran WiFi santri (${getMonthLabel(state.activeMonth)}):`, currentTarif.wifi);
  if (input === null) return;
  const num = Number(input.replace(/[^0-9]/g, ''));
  if (isNaN(num) || num < 0) {
    alert('Nominal tidak valid!');
    return;
  }
  if (!state.tarifWifiPerBulan) state.tarifWifiPerBulan = {};
  state.tarifWifiPerBulan[state.activeMonth] = num;
  saveState();
  renderAll();
  showToast(`Tarif WiFi ${getMonthLabel(state.activeMonth)} diatur manual: ${formatRp(num)}`);
}

function handleGlobalSearch(e) {
  const q = (e.target.value || '').toLowerCase();
  if (state.activeTab !== 'pembayaran') {
    switchTab('pembayaran');
  }
  renderScheduledPayments(q);
}

// =========================================================================
// QUICK TRANSFER CONTROLLER (FINPILOT EXACT WORKFLOW)
// =========================================================================

function selectQuickSantri(santriId) {
  state.selectedSantriId = santriId;
  saveState(true);
  renderQuickTransfer();
  setQuickMode(state.quickMode || 'full');
}

function setQuickMode(mode) {
  state.quickMode = mode;
  const curTarif = getTarif(state.activeMonth);
  const amtInput = document.getElementById('quickAmountInput');
  const tanpaMakan = isSantriTanpaMakan(state.selectedSantriId);

  const btnFull = document.getElementById('qtab-full');
  if (btnFull) {
    btnFull.textContent = tanpaMakan
      ? `Kas (${curTarif.totalKas / 1000}k)`
      : `Lunas (${curTarif.totalBulanan / 1000}k)`;
  }

  // Update tabs appearance
  ['full', 'makan', 'wifi'].forEach(m => {
    const btn = document.getElementById(`qtab-${m}`);
    if (!btn) return;
    if (m === mode) {
      btn.className = 'py-2 rounded-lg bg-white text-slate-900 shadow-xs cursor-pointer transition';
    } else {
      btn.className = 'py-2 rounded-lg hover:text-slate-900 cursor-pointer transition';
    }
  });

  if (!amtInput) return;
  if (mode === 'full') {
    amtInput.value = formatRp(tanpaMakan ? curTarif.totalKas : curTarif.totalBulanan);
  } else if (mode === 'makan') {
    amtInput.value = tanpaMakan ? 'Rp 0 (Tanpa Makan)' : formatRp(curTarif.makan);
  } else if (mode === 'wifi') {
    amtInput.value = formatRp(curTarif.wifi);
  }
}

let currentQuickPaymentMethod = 'cash'; // Default cash for direct payment

function setQuickPaymentMethod(method) {
  currentQuickPaymentMethod = method;
  const btnCash = document.getElementById('quickMetodeCash');
  const btnDana = document.getElementById('quickMetodeDana');
  if (method === 'cash') {
    if (btnCash) {
      btnCash.className = 'flex-1 py-1.5 rounded-lg bg-white text-emerald-950 font-bold shadow-2xs cursor-pointer transition flex items-center justify-center gap-1';
    }
    if (btnDana) {
      btnDana.className = 'flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer transition flex items-center justify-center gap-1';
    }
  } else {
    if (btnCash) {
      btnCash.className = 'flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer transition flex items-center justify-center gap-1';
    }
    if (btnDana) {
      btnDana.className = 'flex-1 py-1.5 rounded-lg bg-white text-emerald-950 font-bold shadow-2xs cursor-pointer transition flex items-center justify-center gap-1';
    }
  }
}

function handleQuickSubmitPayment() {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  if (!state.selectedSantriId) {
    showToast('Pilih santri terlebih dahulu', 'amber');
    return;
  }
  const s = state.santri.find(x => x.id === state.selectedSantriId);
  const tanpaMakan = isSantriTanpaMakan(s || state.selectedSantriId);
  const rec = getPaymentRecord(state.selectedSantriId, state.activeMonth);
  const note = document.getElementById('quickNoteInput')?.value || '';
  const curTarif = getTarif(state.activeMonth);

  if (state.quickMode === 'makan' && tanpaMakan) {
    showToast('Santri ini Tanpa Uang Makan', 'amber');
    return;
  }

  let amt = tanpaMakan ? curTarif.totalKas : curTarif.totalBulanan;
  let desc = 'Pembayaran Lunas Syahriyah';

  if (state.quickMode === 'full') {
    rec.makan = !tanpaMakan;
    rec.wifi = true;
    rec.listrik = true;
    rec.air = true;
    amt = tanpaMakan ? curTarif.totalKas : curTarif.totalBulanan;
    desc = tanpaMakan ? 'Kas Komplek Lunas' : 'Syahriyah Lunas';
  } else if (state.quickMode === 'makan') {
    rec.makan = true;
    amt = curTarif.makan;
    desc = 'Pembayaran Uang Makan';
  } else if (state.quickMode === 'wifi') {
    rec.wifi = true;
    amt = curTarif.wifi;
    desc = 'Kas WiFi';
  }

  const metode = currentQuickPaymentMethod || 'cash';
  const metodeLabel = metode === 'cash' ? 'Tunai (Cash)' : 'Transfer DANA';
  rec.metode = metode;
  rec.catatan = note ? `${note} [${metodeLabel}]` : `Bayar ${metodeLabel}`;
  rec.updatedAt = new Date().toISOString().slice(0, 10);

  // Push to recent transactions
  state.recentTransactions.unshift({
    id: 'T' + Date.now(),
    title: s ? s.nama : 'Santri',
    subtitle: note ? `${desc} (${metodeLabel} - ${note})` : `${desc} (${metodeLabel})`,
    type: 'income',
    amount: amt,
    date: 'Hari ini',
    status: 'Completed',
    icon: metode === 'cash' ? 'banknote' : 'wallet'
  });

  saveState();
  if (document.getElementById('quickNoteInput')) {
    document.getElementById('quickNoteInput').value = '';
  }
  renderAll();
  showToast(`✓ Pembayaran ${metodeLabel} berhasil disimpan!`, 'emerald');
}

// =========================================================================
// RENDERERS (MATCHING 100% FINPILOT VIEW)
// =========================================================================

function renderAll() {
  const fin = calculateGlobalFinancials();
  const curTarif = getTarif(state.activeMonth);

  // Metrics Bar (Payments Tab & Dashboard Tab) — Disesuaikan berdasarkan Role (Bendahara vs Santri Pribadi vs Tamu Umum)
  const monthLabelShort = getMonthLabel(state.activeMonth);
  if (document.getElementById('mMonthBadge')) document.getElementById('mMonthBadge').textContent = monthLabelShort;
  if (document.getElementById('dashMonthBadge')) document.getElementById('dashMonthBadge').textContent = monthLabelShort;
  if (document.getElementById('dashActiveMonthTitle')) document.getElementById('dashActiveMonthTitle').textContent = monthLabelShort;

  const setMetricLabels = (l1, l2, l3, l4) => {
    ['mLabel1', 'dashLabel1'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = l1; });
    ['mLabel2', 'dashLabel2'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = l2; });
    ['mLabel3', 'dashLabel3'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = l3; });
    ['mLabel4', 'dashLabel4'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = l4; });
  };

  if (state.userRole === 'admin') {
    const rolls = getMonthlyCashFlowRollForward();
    const curRoll = rolls.find(r => r.key === state.activeMonth) || rolls[0];

    setMetricLabels('Terkumpul', 'Tunggakan', 'Kas Tersedia', 'Sisa Dapur & Kas');
    const pctSent = fin.activeMonthTarget > 0 ? Math.round((fin.activeMonthTotalSent / fin.activeMonthTarget) * 100) : 0;
    const pctPending = fin.activeMonthTarget > 0 ? Math.round((fin.activeMonthTunggakan / fin.activeMonthTarget) * 100) : 0;

    const totalKasRiil = curRoll ? curRoll.saldoAkhirTotal : fin.saldoKasTersedia;
    const saldoAwalText = curRoll && curRoll.saldoAwalTotal > 0
      ? `Awal: ${formatRp(curRoll.saldoAwalTotal)}`
      : 'Bulan Pertama';

    document.getElementById('mTotalSent').textContent = formatRp(fin.activeMonthTotalSent);
    document.getElementById('mTotalSentPct').innerHTML = `<i data-lucide="arrow-up" class="w-3 h-3"></i> ${pctSent}%`;
    document.getElementById('mPending').textContent = formatRp(fin.activeMonthTunggakan);
    document.getElementById('mPendingPct').innerHTML = `<i data-lucide="arrow-down" class="w-3 h-3"></i> ${pctPending}%`;
    document.getElementById('mScheduled').textContent = formatRp(totalKasRiil);
    if (document.getElementById('mScheduledSub')) document.getElementById('mScheduledSub').textContent = saldoAwalText;
    document.getElementById('mFailed').textContent = formatRp(curRoll ? curRoll.saldoAkhirMakan : fin.saldoMasakTersedia);
    if (document.getElementById('mFailedSub')) document.getElementById('mFailedSub').textContent = `Kas: ${formatRp(curRoll ? curRoll.saldoAkhirKasUmum : fin.saldoKasTersedia)}`;

    if (document.getElementById('dashTotalSent')) {
      document.getElementById('dashTotalSent').textContent = formatRp(fin.activeMonthTotalSent);
      document.getElementById('dashTotalSentPct').textContent = `${pctSent}%`;
      document.getElementById('dashPending').textContent = formatRp(fin.activeMonthTunggakan);
      document.getElementById('dashPendingPct').textContent = `${pctPending}%`;
      document.getElementById('dashScheduled').textContent = formatRp(totalKasRiil);
      if (document.getElementById('dashScheduledSub')) document.getElementById('dashScheduledSub').textContent = saldoAwalText;
      document.getElementById('dashFailed').textContent = formatRp(curRoll ? curRoll.saldoAkhirMakan : fin.saldoMasakTersedia);
      if (document.getElementById('dashFailedSub')) document.getElementById('dashFailedSub').textContent = `Kas: ${formatRp(curRoll ? curRoll.saldoAkhirKasUmum : fin.saldoKasTersedia)}`;
    }

    if (document.getElementById('limitBar1Label')) document.getElementById('limitBar1Label').textContent = 'Iuran Terkumpul';
    document.getElementById('limitDailyRatio').textContent = `${formatRp(fin.activeMonthTotalSent)} / ${formatRp(fin.activeMonthTarget)}`;
    document.getElementById('limitDailyBar').style.width = `${Math.min(100, pctSent)}%`;

    const wifiRecAct = getBendaharaWifiRecord(state.activeMonth);
    const wifiTarget = Number(wifiRecAct.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT);
    const wifiPct = wifiTarget > 0 ? Math.round((fin.activeMonthWifi / wifiTarget) * 100) : 0;
    if (document.getElementById('limitBar2Label')) document.getElementById('limitBar2Label').textContent = 'Kas WiFi vs Setoran Induk';
    document.getElementById('limitMonthlyRatio').textContent = `${formatRp(fin.activeMonthWifi)} / ${formatRp(wifiTarget)}`;
    document.getElementById('limitMonthlyBar').style.width = `${Math.min(100, wifiPct)}%`;

  } else if (state.userRole === 'santri') {
    setMetricLabels('Terbayar', 'Tunggakan', 'Utang Kas', 'Status');
    const mySantri = state.santri.find(s => s.id === state.loggedSantriId) || state.santri[0];
    const myRec = getPaymentRecord(mySantri.id, state.activeMonth);
    const mySum = calculateRecordSummary(myRec, state.activeMonth, mySantri);
    const myPctPaid = mySum.targetSantri > 0 ? Math.round((mySum.totalPaid / mySum.targetSantri) * 100) : 0;
    const myPctUnpaid = mySum.targetSantri > 0 ? Math.round((mySum.totalUnpaid / mySum.targetSantri) * 100) : 0;
    const myActiveLoans = state.utangKas.filter(u => u.santriId === mySantri.id && u.status === 'belum_lunas');
    const myLoanTotal = myActiveLoans.reduce((acc, u) => acc + Number(u.nominal), 0);

    document.getElementById('mTotalSent').textContent = formatRp(mySum.totalPaid);
    document.getElementById('mTotalSentPct').innerHTML = `<i data-lucide="arrow-up" class="w-3 h-3"></i> ${myPctPaid}%`;
    document.getElementById('mPending').textContent = formatRp(mySum.totalUnpaid);
    document.getElementById('mPendingPct').innerHTML = `<i data-lucide="arrow-down" class="w-3 h-3"></i> ${myPctUnpaid}%`;
    document.getElementById('mScheduled').textContent = formatRp(myLoanTotal);
    if (document.getElementById('mScheduledSub')) document.getElementById('mScheduledSub').textContent = myLoanTotal === 0 ? 'Aman' : `${myActiveLoans.length} Pinjaman`;
    document.getElementById('mFailed').textContent = mySum.isFullLunas ? 'Lunas' : 'Belum';
    document.getElementById('mFailedSub').textContent = `Target ${formatRp(mySum.targetSantri)}`;

    if (document.getElementById('dashTotalSent')) {
      document.getElementById('dashTotalSent').textContent = formatRp(mySum.totalPaid);
      document.getElementById('dashTotalSentPct').textContent = `${myPctPaid}%`;
      document.getElementById('dashPending').textContent = formatRp(mySum.totalUnpaid);
      document.getElementById('dashPendingPct').textContent = `${myPctUnpaid}%`;
      document.getElementById('dashScheduled').textContent = formatRp(myLoanTotal);
      if (document.getElementById('dashScheduledSub')) document.getElementById('dashScheduledSub').textContent = myLoanTotal === 0 ? 'Aman' : `${myActiveLoans.length} Pinjaman`;
      document.getElementById('dashFailed').textContent = mySum.isFullLunas ? 'Lunas' : 'Belum';
      document.getElementById('dashFailedSub').textContent = `Target ${formatRp(mySum.targetSantri)}`;
    }

    if (document.getElementById('limitBar1Label')) document.getElementById('limitBar1Label').textContent = 'Progres Iuran Saya';
    document.getElementById('limitDailyRatio').textContent = `${formatRp(mySum.totalPaid)} / ${formatRp(mySum.targetSantri)}`;
    document.getElementById('limitDailyBar').style.width = `${Math.min(100, myPctPaid)}%`;

    const myWifiPct = myRec.wifi ? 100 : 0;
    if (document.getElementById('limitBar2Label')) document.getElementById('limitBar2Label').textContent = 'Iuran WiFi Saya';
    document.getElementById('limitMonthlyRatio').textContent = `${formatRp(mySum.paidWifi)} / ${formatRp(curTarif.wifi)}`;
    document.getElementById('limitMonthlyBar').style.width = `${myWifiPct}%`;

  } else {
    setMetricLabels('Santri Mukim', 'Syahriyah / Bln', 'Kas Komplek', 'Uang Makan');
    document.getElementById('mTotalSent').textContent = `${state.santri.length} Santri`;
    document.getElementById('mTotalSentPct').innerHTML = `Aktif`;
    document.getElementById('mPending').textContent = formatRp(curTarif.totalBulanan);
    document.getElementById('mPendingPct').innerHTML = `Full`;
    document.getElementById('mScheduled').textContent = formatRp(curTarif.totalKas);
    if (document.getElementById('mScheduledSub')) document.getElementById('mScheduledSub').textContent = 'Kas';
    document.getElementById('mFailed').textContent = formatRp(curTarif.makan);
    document.getElementById('mFailedSub').textContent = 'Dapur';

    if (document.getElementById('dashTotalSent')) {
      document.getElementById('dashTotalSent').textContent = `${state.santri.length} Santri`;
      document.getElementById('dashTotalSentPct').textContent = 'Aktif';
      document.getElementById('dashPending').textContent = formatRp(curTarif.totalBulanan);
      document.getElementById('dashPendingPct').textContent = 'Full';
      document.getElementById('dashScheduled').textContent = formatRp(curTarif.totalKas);
      if (document.getElementById('dashScheduledSub')) document.getElementById('dashScheduledSub').textContent = 'Kas';
      document.getElementById('dashFailed').textContent = formatRp(curTarif.makan);
      document.getElementById('dashFailedSub').textContent = 'Dapur';
    }

    if (document.getElementById('limitBar1Label')) document.getElementById('limitBar1Label').textContent = 'Uang Makan';
    document.getElementById('limitDailyRatio').textContent = `${formatRp(curTarif.makan)} / bln`;
    document.getElementById('limitDailyBar').style.width = `50%`;

    if (document.getElementById('limitBar2Label')) document.getElementById('limitBar2Label').textContent = 'Kas (WiFi, Listrik, Air)';
    document.getElementById('limitMonthlyRatio').textContent = `${formatRp(curTarif.totalKas)} / bln`;
    document.getElementById('limitMonthlyBar').style.width = `50%`;
  }

  // Status Setoran WiFi Induk Widget
  const wifiRecActive = getBendaharaWifiRecord(state.activeMonth);
  const widgetWifiBadge = document.getElementById('widgetWifiIndukBadge');
  if (widgetWifiBadge) {
    if (wifiRecActive.status === 'paid') {
      widgetWifiBadge.textContent = `✓ Lunas (${formatRp(wifiRecActive.nominalBayar)})`;
      widgetWifiBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200';
    } else if (wifiRecActive.status === 'pending_confirm') {
      widgetWifiBadge.textContent = `Pending (${formatRp(wifiRecActive.nominalBayar)})`;
      widgetWifiBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200';
    } else {
      widgetWifiBadge.textContent = 'Belum Disetor';
      widgetWifiBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200';
    }
  }
  if (document.getElementById('dashWifiMonthTitle')) {
    document.getElementById('dashWifiMonthTitle').textContent = monthLabelShort;
  }

  renderQuickTransfer();
  setQuickMode(state.quickMode || 'full');
  renderPendingProofsForAdmin();
  renderScheduledPayments();
  renderRecentPayments();
  renderDashboardTab(fin);
  renderTunggakanTab(fin);
  renderMasakTab(fin);
  renderKasUmumTab(fin);
  renderUtangTab(fin);
  renderSantriTab();

  updateRoleUI();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 1. Render Quick Transfer Avatars (Exact circle with active emerald ring)
function renderQuickTransfer() {
  const container = document.getElementById('quickTransferAvatarList');
  if (!container) return;

  const listHtml = state.santri.map((s, idx) => {
    const isSelected = s.id === state.selectedSantriId;
    return `
      <div onclick="selectQuickSantri('${s.id}')" class="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group">
        <div class="w-12 h-12 rounded-full p-[2px] transition-all flex items-center justify-center shrink-0 ${isSelected ? 'ring-2 ring-[#064e3b] ring-offset-2 ring-offset-white' : 'border border-slate-200/90 group-hover:border-slate-300 opacity-85 group-hover:opacity-100'}">
          <img src="${getSantriAvatar(s, idx)}" alt="${s.nama}" class="w-full h-full rounded-full object-cover" />
        </div>
        <span class="text-[11px] max-w-[62px] truncate text-center transition-colors ${isSelected ? 'font-bold text-[#064e3b]' : 'font-medium text-slate-600 group-hover:text-slate-900'}">${s.shortName || s.nama.split(' ')[0]}</span>
      </div>
    `;
  }).join('');

  const addNewBtn = `
    <div onclick="switchTab('santri')" class="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group">
      <div class="w-12 h-12 rounded-full border border-dashed border-slate-300 group-hover:border-slate-400 flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition shrink-0">
        <i data-lucide="plus" class="w-4 h-4"></i>
      </div>
      <span class="text-[11px] font-medium text-slate-400 group-hover:text-slate-600">Tambah</span>
    </div>
  `;

  container.innerHTML = listHtml + addNewBtn;
  renderActiveKartuSantriWidget();
}

function getNomorIndukSantri(s, idxParam = null) {
  const idx = idxParam !== null ? idxParam : state.santri.findIndex(x => x.id === s.id);
  const num = String((idx >= 0 ? idx : 0) + 1).padStart(3, '0');
  return `NIS-TBN-2026-${num}`;
}

function buildKartuSantriVisualHtml(s, idx = 0, showActions = true) {
  const nis = getNomorIndukSantri(s, idx);
  const avatarUrl = getSantriAvatar(s, idx, true);

  return `
    <div class="rounded-2xl overflow-hidden border border-emerald-100 shadow-[0_4px_20px_rgba(6,78,59,0.06)] bg-white text-slate-800 p-4 relative select-none">
      <!-- Soft Emerald Gradient Accents -->
      <div class="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br from-emerald-100/40 via-emerald-50/20 to-transparent pointer-events-none"></div>
      <div class="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-100/30 via-emerald-50/10 to-transparent pointer-events-none"></div>
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600/80 via-emerald-400/60 to-emerald-200/40"></div>

      <!-- Top Card Header -->
      <div class="flex items-center justify-between gap-2 pt-1 pb-3 border-b border-emerald-100/80 relative z-10">
        <div class="flex items-center gap-2.5">
          <img src="logo-mojosari.png?v=2" alt="Logo PP Mojosari" class="w-8 h-8 object-contain shrink-0" />
          <div>
            <div class="text-[9px] font-extrabold tracking-widest uppercase text-emerald-800 leading-tight">KARTU IDENTITAS SANTRI</div>
            <div class="text-xs font-extrabold font-display tracking-tight text-slate-900">PP. MOJOSARI — KOMPLEK TUBAN</div>
          </div>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50/80 text-emerald-800 border border-emerald-200/80">
          SANTRI MUKIM
        </span>
      </div>

      <!-- Middle Biodata Identitas -->
      <div class="py-3.5 flex items-center gap-3.5 relative z-10">
        <div class="w-[66px] h-[88px] shrink-0 rounded-xl overflow-hidden border-2 border-emerald-200/90 shadow-xs bg-slate-50 relative">
          <img src="${avatarUrl}" alt="${s.nama}" class="w-full h-full object-cover object-center" style="aspect-ratio: 3/4;" />
        </div>
        <div class="min-w-0 flex-1 space-y-1">
          <div class="inline-block px-2 py-0.5 rounded-md bg-emerald-50/70 border border-emerald-200/60 text-[10px] font-mono font-bold text-emerald-800 tracking-wider">${nis}</div>
          <h4 class="text-sm font-extrabold font-display text-slate-900 truncate">${s.nama}</h4>
          <div class="grid grid-cols-1 gap-0.5 text-[11px] text-slate-600">
            <div class="truncate"><span class="text-slate-400 font-medium">Prodi:</span> <span class="font-semibold text-slate-800">${s.prodi}</span></div>
            <div class="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5 flex-wrap">
              <span><strong class="text-slate-400 font-medium">Asal:</strong> ${s.alamat}</span>
              <span class="font-mono"><strong class="text-slate-400 font-sans font-medium">WA:</strong> ${s.wa}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Identity Footer (Tanpa Info Pembayaran) -->
      <div class="pt-2.5 border-t border-emerald-100/80 flex items-center justify-between gap-2 text-[10px] relative z-10">
        <div>
          <span class="font-bold text-emerald-950 block">Komplek Tuban (Rumah Wakaf)</span>
          <span class="text-[9px] text-slate-400">Pondok Pesantren Mojosari Loceret Nganjuk</span>
        </div>
        ${showActions ? `
          <button type="button" onclick="openKartuSantriModal('${s.id}')" class="no-print px-2.5 py-1 rounded-lg bg-[#064e3b] hover:bg-[#065f46] text-white text-[10px] font-bold transition cursor-pointer shadow-xs">
            Cetak Kartu
          </button>
        ` : `
          <div class="text-right font-mono text-[9px] text-emerald-800 font-bold tracking-wider">
            ID RESMI SANTRI
          </div>
        `}
      </div>
    </div>
  `;
}

function buildKartuSantriBannerHtml(s, idx = 0) {
  const nis = getNomorIndukSantri(s, idx);
  const avatarUrl = getSantriAvatar(s, idx, true);
  return `
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3 select-none">
      <div class="flex items-center gap-3 min-w-0">
        <div class="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-200/90 shrink-0 bg-white">
          <img src="${avatarUrl}" alt="${s.nama}" class="w-full h-full object-cover" />
        </div>
        <div class="min-w-0 leading-tight">
          <div class="flex items-center gap-1.5 flex-wrap">
            <h4 class="text-xs font-bold text-slate-900 truncate">${s.nama}</h4>
            <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#DDF1E5] text-[#005B52]">${nis}</span>
          </div>
          <p class="text-[11px] text-slate-500 truncate mt-0.5">${s.prodi || 'Santri Aktif'} • Kamar ${s.kamar || 'A'}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" onclick="openKartuSantriModal('${s.id}')" title="Pratinjau & Cetak KTA" class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer transition flex items-center gap-1">
          <i data-lucide="printer" class="w-3.5 h-3.5 text-slate-500"></i>
          <span>KTA</span>
        </button>
      </div>
    </div>
  `;
}

function renderActiveKartuSantriWidget() {
  const widget = document.getElementById('activeKartuSantriWidget');
  if (!widget) return;

  if (state.userRole === 'guest') {
    widget.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-bold text-slate-900 font-display">Identitas Santri</h3>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">Privat</span>
      </div>
      <div class="p-3.5 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
            <i data-lucide="id-card" class="w-4 h-4"></i>
          </div>
          <span class="text-xs text-slate-500 truncate">Masuk akun untuk KTA</span>
        </div>
        <button type="button" onclick="openAdminLoginModal('santri')" class="px-3 py-1.5 rounded-lg bg-[#005B52] hover:bg-[#004740] text-white text-xs font-bold transition cursor-pointer shrink-0">
          Masuk
        </button>
      </div>
    `;
    return;
  }

  const targetId = state.userRole === 'santri' ? state.loggedSantriId : state.selectedSantriId;
  const s = state.santri.find(x => x.id === targetId) || state.santri[0];
  if (!s) {
    widget.innerHTML = `<div class="text-xs text-slate-400 text-center py-4">Belum ada santri dipilih</div>`;
    return;
  }
  const idx = state.santri.findIndex(x => x.id === s.id);

  widget.innerHTML = `
    <div class="flex items-center justify-between mb-2.5">
      <h3 class="text-sm font-bold text-slate-900 font-display">${state.userRole === 'santri' ? 'Kartu Identitas Saya' : 'Identitas Santri Terpilih'}</h3>
      <div class="flex items-center gap-1.5">
        ${state.isAdmin ? `
          <button type="button" onclick="openGantiFotoSantriMandiri('${s.id}')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer transition">
            Edit
          </button>
          <button type="button" onclick="openSemuaKartuSantriModal()" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer transition">
            Semua
          </button>
        ` : `
          <button type="button" onclick="openGantiFotoSantriMandiri('${s.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer transition">
            Ganti Foto
          </button>
          <button type="button" onclick="openKartuSantriModal('${s.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold cursor-pointer transition">
            Lihat KTA
          </button>
        `}
      </div>
    </div>
    ${buildKartuSantriBannerHtml(s, idx >= 0 ? idx : 0)}
  `;
}

// 2. Render Scheduled Payments (Netflix Subscription / Monthly Rent / Gym style)
function renderScheduledPayments(searchFilter = '') {
  const container = document.getElementById('scheduledPaymentsList');
  if (!container) return;

  if (state.userRole === 'guest') {
    container.innerHTML = `
      <div class="p-6 rounded-2xl border border-dashed border-slate-200 bg-[#f8fafc] text-center space-y-2.5">
        <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#064e3b] flex items-center justify-center mx-auto">
          <i data-lucide="lock" class="w-5 h-5"></i>
        </div>
        <div>
          <h4 class="text-xs font-bold text-slate-900">Tagihan & Status Pembayaran</h4>
          <p class="text-[11px] text-slate-500 mt-0.5">Masuk akun untuk melihat rincian tagihan syahriyah.</p>
        </div>
        <div class="flex items-center justify-center gap-2 pt-1">
          <button onclick="openAdminLoginModal('santri')" class="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold transition cursor-pointer shadow-xs inline-flex items-center gap-1.5">
            <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
            <span>Masuk Santri</span>
          </button>
          <button onclick="switchTab('santri')" class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer">
            Data Santri
          </button>
        </div>
      </div>
    `;
    return;
  }

  const q = searchFilter.toLowerCase();
  const baseList = state.userRole === 'santri'
    ? state.santri.filter(s => s.id === state.loggedSantriId)
    : state.santri;

  const list = baseList.filter(s => {
    return s.nama.toLowerCase().includes(q) || s.prodi.toLowerCase().includes(q);
  });

  if (list.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs">Tidak ada data santri</div>`;
    return;
  }

  container.innerHTML = list.map(s => {
    const rec = getPaymentRecord(s.id, state.activeMonth);
    const sum = calculateRecordSummary(rec, state.activeMonth, s);
    const pendingProof = (state.konfirmasiBayar || []).find(p => p.santriId === s.id && p.monthKey === state.activeMonth && p.status === 'pending');

    return `
      <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <i data-lucide="calendar" class="w-4 h-4 text-slate-500"></i>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-slate-900 truncate">${s.nama} (${s.prodi.split(' ')[0]}) ${sum.tanpaMakan ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Makan</span>` : ''} ${state.userRole === 'santri' ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold">Data Saya</span>` : ''} ${pendingProof ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold">Menunggu Verifikasi</span>` : ''}</h4>
            <p class="text-[11px] text-slate-400 truncate">${sum.tanpaMakan ? 'Iuran Kas Komplek (Tanpa Uang Makan)' : 'Iuran Syahriyah'} • ${getMonthLabel(state.activeMonth)}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right">
            <div class="text-xs font-bold text-slate-900 font-mono">${formatRp(sum.totalPaid)}</div>
            ${sum.totalUnpaid > 0 ? `<div class="text-[10px] text-rose-500 font-semibold">Kurang ${formatRp(sum.totalUnpaid)}</div>` : ''}
          </div>

          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${sum.isFullLunas ? 'bg-[#DDF1E5] text-[#005B52]' : 'bg-[#FEF3C7] text-[#92400E]'}">
            ${sum.isFullLunas ? 'Active' : 'Pending'}
          </span>

          <div class="flex items-center gap-1">
            ${state.isAdmin ? `
              <button onclick="openNotaPembayaranModal('${s.id}', '${state.activeMonth}')" title="Terbitkan Nota Pembayaran (Bendahara)" class="p-1.5 rounded-lg text-slate-400 hover:text-[#005B52] hover:bg-slate-100 cursor-pointer">
                <i data-lucide="receipt" class="w-4 h-4"></i>
              </button>
              <button onclick="openNotaTunggakanSantriModal('${s.id}')" title="Kirim Tagihan WA ke Santri" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 cursor-pointer">
                <i data-lucide="send" class="w-4 h-4"></i>
              </button>
            ` : `
              <button onclick="openUploadBuktiSantriModal('${s.id}', '${state.activeMonth}')" title="Upload Bukti Transfer DANA" class="px-2.5 py-1 rounded-lg bg-[#005B52] hover:bg-[#004740] text-white text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-2xs">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Upload Bukti</span>
              </button>
              <button onclick="openWaKonfirmasiKeBendahara('${s.id}', '${state.activeMonth}')" title="Konfirmasi Pembayaran ke WA Bendahara" class="px-2.5 py-1 rounded-lg bg-[#DDF1E5] hover:bg-[#c9ead6] text-[#005B52] text-[10px] font-bold cursor-pointer flex items-center gap-1">
                <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                <span>WA</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Render Recent Payments (FinPilot exact Apple Store, Starbucks, Salary Deposit layout)
function renderRecentPayments() {
  const container = document.getElementById('recentPaymentsList');
  if (!container) return;

  if (state.recentTransactions.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs">Belum ada riwayat transaksi</div>`;
    return;
  }

  container.innerHTML = state.recentTransactions.slice(0, 5).map(tx => {
    const isInc = tx.type === 'income';
    const statusBadge = tx.status === 'Completed'
      ? 'bg-[#DDF1E5] text-[#005B52]'
      : tx.status === 'Pending'
        ? 'bg-[#FEF3C7] text-[#92400E]'
        : 'bg-[#FCE4E5] text-[#991B1B]';

    return `
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <i data-lucide="${tx.icon || 'wallet'}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0">
            <h5 class="text-xs font-bold text-slate-900 truncate">${tx.title}</h5>
            <p class="text-[10px] text-slate-400 truncate">${tx.date} • ${tx.subtitle}</p>
          </div>
        </div>

        <div class="text-right shrink-0">
          <div class="text-xs font-bold font-mono ${isInc ? 'text-slate-900' : 'text-slate-900'}">
            ${isInc ? '+' : '-'}${formatRp(tx.amount)}
          </div>
          <span class="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusBadge}">${tx.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Render Dashboard Tab Matrix & Monthly Recap
function toggleComponentPayment(santriId, monthKey, field) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  if (field === 'makan' && isSantriTanpaMakan(santriId)) {
    showToast('Santri ini Tanpa Uang Makan', 'amber');
    return;
  }
  const rec = getPaymentRecord(santriId, monthKey);
  rec[field] = !rec[field];
  rec.updatedAt = new Date().toISOString().slice(0, 10);
  saveState();
  renderAll();
}

function selectDashboardMonth(monthKey) {
  state.activeMonth = monthKey;
  const select = document.getElementById('globalMonthSelect');
  if (select) select.value = monthKey;
  const mobileSelect = document.getElementById('mobileMonthSelect');
  if (mobileSelect) mobileSelect.value = monthKey;
  saveState(true);
  renderAll();
}

function openRekapGrupForMonth(monthKey) {
  if (!state.isAdmin) {
    openAdminLoginModal('admin');
    showToast('Khusus Bendahara', 'amber');
    return;
  }
  state.activeMonth = monthKey;
  const select = document.getElementById('globalMonthSelect');
  if (select) select.value = monthKey;
  const mobileSelect = document.getElementById('mobileMonthSelect');
  if (mobileSelect) mobileSelect.value = monthKey;
  saveState(true);
  renderAll();
  openRekapGrupModal();
}

function resetBulanIni(monthKeyParam) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const mKey = monthKeyParam || state.activeMonth;
  const mLabel = getMonthLabel(mKey);
  if (!confirm(`Reset pembayaran bulan ${mLabel}?`)) return;

  state.santri.forEach(s => {
    const key = `${s.id}_${mKey}`;
    delete state.pembayaran[key];
  });
  delete state.setoranWifiBendahara[mKey];

  saveState();
  renderAll();
  showToast(`Bulan ${mLabel} di-reset`);
}

function resetSemuaKeNol() {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  if (!confirm('Reset seluruh data kas? (Data santri tetap aman)')) return;
  state.pembayaran = {};
  state.setoranWifiBendahara = {};
  state.masakLogs = [];
  state.kasUmumLogs = [];
  state.konfirmasiBayar = [];
  state.utangKas = [];
  state.recentTransactions = [];
  saveState();
  renderAll();
  showToast('Data kas di-reset');
}

function renderDashboardTab(fin) {
  // 1. Render Laporan Pembayaran WiFi Induk Bulan Aktif
  const wifiSummaryBox = document.getElementById('dashWifiIndukSummaryBox');
  if (wifiSummaryBox) {
    const wifiRec = getBendaharaWifiRecord(state.activeMonth);
    const curTarif = getTarif(state.activeMonth);
    const statusLabel = wifiRec.status === 'paid'
      ? '✓ LUNAS'
      : wifiRec.status === 'pending_confirm'
        ? 'MENUNGGU KONFIRMASI'
        : 'BELUM DISETOR';
    const statusClass = wifiRec.status === 'paid'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : wifiRec.status === 'pending_confirm'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-rose-50 text-rose-600 border-rose-200';

    const nominalInduk = Number(wifiRec.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT);
    const targetWifiSantri = state.santri.length * curTarif.wifi;
    const potensiSisaKasWifi = Math.max(0, targetWifiSantri - nominalInduk);
    const aktualSisaKasWifi = Math.max(0, fin.activeMonthWifi - nominalInduk);

    wifiSummaryBox.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        <div class="lg:col-span-8 overflow-x-auto">
          <table class="w-full text-xs border-collapse">
            <tbody class="divide-y divide-slate-200/70">
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold w-44">Status Setoran</td>
                <td class="py-1.5">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusClass}">${statusLabel}</span>
                </td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold">Setoran Induk</td>
                <td class="py-1.5 font-mono font-bold text-slate-900">${formatRp(nominalInduk)} / bln</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold">Iuran Terkumpul</td>
                <td class="py-1.5 font-mono font-bold text-emerald-800">${formatRp(fin.activeMonthWifi)} <span class="text-[10px] font-normal text-slate-500">/ ${formatRp(targetWifiSantri)} (${fin.activeMonthWifiSantriCount}/${state.santri.length} Santri)</span></td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold">Surplus Kas WiFi</td>
                <td class="py-1.5 font-mono font-bold text-emerald-900">${formatRp(potensiSisaKasWifi)}/bln <span class="text-[10px] font-normal text-slate-500">(Aktual: ${formatRp(aktualSisaKasWifi)})</span></td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold">Tanggal & Catatan</td>
                <td class="py-1.5 text-slate-700"><span class="font-mono font-semibold">${wifiRec.tanggalBayar || '-'}</span> • ${wifiRec.proofNote || 'Setoran bulanan WiFi induk'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="lg:col-span-4 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl p-3 bg-white text-center">
          ${wifiRec.proofImg
            ? `<img src="${wifiRec.proofImg}" alt="Bukti Setoran WiFi Induk" onclick="openNotaWifiIndukModal('${state.activeMonth}')" class="max-h-28 rounded-lg object-contain border border-slate-200 cursor-pointer hover:opacity-90 transition" title="Lihat Bukti" />
               <span class="text-[10px] font-bold text-emerald-800 mt-1.5">✓ Bukti Terlampir</span>`
            : `<div class="py-4 text-[11px] text-slate-400">Belum ada bukti</div>`
          }
        </div>
      </div>
    `;
  }

  // 2. Render Tabel Rekapitulasi Bulanan (Disesuaikan untuk Bendahara vs Santri Pribadi vs Tamu Umum)
  const recapBody = document.getElementById('dashboardMonthlyRecapBody');
  if (recapBody) {
    recapBody.innerHTML = AVAILABLE_MONTHS.map(m => {
      const mTarif = getTarif(m.key);
      const isCurrent = m.key === state.activeMonth;
      const wRec = getBendaharaWifiRecord(m.key);
      const wifiStatusBadge = wRec.status === 'paid'
        ? `<span onclick="openNotaWifiIndukModal('${m.key}')" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer">✓ Lunas (${formatRp(wRec.nominalBayar)})</span>`
        : wRec.status === 'pending_confirm'
          ? `<span onclick="openNotaWifiIndukModal('${m.key}')" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 cursor-pointer">Pending (${formatRp(wRec.nominalBayar)})</span>`
          : `<span onclick="${state.isAdmin ? `openBendaharaWifiModal('${m.key}')` : `openNotaWifiIndukModal('${m.key}')`}" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer">Belum Setor</span>`;

      if (state.userRole === 'santri') {
        const mySantri = state.santri.find(s => s.id === state.loggedSantriId) || state.santri[0];
        const myRec = getPaymentRecord(mySantri.id, m.key);
        const mySum = calculateRecordSummary(myRec, m.key, mySantri);
        const myKas = mySum.paidWifi + mySum.paidListrik + mySum.paidAir;
        const myPct = mySum.targetSantri > 0 ? Math.round((mySum.totalPaid / mySum.targetSantri) * 100) : 0;

        return `
          <tr class="${isCurrent ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50'} transition">
            <td class="py-2.5 px-3 cursor-pointer" onclick="selectDashboardMonth('${m.key}')">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900">${m.label}</span>
                ${isCurrent ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#064e3b] text-white uppercase">Aktif</span>` : ''}
              </div>
            </td>
            <td class="py-2.5 px-3 text-right font-mono text-slate-600">${formatRp(mySum.targetSantri)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">${formatRp(mySum.totalPaid)} <span class="text-[10px] text-slate-400">(${myPct}%)</span></td>
            <td class="py-2.5 px-3 text-right font-mono font-bold ${mySum.totalUnpaid > 0 ? 'text-rose-600' : 'text-slate-400'}">${formatRp(mySum.totalUnpaid)}</td>
            <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-800">${formatRp(myKas)}</td>
            <td class="py-2.5 px-3 text-center">${wifiStatusBadge}</td>
            <td class="py-2.5 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${mySum.isFullLunas ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-50 text-rose-600'}">
                ${mySum.isFullLunas ? '✓ Lunas' : 'Belum'}
              </span>
            </td>
            <td class="py-2.5 px-3 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button onclick="openUploadBuktiSantriModal('${mySantri.id}', '${m.key}')" class="px-2 py-1 rounded-lg bg-[#064e3b] hover:bg-[#065f46] text-white text-[10px] font-bold cursor-pointer">
                  Upload Bukti
                </button>
                <button onclick="openWaKonfirmasiKeBendahara('${mySantri.id}', '${m.key}')" class="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer">
                  WA
                </button>
              </div>
            </td>
          </tr>
        `;
      }

      if (state.userRole === 'guest') {
        return `
          <tr class="${isCurrent ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50'} transition">
            <td class="py-2.5 px-3 cursor-pointer" onclick="selectDashboardMonth('${m.key}')">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900">${m.label}</span>
                ${isCurrent ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#064e3b] text-white uppercase">Aktif</span>` : ''}
              </div>
            </td>
            <td class="py-2.5 px-3 text-right font-mono text-slate-600">${formatRp(mTarif.totalBulanan)}/santri</td>
            <td class="py-2.5 px-3 text-right text-slate-400 text-[11px]">Privat</td>
            <td class="py-2.5 px-3 text-right text-slate-400 text-[11px]">Privat</td>
            <td class="py-2.5 px-3 text-right font-mono text-slate-600">${formatRp(mTarif.totalKas)}/santri</td>
            <td class="py-2.5 px-3 text-center">${wifiStatusBadge}</td>
            <td class="py-2.5 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">${state.santri.length} Santri</span>
            </td>
            <td class="py-2.5 px-3 text-right">
              <button onclick="openAdminLoginModal('santri')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer">
                Masuk
              </button>
            </td>
          </tr>
        `;
      }

      const target = state.santri.reduce((acc, s) => {
        return acc + (isSantriTanpaMakan(s) ? mTarif.totalKas : mTarif.totalBulanan);
      }, 0);
      let terkumpul = 0;
      let kasMasuk = 0;
      let lunasCount = 0;

      state.santri.forEach(s => {
        const rec = getPaymentRecord(s.id, m.key);
        const sum = calculateRecordSummary(rec, m.key, s);
        terkumpul += sum.totalPaid;
        kasMasuk += (sum.paidWifi + sum.paidListrik + sum.paidAir);
        if (sum.isFullLunas) lunasCount++;
      });

      const tunggakan = Math.max(0, target - terkumpul);
      const pct = target > 0 ? Math.round((terkumpul / target) * 100) : 0;

      return `
        <tr class="${isCurrent ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50'} transition">
          <td class="py-2.5 px-3 cursor-pointer" onclick="selectDashboardMonth('${m.key}')">
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900">${m.label}</span>
              ${isCurrent ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#064e3b] text-white uppercase">Aktif</span>` : ''}
            </div>
          </td>
          <td class="py-2.5 px-3 text-right font-mono text-slate-600">${formatRp(target)}</td>
          <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">${formatRp(terkumpul)} <span class="text-[10px] text-slate-400">(${pct}%)</span></td>
          <td class="py-2.5 px-3 text-right font-mono font-bold ${tunggakan > 0 ? 'text-rose-600' : 'text-slate-400'}">${formatRp(tunggakan)}</td>
          <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-800">${formatRp(kasMasuk)}</td>
          <td class="py-2.5 px-3 text-center">${wifiStatusBadge}</td>
          <td class="py-2.5 px-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${lunasCount === state.santri.length && state.santri.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
              ${lunasCount}/${state.santri.length} Santri
            </span>
          </td>
          <td class="py-2.5 px-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="openModalLpjResmi('${m.key}')" title="Cetak LPJ Resmi Bulan ${m.label}" class="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-[10px] font-extrabold cursor-pointer">
                LPJ
              </button>
              <button onclick="openNotaWifiIndukModal('${m.key}')" title="Laporan Pembayaran WiFi Induk" class="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer">
                Nota WiFi
              </button>
              <button onclick="openRekapGrupForMonth('${m.key}')" class="px-2 py-1 rounded-lg bg-[#064e3b] hover:bg-[#065f46] text-white text-[10px] font-bold cursor-pointer">
                Kirim WA
              </button>
              <button onclick="resetBulanIni('${m.key}')" class="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold cursor-pointer">
                Reset
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Tabel Arus Kas & Saldo Bergulir Antar-Bulan
  renderCashFlowRecap();

  const matrixBody = document.getElementById('dashboardMatrixBody');
  if (!matrixBody) return;

  if (state.userRole === 'guest') {
    matrixBody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 px-4 text-center">
          <div class="max-w-md mx-auto space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#064e3b] flex items-center justify-center mx-auto">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <h4 class="text-xs font-bold text-slate-900">Status Komponen Syahriyah</h4>
            <p class="text-[11px] text-slate-500">Masuk akun untuk melihat status Makan, WiFi, Listrik, dan Air.</p>
            <div class="pt-1 flex items-center justify-center gap-2">
              <button onclick="openAdminLoginModal('santri')" class="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold transition cursor-pointer shadow-xs">
                Masuk Akun
              </button>
              <button onclick="switchTab('santri')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer">
                Data Santri
              </button>
            </div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  if (state.santri.length === 0) {
    matrixBody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400 text-xs">Belum ada data santri.</td></tr>`;
    return;
  }

  const matrixSantriList = state.userRole === 'santri'
    ? state.santri.filter(s => s.id === state.loggedSantriId)
    : state.santri;

  matrixBody.innerHTML = matrixSantriList.map(s => {
    const rec = getPaymentRecord(s.id, state.activeMonth);
    const sum = calculateRecordSummary(rec, state.activeMonth, s);

    const badge = (paid, field) => {
      if (!state.isAdmin) {
        return paid
          ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 select-none">✓ Lunas</span>`
          : `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 select-none">Belum</span>`;
      }
      return paid
        ? `<button onclick="toggleComponentPayment('${s.id}', '${state.activeMonth}', '${field}')" title="Klik untuk ubah status" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer">✓ Lunas</button>`
        : `<button onclick="toggleComponentPayment('${s.id}', '${state.activeMonth}', '${field}')" title="Klik untuk ubah status" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer">Belum</button>`;
    };

    const makanBadge = sum.tanpaMakan
      ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Tanpa Makan</span>`
      : badge(rec.makan, 'makan');

    return `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="py-3 px-3">
          <div class="font-bold text-slate-900">${s.nama} ${sum.tanpaMakan ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Makan</span>` : ''}</div>
          <div class="text-[10px] text-slate-400">${s.prodi} • ${s.alamat}</div>
        </td>
        <td class="py-3 px-3 text-center">${makanBadge}</td>
        <td class="py-3 px-3 text-center">${badge(rec.wifi, 'wifi')}</td>
        <td class="py-3 px-3 text-center">${badge(rec.listrik, 'listrik')}</td>
        <td class="py-3 px-3 text-center">${badge(rec.air, 'air')}</td>
        <td class="py-3 px-3 text-right font-mono">
          <span class="font-bold ${sum.isFullLunas ? 'text-emerald-800' : 'text-slate-900'}">${formatRp(sum.totalPaid)}</span>
          ${sum.totalUnpaid > 0 ? `<div class="text-[10px] text-rose-500 font-semibold">Kurang ${formatRp(sum.totalUnpaid)}</div>` : ''}
        </td>
        <td class="py-3 px-3 text-right">
          <div class="flex items-center justify-end gap-1.5">
            ${state.isAdmin ? `
              ${sum.totalPaid > 0 ? `
                <button onclick="openMovePaymentModal('${s.id}', '${state.activeMonth}')" title="Pindahkan pembayaran santri ini ke bulan lain" class="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold cursor-pointer flex items-center gap-1">
                  Pindah Bln
                </button>
              ` : ''}
              <button onclick="openNotaPembayaranModal('${s.id}', '${state.activeMonth}')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer">
                Nota
              </button>
              <button onclick="openNotaTunggakanSantriModal('${s.id}')" class="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold cursor-pointer">
                Tagih WA
              </button>
            ` : `
              <button onclick="openUploadBuktiSantriModal('${s.id}', '${state.activeMonth}')" class="px-2.5 py-1 rounded-lg bg-[#064e3b] hover:bg-[#065f46] text-white text-[11px] font-bold cursor-pointer">
                Upload Bukti
              </button>
              <button onclick="openWaKonfirmasiKeBendahara('${s.id}', '${state.activeMonth}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold cursor-pointer">
                WA
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Render Tunggakan Tab
function renderTunggakanTab(finData) {
  const fin = finData || calculateGlobalFinancials();
  const listEl = document.getElementById('tunggakanSantriList');
  if (!listEl) return;

  if (state.userRole === 'guest') {
    listEl.innerHTML = `
      <div class="p-8 rounded-2xl border border-dashed border-slate-200 bg-[#f8fafc] text-center space-y-2.5">
        <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#064e3b] flex items-center justify-center mx-auto">
          <i data-lucide="lock" class="w-5 h-5"></i>
        </div>
        <h4 class="text-xs font-bold text-slate-900">Data Tunggakan Pribadi</h4>
        <p class="text-[11px] text-slate-500 max-w-md mx-auto">Masuk akun untuk melihat rincian tunggakan.</p>
        <button onclick="openAdminLoginModal('santri')" class="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold transition cursor-pointer shadow-xs">
          Masuk Akun
        </button>
      </div>
    `;
    return;
  }

  const mode = document.getElementById('filterTunggakanMode')?.value || 'nunggak';
  const rows = [];

  const targetSantriList = state.userRole === 'santri'
    ? state.santri.filter(s => s.id === state.loggedSantriId)
    : state.santri;

  targetSantriList.forEach(s => {
    const monthDetails = fin.monthsToCheck.map(mKey => {
      const rec = getPaymentRecord(s.id, mKey);
      const sum = calculateRecordSummary(rec, mKey, s);
      return { monthKey: mKey, monthLabel: getMonthLabel(mKey), rec, sum };
    });

    const totalArrears = monthDetails.reduce((acc, d) => acc + d.sum.totalUnpaid, 0);
    const activeLoans = state.utangKas.filter(u => u.santriId === s.id && u.status === 'belum_lunas');
    const totalUtang = activeLoans.reduce((acc, u) => acc + Number(u.nominal), 0);
    const grandTotal = totalArrears + totalUtang;

    if ( state.isAdmin ) {
      if (mode === 'nunggak' && grandTotal === 0) return;
      if (mode === 'lunas' && grandTotal > 0) return;
    }

    rows.push({ santri: s, monthDetails, totalArrears, activeLoans, totalUtang, grandTotal });
  });

  if (rows.length === 0) {
    listEl.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">Tidak ada data tunggakan.</div>`;
    return;
  }

  listEl.innerHTML = rows.map(r => `
    <div class="p-4 rounded-2xl border ${r.grandTotal === 0 ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 bg-white'} shadow-xs space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 class="text-xs font-bold text-slate-900">${r.santri.nama} ${isSantriTanpaMakan(r.santri) ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Uang Makan</span>` : ''} ${state.userRole === 'santri' ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold">Tunggakan Saya</span>` : ''} • <span class="text-slate-400 font-normal">${r.santri.prodi}</span></h4>
          <p class="text-[11px] text-slate-500">WA: <span class="font-mono">${r.santri.wa}</span></p>
        </div>
        <div class="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span class="text-xs font-bold font-mono ${r.grandTotal === 0 ? 'text-emerald-800' : 'text-rose-600'}">
            ${r.grandTotal === 0 ? 'LUNAS SEMUA BULAN' : `Total: ${formatRp(r.grandTotal)}`}
          </span>
          ${state.isAdmin ? `
            <button onclick="openNotaTunggakanSantriModal('${r.santri.id}')" class="px-3 py-1.5 rounded-xl bg-[#064e3b] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0">
              <i data-lucide="send" class="w-3.5 h-3.5"></i>
              <span>Kirim Tagihan WA</span>
            </button>
          ` : `
            <button onclick="openUploadBuktiSantriModal('${r.santri.id}', '${state.activeMonth}')" class="px-3 py-1.5 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-xs">
              <i data-lucide="upload" class="w-3.5 h-3.5"></i>
              <span>Upload Bukti</span>
            </button>
            <button onclick="openWaKonfirmasiKeBendahara('${r.santri.id}', '${state.activeMonth}')" class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0">
              <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
              <span>WA Bendahara</span>
            </button>
          `}
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        ${r.monthDetails.map(md => `
          <div class="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 text-[11px]">
            <div class="flex justify-between font-bold text-slate-800 mb-1">
              <span>${md.monthLabel}</span>
              <span class="${md.sum.isFullLunas ? 'text-emerald-800' : 'text-rose-600'} font-mono">${md.sum.isFullLunas ? 'Lunas' : `Kurang ${formatRp(md.sum.totalUnpaid)}`}</span>
            </div>
            <div class="text-[10px] text-slate-500">
              Makan: ${md.sum.tanpaMakan ? 'Tanpa Makan' : (md.rec.makan ? '✓' : '✗')} • WiFi: ${md.rec.wifi ? '✓' : '✗'} • Listrik: ${md.rec.listrik ? '✓' : '✗'} • Air: ${md.rec.air ? '✓' : '✗'}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// 6. Render Jurnal Masak
function handleSaveMasak(event) {
  event.preventDefault();
  if (!state.isAdmin) {
    showToast('Hanya Bendahara yang berwenang mencatat transaksi atau pengeluaran kas masak.', true);
    return;
  }
  const tanggal = document.getElementById('masakTanggal').value;
  const tipe = document.querySelector('input[name="masakTipe"]:checked').value;
  const keterangan = document.getElementById('masakKeterangan').value.trim();
  const nominal = Number(document.getElementById('masakNominal').value);
  const petugas = document.getElementById('masakPetugas').value.trim();

  if (!tanggal || !keterangan || !nominal) return;

  state.masakLogs.unshift({ id: 'M' + Date.now(), tanggal, tipe, keterangan, nominal, petugas });
  state.recentTransactions.unshift({
    id: 'T' + Date.now(),
    title: keterangan,
    subtitle: `Piket: ${petugas}`,
    type: tipe === 'pemasukan' ? 'income' : 'expense',
    amount: nominal,
    date: 'Hari ini',
    status: 'Completed',
    icon: 'utensils'
  });

  saveState();
  document.getElementById('masakKeterangan').value = '';
  document.getElementById('masakNominal').value = '';
  renderAll();
  showToast('Catatan masak berhasil disimpan');
}

function deleteMasakLog(id) {
  state.masakLogs = state.masakLogs.filter(m => m.id !== id);
  saveState();
  renderAll();
  showToast('Catatan masak dihapus', 'amber');
}

function renderMasakTab(finData) {
  const fin = finData || calculateGlobalFinancials();
  const badge = document.getElementById('rekapMasakSaldoBadge');
  if (badge) badge.textContent = `Saldo Dapur: ${formatRp(fin.saldoMasakTersedia)}`;

  const tbody = document.getElementById('masakTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.masakLogs.map(m => `
    <tr class="hover:bg-slate-50">
      <td class="py-2.5 px-3 font-mono text-slate-500">${m.tanggal}</td>
      <td class="py-2.5 px-3 font-medium text-slate-900">${m.keterangan}</td>
      <td class="py-2.5 px-3 text-slate-500">${m.petugas}</td>
      <td class="py-2.5 px-3 text-right font-mono font-bold ${m.tipe === 'pemasukan' ? 'text-emerald-800' : 'text-slate-900'}">
        ${m.tipe === 'pemasukan' ? '+' : '-'}${formatRp(m.nominal)}
      </td>
      <td class="py-2.5 px-3 text-center">
        <button onclick="deleteMasakLog('${m.id}')" class="text-slate-300 hover:text-rose-500 cursor-pointer">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// 6B. Render Jurnal Kas Umum Komplek
function handleSaveKasUmum(event) {
  event.preventDefault();
  if (!state.isAdmin) {
    showToast('Hanya Bendahara yang berwenang mencatat transaksi atau pengeluaran Kas Umum.', true);
    return;
  }
  const tanggal = document.getElementById('kasUmumTanggal').value;
  const tipe = document.querySelector('input[name="kasUmumTipe"]:checked').value;
  const kategori = document.getElementById('kasUmumKategori').value || 'Lain-lain';
  const keterangan = document.getElementById('kasUmumKeterangan').value.trim();
  const nominal = Number(document.getElementById('kasUmumNominal').value);
  const petugas = document.getElementById('kasUmumPetugas').value.trim() || 'Bendahara Komplek';

  if (!tanggal || !keterangan || !nominal) return;

  if (!Array.isArray(state.kasUmumLogs)) state.kasUmumLogs = [];
  state.kasUmumLogs.unshift({
    id: 'KU' + Date.now(),
    tanggal,
    tipe,
    kategori,
    keterangan,
    nominal,
    petugas
  });

  state.recentTransactions.unshift({
    id: 'T' + Date.now(),
    title: `${kategori}: ${keterangan}`,
    subtitle: `Oleh: ${petugas}`,
    type: tipe === 'pemasukan' ? 'income' : 'expense',
    amount: nominal,
    date: 'Hari ini',
    status: 'Completed',
    icon: tipe === 'pemasukan' ? 'arrow-down-left' : 'zap'
  });

  saveState();
  document.getElementById('kasUmumKeterangan').value = '';
  document.getElementById('kasUmumNominal').value = '';
  renderAll();
  showToast('Transaksi Kas Umum berhasil disimpan');
}

function deleteKasUmumLog(id) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  state.kasUmumLogs = (state.kasUmumLogs || []).filter(k => k.id !== id);
  saveState();
  renderAll();
  showToast('Catatan Kas Umum dihapus', 'amber');
}

function renderKasUmumTab(finData) {
  const fin = finData || calculateGlobalFinancials();
  const badge = document.getElementById('rekapKasUmumSaldoBadge');
  if (badge) badge.textContent = `Saldo Kas Umum: ${formatRp(fin.saldoKasTersedia)}`;

  const totalMasukIuran = fin.totalWifi + fin.totalListrik + fin.totalAir + (fin.pemasukanKasUmumLain || 0);
  const totalKeluarAll = fin.totalWifiPaidToOwner + (fin.pengeluaranKasUmum || 0) + fin.totalUtangAktif;

  const elIn = document.getElementById('kasUmumStatIn');
  const elOut = document.getElementById('kasUmumStatOut');
  const elNet = document.getElementById('kasUmumStatNet');
  if (elIn) elIn.textContent = formatRp(totalMasukIuran);
  if (elOut) elOut.textContent = formatRp(totalKeluarAll);
  if (elNet) elNet.textContent = formatRp(fin.saldoKasTersedia);

  const tbody = document.getElementById('kasUmumTableBody');
  if (!tbody) return;

  const logs = state.kasUmumLogs || [];
  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400 text-xs">Belum ada catatan pengeluaran / pemasukan kas umum.</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map(k => `
    <tr class="hover:bg-slate-50">
      <td class="py-2.5 px-3 font-mono text-slate-500">${k.tanggal}</td>
      <td class="py-2.5 px-3">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">${k.kategori || 'Lain-lain'}</span>
      </td>
      <td class="py-2.5 px-3 font-medium text-slate-900">${k.keterangan}</td>
      <td class="py-2.5 px-3 text-slate-500">${k.petugas || 'Bendahara Komplek'}</td>
      <td class="py-2.5 px-3 text-right font-mono font-bold ${k.tipe === 'pemasukan' ? 'text-emerald-800' : 'text-rose-600'}">
        ${k.tipe === 'pemasukan' ? '+' : '-'}${formatRp(k.nominal)}
      </td>
      <td class="py-2.5 px-3 text-center">
        ${state.isAdmin ? `
          <button onclick="deleteKasUmumLog('${k.id}')" class="text-slate-300 hover:text-rose-500 cursor-pointer">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        ` : `<span class="text-[10px] text-slate-300">-</span>`}
      </td>
    </tr>
  `).join('');
}

// 7. Render Utang Kas
async function handleSaveUtangKas(event) {
  event.preventDefault();
  
  if (state.userRole === 'guest') {
    openAdminLoginModal('santri');
    return;
  }

  const santriId = state.isAdmin ? document.getElementById('utangSantriId').value : state.loggedSantriId;
  const tanggal = document.getElementById('utangTanggal').value || new Date().toISOString().slice(0, 10);
  const nominal = Number(document.getElementById('utangNominal').value);
  const keterangan = document.getElementById('utangKeterangan').value.trim();

  if (!santriId || !nominal || !keterangan) {
    showToast('Harap lengkapi semua data pinjaman!', true);
    return;
  }

  const s = state.santri.find(x => x.id === santriId);
  const santriNama = s ? s.nama : 'Santri';
  const santriProdi = s ? s.prodi : '-';

  if (!state.isAdmin) {
    // ALUR SANTRI: Ajukan Pinjaman Kas (Status: menunggu_persetujuan)
    const newUtangId = 'U' + Date.now();
    const utangObj = {
      id: newUtangId,
      santriId,
      tanggal,
      nominal,
      keterangan,
      status: 'menunggu_persetujuan',
      tanggalLunas: null,
      tanggalPengajuan: tanggal
    };

    state.utangKas.unshift(utangObj);
    saveState(true);

    if (window.location.protocol !== 'file:') {
      try {
        const resp = await fetch('api.php?action=ajukan_utang', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            santriId,
            tanggal,
            nominal,
            keterangan
          })
        });
        const resData = await resp.json();
        if (resData && resData.id) {
          utangObj.id = resData.id;
        }
      } catch (err) {
        console.warn('Gagal mencatat pengajuan ke server:', err);
      }
    }

    document.getElementById('utangNominal').value = '';
    document.getElementById('utangKeterangan').value = '';
    renderAll();

    // Otomatis arahkan ke WhatsApp Bendahara
    bukaWaPersetujuanUtang(santriNama, santriProdi, tanggal, nominal, keterangan);
    showToast('Pengajuan pinjaman dibuat! Silakan hubungi Bendahara via WhatsApp.');
  } else {
    // ALUR BENDAHARA: Catat Pinjaman Langsung (Status: belum_lunas / langsung cair)
    const newUtangId = 'U' + Date.now();
    state.utangKas.unshift({
      id: newUtangId,
      santriId,
      tanggal,
      nominal,
      keterangan,
      status: 'belum_lunas',
      tanggalLunas: null
    });

    state.recentTransactions.unshift({
      id: 'T' + Date.now(),
      title: `Utang Kas: ${santriNama}`,
      subtitle: keterangan,
      type: 'expense',
      amount: nominal,
      date: 'Hari ini',
      status: 'Failed',
      icon: 'hand-coins'
    });

    saveState();
    document.getElementById('utangNominal').value = '';
    document.getElementById('utangKeterangan').value = '';
    renderAll();
    showToast('Utang kas santri berhasil dicatat & dicairkan');
  }
}

function bukaWaPersetujuanUtang(nama, prodi, tanggal, nominal, keterangan) {
  const bendaharaWa = (typeof BENDAHARA_LIST !== 'undefined' && BENDAHARA_LIST[0]) ? BENDAHARA_LIST[0].wa : '081231256129';
  const pesanWa = `*PENGAJUAN PINJAMAN KAS SANTRI*\n` +
    `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n` +
    `Halo Bendahara Komplek Tuban,\n\n` +
    `Saya mengajukan permohonan pinjaman kas santri dengan rincian berikut:\n` +
    `• *Nama:* ${nama}\n` +
    `• *Program Studi:* ${prodi}\n` +
    `• *Tanggal Pengajuan:* ${tanggal}\n` +
    `• *Nominal:* ${formatRp(nominal)}\n` +
    `• *Keperluan:* ${keterangan}\n` +
    `• *Status:* Menunggu Persetujuan\n\n` +
    `Mohon kiranya Bendahara berkenan meninjau dan memberikan persetujuan agar pinjaman dapat diverifikasi dan dana kas dicairkan. Terima kasih.`;

  const waUrl = `https://wa.me/${formatPhoneToWa(bendaharaWa)}?text=${encodeURIComponent(pesanWa)}`;
  window.open(waUrl, '_blank');
}

function bukaUlangWaUtang(id) {
  const item = state.utangKas.find(u => u.id === id);
  if (!item) return;
  const s = state.santri.find(x => x.id === item.santriId);
  const santriNama = s ? s.nama : 'Santri';
  const santriProdi = s ? s.prodi : '-';
  bukaWaPersetujuanUtang(santriNama, santriProdi, item.tanggal, item.nominal, item.keterangan);
}

async function approveUtangSantri(id) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const item = state.utangKas.find(u => u.id === id);
  if (!item) return;

  item.status = 'belum_lunas';
  item.tanggalCair = new Date().toISOString().slice(0, 10);

  const s = state.santri.find(x => x.id === item.santriId);
  const santriNama = s ? s.nama : 'Santri';

  state.recentTransactions.unshift({
    id: 'T' + Date.now(),
    title: `Pencairan Utang: ${santriNama}`,
    subtitle: item.keterangan || 'Pinjaman disetujui',
    type: 'expense',
    amount: item.nominal,
    date: 'Hari ini',
    status: 'Completed',
    icon: 'hand-coins'
  });

  saveState();

  if (window.location.protocol !== 'file:') {
    try {
      await fetch('api.php?action=review_utang', {
        method: 'POST',
        credentials: 'same-origin',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, decision: 'approve' })
      });
    } catch (e) {
      console.warn('Gagal review utang di server:', e);
    }
  }

  renderAll();
  showToast(`Pengajuan pinjaman ${santriNama} disetujui & dana kas dicairkan.`);
}

async function rejectUtangSantri(id) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const item = state.utangKas.find(u => u.id === id);
  if (!item) return;

  item.status = 'ditolak';
  saveState();

  if (window.location.protocol !== 'file:') {
    try {
      await fetch('api.php?action=review_utang', {
        method: 'POST',
        credentials: 'same-origin',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, decision: 'reject' })
      });
    } catch (e) {
      console.warn('Gagal tolak utang di server:', e);
    }
  }

  renderAll();
  showToast('Pengajuan pinjaman santri telah ditolak.', 'amber');
}

async function markUtangLunas(id) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const item = state.utangKas.find(u => u.id === id);
  if (!item) return;
  item.status = 'lunas';
  item.tanggalLunas = new Date().toISOString().slice(0, 10);
  saveState();

  if (window.location.protocol !== 'file:') {
    try {
      await fetch('api.php?action=review_utang', {
        method: 'POST',
        credentials: 'same-origin',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, decision: 'lunas' })
      });
    } catch (e) {
      console.warn('Gagal lunasi utang di server:', e);
    }
  }

  renderAll();
  showToast('Utang santri lunas & kas telah kembali');
}

function renderUtangTab(finData) {
  const fin = finData || calculateGlobalFinancials();
  const badge = document.getElementById('rekapUtangAktifBadge');

  const sel = document.getElementById('utangSantriId');
  if (sel) {
    const cur = sel.value;
    sel.innerHTML = state.santri.map(s =>
      `<option value="${s.id}" ${s.id === cur ? 'selected' : ''}>${s.nama} (${s.prodi})</option>`
    ).join('');
    if (state.userRole === 'santri' && state.loggedSantriId) {
      sel.value = state.loggedSantriId;
    }
  }

  const tbody = document.getElementById('utangTableBody');
  if (!tbody) return;

  if (state.userRole === 'guest') {
    if (badge) badge.textContent = 'Privat';
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 px-4 text-center">
          <div class="max-w-md mx-auto space-y-2.5">
            <p class="text-xs font-bold text-slate-900">Data Pinjaman / Utang Kas Bersifat Pribadi</p>
            <p class="text-[11px] text-slate-500">Silakan login menggunakan akun santri Anda untuk memeriksa riwayat pinjaman kas atau mengajukan pinjaman.</p>
            <button onclick="openAdminLoginModal('santri')" class="px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold cursor-pointer">Masuk Akun</button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const visibleLoans = state.userRole === 'santri'
    ? state.utangKas.filter(u => u.santriId === state.loggedSantriId)
    : state.utangKas;

  const pendingCount = visibleLoans.filter(u => u.status === 'menunggu_persetujuan').length;

  if (badge) {
    if (state.userRole === 'santri') {
      const myActiveTotal = visibleLoans.filter(u => u.status === 'belum_lunas').reduce((acc, u) => acc + Number(u.nominal), 0);
      badge.textContent = `Utang Aktif: ${formatRp(myActiveTotal)}${pendingCount > 0 ? ` • ${pendingCount} Menunggu` : ''}`;
    } else {
      badge.textContent = `Total Utang Aktif: ${formatRp(fin.totalUtangAktif)}${pendingCount > 0 ? ` • ${pendingCount} Menunggu Persetujuan` : ''}`;
    }
  }

  if (visibleLoans.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-6 text-center text-slate-400 text-xs">
          ${state.userRole === 'santri' ? '✓ Alhamdulillah, belum ada catatan pengajuan atau pinjaman kas santri.' : 'Belum ada catatan pinjaman / utang kas santri.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = visibleLoans.map(u => {
    const s = state.santri.find(x => x.id === u.santriId);
    let statusBadge = '';
    if (u.status === 'menunggu_persetujuan') {
      statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Menunggu Persetujuan
      </span>`;
    } else if (u.status === 'belum_lunas') {
      statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
        Belum Lunas (Cair)
      </span>`;
    } else if (u.status === 'lunas') {
      statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Lunas
      </span>`;
    } else if (u.status === 'ditolak') {
      statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
        Ditolak
      </span>`;
    }

    let actionButtons = '';
    if (state.isAdmin) {
      if (u.status === 'menunggu_persetujuan') {
        actionButtons = `
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="approveUtangSantri('${u.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer transition shadow-2xs">
              Setujui & Cairkan
            </button>
            <button onclick="rejectUtangSantri('${u.id}')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold cursor-pointer transition">
              Tolak
            </button>
          </div>
        `;
      } else if (u.status === 'belum_lunas') {
        actionButtons = `
          <button onclick="markUtangLunas('${u.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer transition">
            Lunasi
          </button>
        `;
      } else if (u.status === 'lunas') {
        actionButtons = `<span class="text-[10px] text-emerald-700 font-semibold">Tuntas</span>`;
      } else if (u.status === 'ditolak') {
        actionButtons = `<span class="text-[10px] text-slate-400 font-semibold">Ditolak</span>`;
      }
    } else if (state.userRole === 'santri') {
      if (u.status === 'menunggu_persetujuan') {
        actionButtons = `
          <button onclick="bukaUlangWaUtang('${u.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer transition inline-flex items-center gap-1">
            Hubungi WA
          </button>
        `;
      } else if (u.status === 'belum_lunas') {
        actionButtons = `<span class="text-[10px] text-rose-600 font-semibold">Dana Telah Cair</span>`;
      } else if (u.status === 'lunas') {
        actionButtons = `<span class="text-[10px] text-emerald-700 font-semibold">Lunas</span>`;
      } else if (u.status === 'ditolak') {
        actionButtons = `<span class="text-[10px] text-slate-400 font-semibold">Pengajuan Ditolak</span>`;
      }
    }

    return `
      <tr class="hover:bg-slate-50">
        <td class="py-2.5 px-3 font-mono text-slate-500">${u.tanggal}</td>
        <td class="py-2.5 px-3 font-bold text-slate-900">${s ? s.nama : 'Santri'}</td>
        <td class="py-2.5 px-3 text-slate-600">${u.keterangan}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${formatRp(u.nominal)}</td>
        <td class="py-2.5 px-3 text-center">
          ${statusBadge}
        </td>
        <td class="py-2.5 px-3 text-right">
          ${actionButtons}
        </td>
      </tr>
    `;
  }).join('');
}

// 8. Render Santri Tab & Pengelolaan Foto Santri
function handleSantriPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Silakan pilih file gambar yang valid (JPG, PNG, atau WebP).');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Kompres ukuran foto santri maksimal 320x320 agar hemat LocalStorage dan cepat disinkronkan ke DB
      const maxDim = 320;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      // Konversi ke format JPEG 85% Data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      currentSantriPhotoUrl = compressedDataUrl;
      const preview = document.getElementById('santriPhotoPreview');
      if (preview) preview.src = compressedDataUrl;
      showToast('Foto santri berhasil dimuat');
    };
    img.onerror = function() {
      alert('Gagal memproses gambar. Silakan coba file lain.');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handlePilihAvatarAcak() {
  const randIdx = Math.floor(Math.random() * 8);
  const editId = document.getElementById('editSantriId').value;
  const s = state.santri.find(x => x.id === editId) || { nama: document.getElementById('santriNama').value || 'Santri' };
  currentSantriPhotoUrl = getSantriAvatar(s, randIdx);
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = currentSantriPhotoUrl;
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';
  showToast('Inisial warna acak dipilih');
}

function handleResetFotoSantri() {
  const editId = document.getElementById('editSantriId').value;
  const idx = state.santri.findIndex(x => x.id === editId);
  const s = idx >= 0 ? state.santri[idx] : null;
  currentSantriPhotoUrl = '';
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = getSantriAvatar(s, idx >= 0 ? idx : 0);
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';
  showToast('Foto dikembalikan ke inisial');
}

async function handleSaveSantri(event) {
  event.preventDefault();

  if (state.userRole === 'guest') {
    openAdminLoginModal('santri');
    return;
  }

  // ALUR SANTRI: Santri BISA memperbarui pas foto profil miliknya sendiri
  if (!state.isAdmin && state.userRole === 'santri' && state.loggedSantriId) {
    const sIdx = state.santri.findIndex(s => s.id === state.loggedSantriId);
    if (sIdx === -1) return;

    const s = state.santri[sIdx];
    const newAvatar = currentSantriPhotoUrl || '';
    s.avatar = newAvatar;
    state.santri[sIdx] = { ...s, avatar: newAvatar };

    saveState(true);

    if (window.location.protocol !== 'file:') {
      try {
        await fetch('api.php?action=update_santri_photo', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            santri_id: s.id,
            avatar: newAvatar
          })
        });
      } catch (err) {
        console.warn('Gagal sinkronisasi foto santri ke server:', err);
      }
    }

    renderAll();
    showToast('✓ Foto profil Anda berhasil diperbarui & disimpan!', 'emerald');
    return;
  }

  if (!state.isAdmin) {
    showToast('Hanya Bendahara yang berwenang menambah atau mengedit profil & prodi santri.', true);
    return;
  }

  // ALUR BENDAHARA: Tambah atau edit data santri lengkap (nama, alamat, prodi, wa, tanpaMakan, avatar)
  const editId = document.getElementById('editSantriId').value;
  const nama = document.getElementById('santriNama').value.trim();
  const alamat = document.getElementById('santriAlamat').value.trim();
  const prodi = document.getElementById('santriProdi').value;
  const wa = document.getElementById('santriWa').value.trim();
  const tanpaMakan = Boolean(document.getElementById('santriTanpaMakan')?.checked);

  if (!nama || !alamat || !prodi || !wa) return;

  let savedSantriObj = null;

  if (editId) {
    const idx = state.santri.findIndex(s => s.id === editId);
    if (idx !== -1) {
      const existing = state.santri[idx];
      const avatar = currentSantriPhotoUrl || (existing.avatar && existing.avatar.startsWith('data:image/') ? existing.avatar : '');
      savedSantriObj = { 
        ...existing, 
        nama, 
        alamat, 
        prodi, 
        wa, 
        tanpaMakan, 
        avatar, 
        shortName: nama.split(' ')[0] 
      };
      state.santri[idx] = savedSantriObj;
    }
  } else {
    const newId = 's' + (state.santri.length + 1);
    const avatar = currentSantriPhotoUrl || '';
    savedSantriObj = { 
      id: newId, 
      nama, 
      alamat, 
      prodi, 
      wa, 
      tanpaMakan, 
      avatar, 
      shortName: nama.split(' ')[0] 
    };
    state.santri.push(savedSantriObj);
    if (!state.selectedSantriId) {
      state.selectedSantriId = newId;
    }
  }

  saveState();
  resetSantriForm();
  updateRoleUI();
  renderAll();
  showToast(editId ? 'Data santri berhasil diperbarui' : 'Santri baru berhasil ditambahkan');
}

function populateSantriFormForSelf(s) {
  if (!s) return;
  const idx = state.santri.findIndex(x => x.id === s.id);
  const idEl = document.getElementById('editSantriId');
  const namaEl = document.getElementById('santriNama');
  const alamatEl = document.getElementById('santriAlamat');
  const prodiEl = document.getElementById('santriProdi');
  const waEl = document.getElementById('santriWa');
  const chkTanpaMakan = document.getElementById('santriTanpaMakan');

  if (idEl) idEl.value = s.id;
  if (namaEl) { namaEl.value = s.nama; namaEl.disabled = true; }
  if (alamatEl) { alamatEl.value = s.alamat; alamatEl.disabled = true; }
  if (prodiEl) { prodiEl.value = s.prodi; prodiEl.disabled = true; }
  if (waEl) { waEl.value = s.wa; waEl.disabled = true; }
  if (chkTanpaMakan) { chkTanpaMakan.checked = isSantriTanpaMakan(s); chkTanpaMakan.disabled = true; }

  currentSantriPhotoUrl = (s.avatar && s.avatar.startsWith('data:image/')) ? s.avatar : '';
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = getSantriAvatar(s, idx >= 0 ? idx : 0);
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) { fileInput.value = ''; fileInput.disabled = false; }

  const titleEl = document.getElementById('formSantriTitle');
  const btnTextEl = document.getElementById('btnSaveSantriText');
  const cancelBtn = document.getElementById('btnCancelEditSantri');
  if (titleEl) titleEl.textContent = 'Ganti Foto Profil — ' + s.nama;
  if (btnTextEl) btnTextEl.textContent = 'Simpan Foto Profil';
  if (cancelBtn) cancelBtn.classList.add('hidden');
}

function openGantiFotoSantriMandiri(id) {
  const isSelf = (state.userRole === 'santri' && id === state.loggedSantriId);
  if (!state.isAdmin && !isSelf) {
    openAdminLoginModal('santri');
    return;
  }
  switchTab('santri');
  setTimeout(() => {
    if (state.isAdmin) {
      editSantri(id);
    } else {
      const s = state.santri.find(x => x.id === id);
      if (s) {
        populateSantriFormForSelf(s);
        const formEl = document.getElementById('formSantri');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, 80);
}

function editSantri(id) {
  if (!state.isAdmin) {
    showToast('Hanya Bendahara yang berwenang mengedit data santri & prodi.', true);
    return;
  }
  const s = state.santri.find(x => x.id === id);
  if (!s) return;
  const idx = state.santri.findIndex(x => x.id === id);
  document.getElementById('editSantriId').value = s.id;
  document.getElementById('santriNama').value = s.nama;
  document.getElementById('santriAlamat').value = s.alamat;
  document.getElementById('santriProdi').value = s.prodi;
  document.getElementById('santriWa').value = s.wa;
  const chkTanpaMakan = document.getElementById('santriTanpaMakan');
  if (chkTanpaMakan) chkTanpaMakan.checked = isSantriTanpaMakan(s);

  // Set avatar foto preview
  currentSantriPhotoUrl = (s.avatar && s.avatar.startsWith('data:image/')) ? s.avatar : '';
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = getSantriAvatar(s, idx >= 0 ? idx : 0);
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';

  document.getElementById('formSantriTitle').textContent = 'Edit Data Santri';
  document.getElementById('btnSaveSantriText').textContent = 'Simpan Perubahan';
  const cancelBtn = document.getElementById('btnCancelEditSantri');
  if (cancelBtn) cancelBtn.classList.remove('hidden');

  const formEl = document.getElementById('formSantri');
  if (formEl) {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function resetSantriForm() {
  document.getElementById('editSantriId').value = '';
  document.getElementById('santriNama').value = '';
  document.getElementById('santriAlamat').value = '';
  document.getElementById('santriProdi').value = 'Sistem Informasi';
  document.getElementById('santriWa').value = BENDAHARA_WA;
  const chkTanpaMakan = document.getElementById('santriTanpaMakan');
  if (chkTanpaMakan) chkTanpaMakan.checked = false;

  currentSantriPhotoUrl = '';
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = getSantriAvatar(null, 0);
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';

  document.getElementById('formSantriTitle').textContent = 'Tambah Santri';
  document.getElementById('btnSaveSantriText').textContent = 'Simpan Santri';
  document.getElementById('btnCancelEditSantri').classList.add('hidden');
}

function deleteSantri(id) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const s = state.santri.find(x => x.id === id);
  if (!s || !confirm(`Hapus santri ${s.nama}?`)) return;
  state.santri = state.santri.filter(x => x.id !== id);
  if (state.selectedSantriId === id) {
    state.selectedSantriId = state.santri.length > 0 ? state.santri[0].id : null;
  }
  saveState();
  renderAll();
  showToast('Santri dihapus', 'amber');
}

function renderSantriTab() {
  const badge = document.getElementById('totalSantriBadge');
  if (badge) badge.textContent = `${state.santri.length} Santri`;

  const tbody = document.getElementById('santriTableBody');
  const cardsGrid = document.getElementById('santriCardsGrid');
  if (!tbody) return;

  if (state.santri.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 text-xs">Belum ada data santri.</td></tr>`;
    if (cardsGrid) cardsGrid.innerHTML = `<div class="col-span-full py-6 text-center text-slate-400 text-xs">Belum ada kartu santri.</div>`;
    return;
  }

  // Direktori 17 Santri dapat dilihat umum (Nama, Asal, Prodi), namun WA dan Kartu KTA diproteksi sesuai akun
  tbody.innerHTML = state.santri.map((s, idx) => {
    const isMe = state.userRole === 'santri' && s.id === state.loggedSantriId;
    const canSeePrivate = state.isAdmin || isMe;
    const displayedWa = canSeePrivate ? s.wa : maskPhoneNumber(s.wa);

    let actionHtml = '';
    if (state.isAdmin) {
      actionHtml = `
        <button onclick="openKartuSantriModal('${s.id}')" class="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold mr-1.5 cursor-pointer">Kartu</button>
        <button onclick="editSantri('${s.id}')" class="text-xs font-semibold text-slate-600 hover:text-slate-900 mr-2 cursor-pointer">Edit</button>
        <button onclick="deleteSantri('${s.id}')" class="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer">Hapus</button>
      `;
    } else if (isMe) {
      actionHtml = `
        <button onclick="openGantiFotoSantriMandiri('${s.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold mr-1 cursor-pointer transition">Ganti Foto</button>
        <button onclick="openKartuSantriModal('${s.id}')" class="px-2.5 py-1 rounded-lg bg-[#064e3b] hover:bg-[#065f46] text-white text-[11px] font-bold cursor-pointer shadow-2xs">Kartu Saya</button>
      `;
    } else if (state.userRole === 'santri') {
      actionHtml = `<span class="text-[10px] font-semibold text-slate-400">Aktif</span>`;
    } else {
      actionHtml = `
        <button onclick="openAdminLoginModal('santri')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold cursor-pointer">Masuk</button>
      `;
    }

    return `
      <tr class="${isMe ? 'bg-emerald-50/40' : 'hover:bg-slate-50'} transition-colors">
        <td class="py-2.5 px-3 font-bold text-slate-900">
          <div class="flex items-center gap-2.5">
            <img src="${getSantriAvatar(s, idx)}" alt="${s.nama}" class="w-8 h-8 rounded-full object-cover border ${isMe ? 'border-[#064e3b] ring-2 ring-emerald-100' : 'border-slate-200'} shrink-0 bg-slate-100" />
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span>${s.nama}</span>
              </div>
              <div class="text-[10px] font-mono text-slate-400 font-normal">${getNomorIndukSantri(s, idx)}</div>
            </div>
          </div>
        </td>
        <td class="py-2.5 px-3 text-slate-500">${s.alamat}</td>
        <td class="py-2.5 px-3 text-slate-600">${s.prodi}</td>
        <td class="py-2.5 px-3 font-mono text-slate-500">${displayedWa}</td>
        <td class="py-2.5 px-3 text-right whitespace-nowrap">${actionHtml}</td>
      </tr>
    `;
  }).join('');

  if (cardsGrid) {
    if (state.isAdmin) {
      cardsGrid.innerHTML = state.santri.map((s, idx) => buildKartuSantriVisualHtml(s, idx, true)).join('');
    } else if (state.userRole === 'santri') {
      const myIdx = state.santri.findIndex(s => s.id === state.loggedSantriId);
      const mySantri = state.santri[myIdx >= 0 ? myIdx : 0];
      cardsGrid.innerHTML = mySantri
        ? `<div class="col-span-full max-w-md">${buildKartuSantriVisualHtml(mySantri, myIdx >= 0 ? myIdx : 0, true)}</div>`
        : '';
    } else {
      cardsGrid.innerHTML = `
        <div class="col-span-full p-6 rounded-2xl border border-dashed border-slate-200 bg-[#f8fafc] text-center space-y-2">
          <p class="text-xs font-bold text-slate-900">Kartu Identitas Santri</p>
          <p class="text-[11px] text-slate-500 max-w-md mx-auto">Masuk akun untuk melihat dan mencetak Kartu Identitas Santri.</p>
          <button onclick="openAdminLoginModal('santri')" class="px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold cursor-pointer">Masuk Akun</button>
        </div>
      `;
    }
  }
}

function openKartuSantriModal(santriId) {
  if (state.userRole === 'guest') {
    openAdminLoginModal('santri');
    showToast('Silakan login terlebih dahulu untuk melihat Kartu Identitas Santri', 'amber');
    return;
  }
  if (state.userRole === 'santri' && santriId !== state.loggedSantriId) {
    santriId = state.loggedSantriId;
    showToast('Menampilkan Kartu Identitas milik Anda sendiri', 'emerald');
  }

  const idx = state.santri.findIndex(x => x.id === santriId);
  const s = state.santri[idx >= 0 ? idx : 0];
  if (!s) return;

  const nis = getNomorIndukSantri(s, idx >= 0 ? idx : 0);

  document.getElementById('modalNotaHeaderTitle').textContent = `Kartu Identitas Santri — ${s.nama}`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = 'KARTU IDENTITAS';
  badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200';
  document.getElementById('notaTimestamp').textContent = `No. Induk: ${nis}`;

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="space-y-4">
      ${buildKartuSantriVisualHtml(s, idx >= 0 ? idx : 0, false)}

      <div class="overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40">
        <table class="w-full text-[11px] border-collapse">
          <tbody class="divide-y divide-emerald-100/80">
            <tr>
              <td class="py-2 px-3 text-slate-500 font-semibold w-36">Nomor Induk Santri</td>
              <td class="py-2 px-3 font-mono font-bold text-emerald-900">${nis}</td>
            </tr>
            <tr>
              <td class="py-2 px-3 text-slate-500 font-semibold">Nama Lengkap</td>
              <td class="py-2 px-3 font-bold text-slate-900">${s.nama}</td>
            </tr>
            <tr>
              <td class="py-2 px-3 text-slate-500 font-semibold">Program Studi</td>
              <td class="py-2 px-3 font-semibold text-slate-800">${s.prodi}</td>
            </tr>
            <tr>
              <td class="py-2 px-3 text-slate-500 font-semibold">Alamat Asal</td>
              <td class="py-2 px-3 text-slate-700">${s.alamat}</td>
            </tr>
            <tr>
              <td class="py-2 px-3 text-slate-500 font-semibold">Nomor WhatsApp</td>
              <td class="py-2 px-3 font-mono text-slate-700">${s.wa}</td>
            </tr>
            <tr>
              <td class="py-2 px-3 text-slate-500 font-semibold">Asrama / Komplek</td>
              <td class="py-2 px-3 font-semibold text-emerald-900">Komplek Tuban (Rumah Wakaf) — PP. Mojosari Loceret Nganjuk</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  const waLines = [
    `*KARTU IDENTITAS SANTRI*`,
    `*PP. Mojosari — Komplek Tuban*`,
    ``,
    `NIS   : *${nis}*`,
    `Nama  : *${s.nama}*`,
    `Prodi : ${s.prodi}`,
    `Asal  : ${s.alamat}`,
    `WA    : ${s.wa}`
  ].join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(s.wa)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  syncNotaModalAdminButtons();
  document.getElementById('modalNota').classList.remove('hidden');
}

function syncNotaModalAdminButtons() {
  const waSec = document.getElementById('notaAdminWaSection');
  const groupBtn = document.getElementById('btnSendWaGroup');
  const directBtn = document.getElementById('btnSendWaDirect');
  if (state.isAdmin) {
    if (waSec) waSec.classList.remove('hidden');
    if (groupBtn) groupBtn.classList.remove('hidden');
    if (directBtn) directBtn.classList.remove('hidden');
  } else {
    if (waSec) waSec.classList.add('hidden');
    if (groupBtn) groupBtn.classList.add('hidden');
    if (directBtn) directBtn.classList.add('hidden');
  }
}

function openWaKonfirmasiKeBendahara(santriId, monthKeyParam) {
  const mKey = monthKeyParam || state.activeMonth;
  const s = state.santri.find(x => x.id === (state.userRole === 'santri' ? state.loggedSantriId : santriId));
  if (!s) return;
  const rec = getPaymentRecord(s.id, mKey);
  const sum = calculateRecordSummary(rec, mKey, s);
  const monthLabel = getMonthLabel(mKey);
  const unpaidText = sum.unpaidItems.length > 0
    ? sum.unpaidItems.map(i => i.nama).join(', ')
    : 'Lunas';
  const danaNum = state.nomorDanaBendahara || NOMOR_DANA_DEFAULT;

  const msg = [
    `Assalamu'alaikum, konfirmasi syahriyah *${monthLabel}*:`,
    `• Nama : *${s.nama}*`,
    `• Dibayar : ${formatRp(sum.totalPaid)}`,
    `• Kurang : *${formatRp(sum.totalUnpaid)}* (${unpaidText})`,
    `• Transfer DANA : *${danaNum}* (Bendahara Komplek Tuban)`
  ].join('\n');

  const url = `https://wa.me/${formatPhoneToWa(BENDAHARA_WA)}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function openSemuaKartuSantriModal() {
  if (!state.isAdmin) {
    if (state.userRole === 'santri' && state.loggedSantriId) {
      openKartuSantriModal(state.loggedSantriId);
      return;
    }
    openAdminLoginModal('admin');
    showToast('Cetak kolektif 17 kartu hanya untuk Bendahara (Admin)', 'amber');
    return;
  }
  document.getElementById('modalNotaHeaderTitle').textContent = `Kartu Identitas Santri (${state.santri.length})`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = `${state.santri.length} SANTRI`;
  badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200';
  document.getElementById('notaTimestamp').textContent = 'Komplek Tuban • PP. Mojosari';

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="grid grid-cols-1 gap-3">
      ${state.santri.map((s, idx) => buildKartuSantriVisualHtml(s, idx, false)).join('')}
    </div>
  `;

  const listLines = state.santri.map((s, idx) => {
    return `${idx + 1}. *${s.nama}* (${s.prodi})`;
  });

  const waLines = [
    `*DATA SANTRI KOMPLEK TUBAN*`,
    ...listLines
  ].join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(BENDAHARA_WA)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  document.getElementById('modalNota').classList.remove('hidden');
}

// =========================================================================
// MODAL SETORAN WIFI BULANAN (BENDAHARA)
// =========================================================================

function openBendaharaWifiModal(monthKeyParam) {
  const monthKey = monthKeyParam || state.activeMonth;
  const wifiRec = getBendaharaWifiRecord(monthKey);
  currentWifiModalCtx = { monthKey, tempImgDataUrl: wifiRec.proofImg || '' };

  document.getElementById('modalWifiSubtitle').textContent = `Periode: ${getMonthLabel(monthKey)}`;
  document.getElementById('wifiProofDateInput').value = wifiRec.tanggalBayar || '2026-10-30';
  document.getElementById('wifiProofNominalInput').value = wifiRec.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT;
  document.getElementById('wifiProofNoteInput').value = wifiRec.proofNote || '';
  document.getElementById('wifiProofFileInput').value = '';

  const preview = document.getElementById('wifiProofPreviewImg');
  const empty = document.getElementById('wifiProofEmptyState');
  if (wifiRec.proofImg) {
    preview.src = wifiRec.proofImg;
    preview.classList.remove('hidden');
    empty.classList.add('hidden');
  } else {
    preview.src = '';
    preview.classList.add('hidden');
    empty.classList.remove('hidden');
  }

  document.getElementById('modalWifiProof').classList.remove('hidden');
}

function closeWifiModal() {
  document.getElementById('modalWifiProof').classList.add('hidden');
}

function handleWifiFilePreview(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    currentWifiModalCtx.tempImgDataUrl = e.target.result;
    const preview = document.getElementById('wifiProofPreviewImg');
    const empty = document.getElementById('wifiProofEmptyState');
    preview.src = e.target.result;
    preview.classList.remove('hidden');
    empty.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function useSampleWifiChatProof() {
  const monthLabel = getMonthLabel(currentWifiModalCtx.monthKey);
  const nominalVal = Number(document.getElementById('wifiProofNominalInput').value) || TAGIHAN_WIFI_INDUK_DEFAULT;
  const sampleUrl = createSampleWifiChatDataUrl(monthLabel, formatRp(nominalVal));

  currentWifiModalCtx.tempImgDataUrl = sampleUrl;
  const preview = document.getElementById('wifiProofPreviewImg');
  const empty = document.getElementById('wifiProofEmptyState');
  preview.src = sampleUrl;
  preview.classList.remove('hidden');
  empty.classList.add('hidden');

  const noteInput = document.getElementById('wifiProofNoteInput');
  if (!noteInput.value) {
    noteInput.value = `Bendahara setor bayar WiFi Induk Rp 200.000 (${monthLabel}), sisa disimpan di kas komplek`;
  }
}

function saveWifiProofOnly() {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  if (!currentWifiModalCtx.tempImgDataUrl) {
    showToast('Pilih foto bukti atau gunakan contoh screenshot!', 'amber');
    return;
  }
  const wifiRec = getBendaharaWifiRecord(currentWifiModalCtx.monthKey);
  wifiRec.proofImg = currentWifiModalCtx.tempImgDataUrl;
  wifiRec.proofNote = document.getElementById('wifiProofNoteInput').value.trim() || 'Foto bukti chat setor WiFi Induk Rp 200.000 diupload';
  wifiRec.tanggalBayar = document.getElementById('wifiProofDateInput').value || '2026-10-30';
  wifiRec.nominalBayar = Number(document.getElementById('wifiProofNominalInput').value) || TAGIHAN_WIFI_INDUK_DEFAULT;
  wifiRec.status = 'pending_confirm';

  saveState();
  closeWifiModal();
  renderAll();
  showToast('Bukti chat WiFi disimpan');
}

function confirmWifiPaidWithProof() {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  if (!currentWifiModalCtx.tempImgDataUrl) {
    showToast('Wajib ada foto bukti chat bayar WiFi ke pemilik WiFi!', 'amber');
    return;
  }
  const wifiRec = getBendaharaWifiRecord(currentWifiModalCtx.monthKey);
  wifiRec.proofImg = currentWifiModalCtx.tempImgDataUrl;
  wifiRec.proofNote = document.getElementById('wifiProofNoteInput').value.trim() || 'Setoran WiFi Induk Rp 200.000 lunas dikonfirmasi Bendahara (sisa masuk kas)';
  wifiRec.tanggalBayar = document.getElementById('wifiProofDateInput').value || '2026-10-30';
  wifiRec.nominalBayar = Number(document.getElementById('wifiProofNominalInput').value) || TAGIHAN_WIFI_INDUK_DEFAULT;
  wifiRec.status = 'paid';

  saveState();
  closeWifiModal();
  renderAll();
  showToast(`Setoran WiFi Bulanan (${getMonthLabel(currentWifiModalCtx.monthKey)}) LUNAS!`);
}

// =========================================================================
// NOTA PEMBAYARAN & NOTA TUNGGAKAN WA
// =========================================================================

function formatPhoneToWa(phone) {
  let clean = (phone || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) clean = '62' + clean.slice(1);
  return clean;
}

function openNotaPembayaranModal(santriId, monthKey) {
  if (!state.isAdmin) {
    if (state.userRole === 'santri') {
      openWaKonfirmasiKeBendahara(state.loggedSantriId, monthKey);
      return;
    }
    openAdminLoginModal('admin');
    showToast('Penerbitan Nota Resmi hanya dilakukan oleh Bendahara (Admin)', 'amber');
    return;
  }
  const s = state.santri.find(x => x.id === santriId);
  if (!s) return;
  const rec = getPaymentRecord(santriId, monthKey);
  const sum = calculateRecordSummary(rec, monthKey, s);
  const curTarif = sum.currentTarif;
  const monthLabel = getMonthLabel(monthKey);

  document.getElementById('modalNotaHeaderTitle').textContent = `Nota Pembayaran — ${s.nama}`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = sum.isFullLunas ? 'LUNAS' : 'SEBAGIAN';
  badge.className = sum.isFullLunas ? 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200' : 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200';
  document.getElementById('notaTimestamp').textContent = '30 Okt 2026';

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-[11px] border-collapse">
        <tbody class="divide-y divide-slate-200">
          <tr class="bg-slate-50/70">
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-28">Nama Santri</td>
            <td class="py-1.5 px-3 font-bold text-slate-900">${s.nama} ${sum.tanpaMakan ? '<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Uang Makan</span>' : ''}</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-24">Periode</td>
            <td class="py-1.5 px-3 font-bold text-emerald-800">${monthLabel}</td>
          </tr>
          <tr>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Program Studi</td>
            <td class="py-1.5 px-3 font-semibold text-slate-800">${s.prodi}</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Tgl Update</td>
            <td class="py-1.5 px-3 font-mono text-slate-700">${rec.updatedAt && rec.updatedAt !== '-' ? rec.updatedAt : '30 Okt 2026'}</td>
          </tr>
          <tr class="bg-slate-50/70">
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Alamat Asal</td>
            <td class="py-1.5 px-3 text-slate-700">${s.alamat}</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">No. WA</td>
            <td class="py-1.5 px-3 font-mono text-slate-700">${s.wa}</td>
          </tr>
          <tr>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Metode Bayar</td>
            <td class="py-1.5 px-3 font-bold text-slate-800">${(rec.metode === 'cash' || (rec.catatan && (rec.catatan.includes('Tunai') || rec.catatan.includes('Cash')))) ? '💵 Tunai / Cash (Langsung)' : '📱 Transfer DANA'}</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Keterangan</td>
            <td class="py-1.5 px-3 text-slate-600">${rec.catatan || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-xs border-collapse">
        <thead class="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
          <tr>
            <th class="py-2 px-2.5 text-center w-8">No</th>
            <th class="py-2 px-3 text-left">Komponen Iuran</th>
            <th class="py-2 px-3 text-right">Tarif</th>
            <th class="py-2 px-3 text-center">Status</th>
            <th class="py-2 px-3 text-right">Dibayar</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">1</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Uang Makan Bulanan</td>
            <td class="py-2 px-3 text-right font-mono text-slate-500">${sum.tanpaMakan ? 'Rp 0 (Tanpa Makan)' : formatRp(curTarif.makan)}</td>
            <td class="py-2 px-3 text-center">
              ${sum.tanpaMakan
                ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">TANPA MAKAN</span>`
                : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${rec.makan ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}">${rec.makan ? '✓ LUNAS' : '✗ BELUM'}</span>`
              }
            </td>
            <td class="py-2 px-3 text-right font-mono font-bold ${(!sum.tanpaMakan && rec.makan) ? 'text-slate-900' : 'text-slate-400'}">${formatRp(sum.paidMakan)}</td>
          </tr>
          <tr class="bg-slate-50/50">
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">2</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Kas WiFi (Input Manual)</td>
            <td class="py-2 px-3 text-right font-mono text-slate-500">${formatRp(curTarif.wifi)}</td>
            <td class="py-2 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${rec.wifi ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}">${rec.wifi ? '✓ LUNAS' : '✗ BELUM'}</span>
            </td>
            <td class="py-2 px-3 text-right font-mono font-bold ${rec.wifi ? 'text-slate-900' : 'text-slate-400'}">${formatRp(rec.wifi ? curTarif.wifi : 0)}</td>
          </tr>
          <tr>
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">3</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Kas Listrik</td>
            <td class="py-2 px-3 text-right font-mono text-slate-500">${formatRp(curTarif.listrik)}</td>
            <td class="py-2 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${rec.listrik ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}">${rec.listrik ? '✓ LUNAS' : '✗ BELUM'}</span>
            </td>
            <td class="py-2 px-3 text-right font-mono font-bold ${rec.listrik ? 'text-slate-900' : 'text-slate-400'}">${formatRp(rec.listrik ? curTarif.listrik : 0)}</td>
          </tr>
          <tr class="bg-slate-50/50">
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">4</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Kas Air</td>
            <td class="py-2 px-3 text-right font-mono text-slate-500">${formatRp(curTarif.air)}</td>
            <td class="py-2 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${rec.air ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}">${rec.air ? '✓ LUNAS' : '✗ BELUM'}</span>
            </td>
            <td class="py-2 px-3 text-right font-mono font-bold ${rec.air ? 'text-slate-900' : 'text-slate-400'}">${formatRp(rec.air ? curTarif.air : 0)}</td>
          </tr>
        </tbody>
        <tfoot class="border-t-2 border-slate-300 bg-slate-50 font-bold text-xs">
          <tr>
            <td colspan="2" class="py-2 px-3 text-slate-700">Total Tagihan / Terbayar</td>
            <td class="py-2 px-3 text-right font-mono text-slate-600">${formatRp(sum.targetSantri)}</td>
            <td class="py-2 px-3 text-center text-[10px] ${sum.isFullLunas ? 'text-emerald-800' : 'text-amber-700'}">${sum.isFullLunas ? 'LUNAS 100%' : 'SEBAGIAN'}</td>
            <td class="py-2 px-3 text-right font-mono text-emerald-800">${formatRp(sum.totalPaid)}</td>
          </tr>
          ${sum.totalUnpaid > 0 ? `
          <tr class="bg-rose-50/70 text-rose-700 border-t border-rose-200">
            <td colspan="4" class="py-2 px-3">Sisa Kekurangan Bulan ${monthLabel}</td>
            <td class="py-2 px-3 text-right font-mono">${formatRp(sum.totalUnpaid)}</td>
          </tr>` : ''}
        </tfoot>
      </table>
    </div>
  `;

  const waLines = [
    `*NOTA PEMBAYARAN — ${monthLabel.toUpperCase()}*`,
    `Nama : *${s.nama}*`,
    ``,
    `• Makan   : ${sum.tanpaMakan ? 'Bebas' : (rec.makan ? 'Lunas' : 'Belum')} (${sum.tanpaMakan ? 'Rp 0' : formatRp(curTarif.makan)})`,
    `• WiFi    : ${rec.wifi ? 'Lunas' : 'Belum'} (${formatRp(curTarif.wifi)})`,
    `• Listrik : ${rec.listrik ? 'Lunas' : 'Belum'} (${formatRp(curTarif.listrik)})`,
    `• Air     : ${rec.air ? 'Lunas' : 'Belum'} (${formatRp(curTarif.air)})`,
    ``,
    `Total Dibayar : *${formatRp(sum.totalPaid)}*`,
    `Metode        : *${(rec.metode === 'cash' || (rec.catatan && (rec.catatan.includes('Tunai') || rec.catatan.includes('Cash')))) ? 'Tunai / Cash (Langsung)' : 'Transfer DANA'}*`,
    `Kekurangan    : *${formatRp(sum.totalUnpaid)}*`,
    `Status        : *${sum.isFullLunas ? 'LUNAS ✓' : 'BELUM LUNAS'}*`
  ].join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(s.wa)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  syncNotaModalAdminButtons();
  document.getElementById('modalNota').classList.remove('hidden');
}

function openNotaTunggakanSantriModal(santriId) {
  if (!state.isAdmin) {
    if (state.userRole === 'santri') {
      openWaKonfirmasiKeBendahara(state.loggedSantriId, state.activeMonth);
      return;
    }
    openAdminLoginModal('admin');
    showToast('Penerbitan Nota Tagihan WA hanya dilakukan oleh Bendahara (Admin)', 'amber');
    return;
  }
  const s = state.santri.find(x => x.id === santriId);
  if (!s) return;
  const fin = calculateGlobalFinancials();

  const arrearsPerMonth = [];
  let totalArrears = 0;

  fin.monthsToCheck.forEach(mKey => {
    const rec = getPaymentRecord(s.id, mKey);
    const sum = calculateRecordSummary(rec, mKey, s);
    if (sum.totalUnpaid > 0) {
      arrearsPerMonth.push({ monthLabel: getMonthLabel(mKey), unpaid: sum.totalUnpaid, items: sum.unpaidItems });
      totalArrears += sum.totalUnpaid;
    }
  });

  const activeLoans = state.utangKas.filter(u => u.santriId === s.id && u.status === 'belum_lunas');
  const totalUtang = activeLoans.reduce((acc, u) => acc + Number(u.nominal), 0);
  const grandTotal = totalArrears + totalUtang;

  document.getElementById('modalNotaHeaderTitle').textContent = `Nota Tunggakan — ${s.nama}`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = 'TAGIHAN';
  badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200';
  document.getElementById('notaTimestamp').textContent = '30 Okt 2026';

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-[11px] border-collapse">
        <tbody class="divide-y divide-slate-200">
          <tr class="bg-slate-50/70">
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-28">Nama Santri</td>
            <td class="py-1.5 px-3 font-bold text-slate-900">${s.nama}</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-24">No. WA</td>
            <td class="py-1.5 px-3 font-mono text-slate-700">${s.wa}</td>
          </tr>
          <tr>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Program Studi</td>
            <td class="py-1.5 px-3 font-semibold text-slate-800">${s.prodi}</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Alamat</td>
            <td class="py-1.5 px-3 text-slate-700">${s.alamat}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-xs border-collapse">
        <thead class="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
          <tr>
            <th class="py-2 px-2.5 text-center w-8">No</th>
            <th class="py-2 px-3 text-left">Periode / Jenis Tagihan</th>
            <th class="py-2 px-3 text-left">Rincian Kekurangan</th>
            <th class="py-2 px-3 text-right">Nominal</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          ${arrearsPerMonth.length === 0 && activeLoans.length === 0 ? `
            <tr>
              <td colspan="4" class="py-4 text-center text-emerald-800 font-bold">✓ Alhamdulillah, Tidak Ada Tunggakan (Lunas Semua Bulan)</td>
            </tr>
          ` : ''}
          ${arrearsPerMonth.map((a, idx) => `
            <tr class="${idx % 2 === 1 ? 'bg-slate-50/50' : ''}">
              <td class="py-2 px-2.5 text-center text-slate-400 font-mono">${idx + 1}</td>
              <td class="py-2 px-3 font-bold text-slate-800">Iuran ${a.monthLabel}</td>
              <td class="py-2 px-3 text-[11px] text-slate-600">${a.items.map(i => `${i.nama} (${formatRp(i.nominal)})`).join(', ')}</td>
              <td class="py-2 px-3 text-right font-mono font-bold text-rose-600">${formatRp(a.unpaid)}</td>
            </tr>
          `).join('')}
          ${activeLoans.map((u, idx) => `
            <tr class="bg-amber-50/40">
              <td class="py-2 px-2.5 text-center text-slate-400 font-mono">${arrearsPerMonth.length + idx + 1}</td>
              <td class="py-2 px-3 font-bold text-amber-900">Pinjaman Kas (${u.tanggal})</td>
              <td class="py-2 px-3 text-[11px] text-amber-800">${u.keterangan}</td>
              <td class="py-2 px-3 text-right font-mono font-bold text-rose-600">${formatRp(u.nominal)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot class="border-t-2 border-slate-300 bg-rose-50/70 font-extrabold text-xs">
          <tr>
            <td colspan="3" class="py-2.5 px-3 text-rose-900 uppercase">TOTAL SELURUH TAGIHAN / TUNGGAKAN</td>
            <td class="py-2.5 px-3 text-right font-mono text-rose-700 text-sm">${formatRp(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  const tableRowsWa = [];
  arrearsPerMonth.forEach((a) => {
    tableRowsWa.push(`• ${a.monthLabel}: *${formatRp(a.unpaid)}* (${a.items.map(x => x.nama).join(', ')})`);
  });
  activeLoans.forEach((u) => {
    tableRowsWa.push(`• Pinjaman Kas: *${formatRp(u.nominal)}* (${u.keterangan})`);
  });

  const waLines = [
    `*TAGIHAN SYAHRIYAH & KAS*`,
    `Nama : *${s.nama}*`,
    ``,
    tableRowsWa.length > 0 ? tableRowsWa.join('\n') : '• Lunas semua bulan ✓',
    ``,
    `Total Tagihan : *${formatRp(grandTotal)}*`,
    `Transfer DANA : *${state.nomorDanaBendahara || NOMOR_DANA_DEFAULT}* (Bendahara Komplek Tuban)`,
    `Cek & Upload Bukti: https://paymojosari.my.id`
  ].filter(Boolean).join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(s.wa)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  syncNotaModalAdminButtons();
  document.getElementById('modalNota').classList.remove('hidden');
}

function openNotaWifiIndukModal(monthKeyParam) {
  const mKey = monthKeyParam || state.activeMonth;
  const monthLabel = getMonthLabel(mKey);
  const wifiRec = getBendaharaWifiRecord(mKey);
  const curTarif = getTarif(mKey);

  let wifiCollectedMonth = 0;
  let wifiPaidSantriCount = 0;
  state.santri.forEach(s => {
    const rec = getPaymentRecord(s.id, mKey);
    if (rec.wifi) {
      wifiCollectedMonth += curTarif.wifi;
      wifiPaidSantriCount++;
    }
  });

  const statusText = wifiRec.status === 'paid'
    ? 'LUNAS'
    : wifiRec.status === 'pending_confirm'
      ? 'PENDING'
      : 'BELUM DISETOR';

  document.getElementById('modalNotaHeaderTitle').textContent = `Laporan WiFi Induk — ${monthLabel}`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = statusText;
  badge.className = wifiRec.status === 'paid'
    ? 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200'
    : wifiRec.status === 'pending_confirm'
      ? 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200'
      : 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200';
  document.getElementById('notaTimestamp').textContent = wifiRec.tanggalBayar || '30 Okt 2026';

  const nominalInduk = Number(wifiRec.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT);
  const targetWifiSantri = state.santri.length * curTarif.wifi;
  const potensiSisaKasWifi = Math.max(0, targetWifiSantri - nominalInduk);
  const aktualSisaKasWifi = Math.max(0, wifiCollectedMonth - nominalInduk);

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-[11px] border-collapse">
        <tbody class="divide-y divide-slate-200">
          <tr class="bg-slate-50/70">
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-36">Laporan</td>
            <td class="py-1.5 px-3 font-bold text-slate-900">Setoran WiFi Induk</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-24">Periode</td>
            <td class="py-1.5 px-3 font-bold text-emerald-800">${monthLabel}</td>
          </tr>
          <tr>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Penyetor</td>
            <td class="py-1.5 px-3 font-semibold text-slate-800">Bendahara Komplek</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Tgl Bayar</td>
            <td class="py-1.5 px-3 font-mono text-slate-700">${wifiRec.tanggalBayar || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-xs border-collapse">
        <thead class="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
          <tr>
            <th class="py-2 px-2.5 text-center w-8">No</th>
            <th class="py-2 px-3 text-left">Keterangan</th>
            <th class="py-2 px-3 text-center">Status</th>
            <th class="py-2 px-3 text-right">Nominal</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">1</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Tarif WiFi Santri</td>
            <td class="py-2 px-3 text-center text-slate-500">Target: ${formatRp(targetWifiSantri)}</td>
            <td class="py-2 px-3 text-right font-mono font-bold text-slate-800">${formatRp(curTarif.wifi)} / santri</td>
          </tr>
          <tr class="bg-slate-50/50">
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">2</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Iuran Terkumpul</td>
            <td class="py-2 px-3 text-center font-bold text-emerald-800">${wifiPaidSantriCount}/${state.santri.length} Santri</td>
            <td class="py-2 px-3 text-right font-mono font-bold text-emerald-800">${formatRp(wifiCollectedMonth)}</td>
          </tr>
          <tr>
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">3</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Setoran WiFi Induk</td>
            <td class="py-2 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${wifiRec.status === 'paid' ? 'bg-emerald-50 text-emerald-800' : wifiRec.status === 'pending_confirm' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-600'}">${statusText}</span>
            </td>
            <td class="py-2 px-3 text-right font-mono font-bold text-slate-900">${formatRp(nominalInduk)}</td>
          </tr>
          <tr class="bg-emerald-50/40">
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">4</td>
            <td class="py-2 px-3 font-semibold text-emerald-950">Surplus Kas WiFi</td>
            <td class="py-2 px-3 text-center text-[11px] font-semibold text-emerald-800">Aktual: ${formatRp(aktualSisaKasWifi)}</td>
            <td class="py-2 px-3 text-right font-mono font-bold text-emerald-800">${formatRp(potensiSisaKasWifi)} / bln</td>
          </tr>
          <tr class="bg-slate-50/50">
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">5</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Catatan</td>
            <td colspan="2" class="py-2 px-3 text-right text-slate-700">${wifiRec.proofNote || 'Setoran bulanan WiFi induk'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    ${wifiRec.proofImg ? `
      <div class="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center space-y-1.5">
        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Bukti Pembayaran:</span>
        <img src="${wifiRec.proofImg}" alt="Bukti Pembayaran WiFi Induk" class="max-h-56 mx-auto rounded-lg border border-slate-200 bg-white object-contain" />
      </div>
    ` : `
      <div class="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 text-center text-[11px] text-slate-400">
        Belum ada bukti foto.
      </div>
    `}
  `;

  const waLines = [
    `*LAPORAN WIFI INDUK — ${monthLabel.toUpperCase()}*`,
    `• Status        : *${statusText}*`,
    `• Tanggal Bayar : ${wifiRec.tanggalBayar || '-'}`,
    `• Dana Masuk    : ${formatRp(wifiCollectedMonth)} (${wifiPaidSantriCount}/${state.santri.length} Santri)`,
    `• Setor Induk   : *${formatRp(nominalInduk)}*`,
    `• Sisa Kas WiFi : ${formatRp(aktualSisaKasWifi)}`,
    wifiRec.proofNote ? `• Catatan       : ${wifiRec.proofNote}` : ''
  ].filter(Boolean).join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(BENDAHARA_WA)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  syncNotaModalAdminButtons();
  document.getElementById('modalNota').classList.remove('hidden');
}

function closeNotaModal() {
  document.getElementById('modalNota').classList.add('hidden');
}

function copyWaText() {
  const el = document.getElementById('notaWaTextPreview');
  el.select();
  navigator.clipboard.writeText(el.value);
  showToast('Pesan disalin');
}

// =========================================================================
// SIARAN REKAP LENGKAP KE GRUP WHATSAPP (KHUSUS BENDAHARA)
// =========================================================================

let currentRekapGrupMode = 'santun';

function setRekapGrupMode(mode) {
  currentRekapGrupMode = mode === 'lengkap' ? 'lengkap' : 'santun';
  const btnSantun = document.getElementById('btnRekapModeSantun');
  const btnLengkap = document.getElementById('btnRekapModeLengkap');
  const hintEl = document.getElementById('rekapModeHintText');

  if (currentRekapGrupMode === 'santun') {
    if (btnSantun) btnSantun.className = 'py-2 px-3 rounded-lg bg-white text-slate-900 font-bold shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5';
    if (btnLengkap) btnLengkap.className = 'py-2 px-3 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition flex items-center justify-center gap-1.5';
    if (hintEl) {
      hintEl.className = 'text-[11px] text-emerald-800 bg-emerald-50/80 border border-emerald-100 rounded-xl px-3 py-2';
      hintEl.textContent = 'Menampilkan ringkasan kas dan daftar santri lunas (detail tunggakan disembunyikan).';
    }
  } else {
    if (btnLengkap) btnLengkap.className = 'py-2 px-3 rounded-lg bg-white text-slate-900 font-bold shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5';
    if (btnSantun) btnSantun.className = 'py-2 px-3 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer transition flex items-center justify-center gap-1.5';
    if (hintEl) {
      hintEl.className = 'text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-2';
      hintEl.textContent = 'Menampilkan daftar lengkap santri lunas dan rincian tunggakan.';
    }
  }

  const text = generateRekapGrupText(currentRekapGrupMode);
  const textArea = document.getElementById('rekapGrupWaText');
  if (textArea) textArea.value = text;
  const sendBtn = document.getElementById('btnSendGroupBroadcast');
  if (sendBtn) sendBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  if (window.lucide) window.lucide.createIcons();
}

function generateRekapGrupText(modeParam) {
  const mode = modeParam || currentRekapGrupMode || 'santun';
  const fin = calculateGlobalFinancials();
  const monthLabel = getMonthLabel(state.activeMonth);

  const lunasList = [];
  const nunggakList = [];

  state.santri.forEach(s => {
    const rec = getPaymentRecord(s.id, state.activeMonth);
    const sum = calculateRecordSummary(rec, state.activeMonth, s);
    if (sum.isFullLunas) {
      lunasList.push(`• ${s.nama} ✓`);
    } else {
      const itemsText = sum.unpaidItems.map(i => i.nama).join(', ');
      nunggakList.push(`• ${s.nama}: ${formatRp(sum.totalUnpaid)} (${itemsText})`);
    }
  });

  const activeLoans = state.utangKas.filter(u => u.status === 'belum_lunas');
  const loanTextLengkap = (mode === 'lengkap' && activeLoans.length > 0)
    ? `\n*Pinjaman Kas*\n` + activeLoans.map(u => {
        const s = state.santri.find(x => x.id === u.santriId);
        return `• ${s ? s.nama : 'Santri'}: ${formatRp(u.nominal)}`;
      }).join('\n')
    : '';

  const wifiRec = getBendaharaWifiRecord(state.activeMonth);
  const wifiStatusLabel = wifiRec.status === 'paid'
    ? 'Lunas ✓'
    : wifiRec.status === 'pending_confirm'
      ? 'Pending'
      : 'Belum Setor';

  const sectionNunggak = mode === 'santun'
    ? (nunggakList.length > 0
        ? `• ${nunggakList.length} santri belum lunas (cek rincian di web)`
        : '• Semua lunas ✓')
    : (nunggakList.length > 0 ? nunggakList.join('\n') : '• Semua lunas ✓');

  const lines = [
    `*REKAP KAS KOMPLEK TUBAN*`,
    `Periode: *${monthLabel}*`,
    ``,
    `• Terkumpul : *${formatRp(fin.activeMonthTotalSent)}*`,
    `• Tunggakan : *${formatRp(fin.activeMonthTunggakan)}*`,
    `• Saldo Kas : *${formatRp(fin.saldoKasTersedia)}*`,
    `• Saldo Dapur : *${formatRp(fin.saldoMasakTersedia)}*`,
    `• WiFi Induk : *${wifiStatusLabel}* (${formatRp(wifiRec.nominalBayar || TAGIHAN_WIFI_INDUK_DEFAULT)})`,
    ``,
    `*Sudah Lunas (${lunasList.length}/${state.santri.length})*`,
    lunasList.length > 0 ? lunasList.join('\n') : '• Belum ada',
    ``,
    `*Belum Lunas (${nunggakList.length})*`,
    sectionNunggak
  ];

  if (loanTextLengkap) {
    lines.push(loanTextLengkap);
  }

  lines.push(
    '',
    `Transfer DANA : *${state.nomorDanaBendahara || NOMOR_DANA_DEFAULT}*`,
    `Cek & upload bukti: https://paymojosari.my.id`
  );

  return lines.join('\n');
}

function openRekapGrupModal() {
  if (!state.isAdmin) {
    openAdminLoginModal('admin');
    showToast('Khusus Bendahara', 'amber');
    return;
  }
  document.getElementById('modalRekapGrupSubtitle').textContent = getMonthLabel(state.activeMonth);

  const inputLink = document.getElementById('inputLinkGrupWa');
  if (inputLink) inputLink.value = state.linkGrupWa || DEFAULT_GRUP_LINK;

  const btnDirectGroup = document.getElementById('btnBukaLinkGrupLangsung');
  if (btnDirectGroup) btnDirectGroup.href = state.linkGrupWa || DEFAULT_GRUP_LINK;

  setRekapGrupMode(currentRekapGrupMode || 'santun');
  document.getElementById('modalRekapGrup').classList.remove('hidden');
}

function ubahLinkGrupWa() {
  const currentLink = state.linkGrupWa || DEFAULT_GRUP_LINK;
  const input = prompt('Tempelkan tautan / link undangan grup WhatsApp Komplek Tuban Anda di sini (Cth: https://chat.whatsapp.com/...):', currentLink);
  if (input === null) return;
  const cleanLink = input.trim();
  if (!cleanLink.startsWith('http://') && !cleanLink.startsWith('https://')) {
    alert('Format tautan tidak valid! Pastikan diawali dengan https://chat.whatsapp.com/...');
    return;
  }
  state.linkGrupWa = cleanLink;
  saveState();
  const inputEl = document.getElementById('inputLinkGrupWa');
  if (inputEl) inputEl.value = cleanLink;
  const btnDirectGroup = document.getElementById('btnBukaLinkGrupLangsung');
  if (btnDirectGroup) btnDirectGroup.href = cleanLink;
  showToast('Link grup disimpan');
}

function closeRekapGrupModal() {
  document.getElementById('modalRekapGrup').classList.add('hidden');
}

function copyGroupWaText() {
  const el = document.getElementById('rekapGrupWaText');
  el.select();
  navigator.clipboard.writeText(el.value);
  showToast('Teks siaran disalin');
}

// =========================================================================
// FITUR 1 & 2: NOMOR DANA BENDAHARA, UPLOAD BUKTI TRANSFER SANTRI & VERIFIKASI 1-KLIK
// =========================================================================

function copyDanaNumber() {
  const danaNum = state.nomorDanaBendahara || NOMOR_DANA_DEFAULT;
  navigator.clipboard.writeText(danaNum);
  showToast('Nomor DANA disalin', 'emerald');
}

function openUploadBuktiSantriModal(santriIdParam, monthKeyParam) {
  if (state.userRole === 'guest') {
    openAdminLoginModal('santri');
    showToast('Silakan login santri', 'amber');
    return;
  }

  const targetSantriId = state.userRole === 'santri'
    ? (state.loggedSantriId || santriIdParam)
    : (santriIdParam || state.selectedSantriId);
  const mKey = monthKeyParam || state.activeMonth;
  const s = state.santri.find(x => x.id === targetSantriId) || state.santri[0];
  if (!s) return;

  const rec = getPaymentRecord(s.id, mKey);
  const tanpaMakan = isSantriTanpaMakan(s);

  currentBuktiSantriCtx = {
    santriId: s.id,
    monthKey: mKey,
    tempImgDataUrl: ''
  };

  const subEl = document.getElementById('modalBuktiSantriSubtitle');
  if (subEl) subEl.textContent = `${s.nama} • Periode ${getMonthLabel(mKey)}`;

  // Populate Pilihan Periode Yang Dibayar
  const selPer = document.getElementById('buktiSantriPeriodeSelect');
  if (selPer) {
    selPer.innerHTML = AVAILABLE_MONTHS.map(m =>
      `<option value="${m.key}" ${m.key === mKey ? 'selected' : ''}>${m.label}</option>`
    ).join('');
  }

  const danaEl = document.getElementById('modalBuktiNomorDanaText');
  if (danaEl) danaEl.textContent = state.nomorDanaBendahara || NOMOR_DANA_DEFAULT;

  const chkMakan = document.getElementById('chkBuktiMakan');
  const chkWifi = document.getElementById('chkBuktiWifi');
  const chkListrik = document.getElementById('chkBuktiListrik');
  const chkAir = document.getElementById('chkBuktiAir');
  const lblMakan = document.getElementById('lblBuktiMakanBox');

  if (chkMakan) {
    if (tanpaMakan) {
      chkMakan.checked = false;
      chkMakan.disabled = true;
      if (lblMakan) lblMakan.classList.add('opacity-50');
    } else {
      chkMakan.disabled = false;
      chkMakan.checked = !rec.makan;
      if (lblMakan) lblMakan.classList.remove('opacity-50');
    }
  }
  if (chkWifi) chkWifi.checked = !rec.wifi;
  if (chkListrik) chkListrik.checked = !rec.listrik;
  if (chkAir) chkAir.checked = !rec.air;

  // Jika semua sudah lunas tapi ingin upload bukti, centang semua komponen aktif
  if ((tanpaMakan || rec.makan) && rec.wifi && rec.listrik && rec.air) {
    if (chkMakan && !tanpaMakan) chkMakan.checked = true;
    if (chkWifi) chkWifi.checked = true;
    if (chkListrik) chkListrik.checked = true;
    if (chkAir) chkAir.checked = true;
  }

  recalcBuktiSantriNominal();

  const noteInput = document.getElementById('buktiSantriCatatanInput');
  if (noteInput) noteInput.value = `Transfer DANA ${state.nomorDanaBendahara || NOMOR_DANA_DEFAULT} (${getMonthLabel(mKey)})`;

  const fileInput = document.getElementById('buktiSantriFileInput');
  if (fileInput) fileInput.value = '';
  const preview = document.getElementById('buktiSantriPreviewImg');
  const empty = document.getElementById('buktiSantriEmptyState');
  if (preview) {
    preview.src = '';
    preview.classList.add('hidden');
  }
  if (empty) empty.classList.remove('hidden');

  setBuktiPaymentMethod('dana');

  const modal = document.getElementById('modalUploadBuktiSantri');
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeUploadBuktiSantriModal() {
  const modal = document.getElementById('modalUploadBuktiSantri');
  if (modal) modal.classList.add('hidden');
}

function setBuktiPaymentMethod(method) {
  currentBuktiSantriCtx.method = method;
  const btnDana = document.getElementById('btnMetodeTransferDana');
  const btnCash = document.getElementById('btnMetodeTunaiCash');
  const cardDana = document.getElementById('cardInfoDana');
  const cardCash = document.getElementById('cardInfoCash');
  const noteInput = document.getElementById('buktiSantriCatatanInput');
  const preview = document.getElementById('buktiSantriPreviewImg');
  const empty = document.getElementById('buktiSantriEmptyState');

  const s = state.santri.find(x => x.id === currentBuktiSantriCtx.santriId);
  const sName = s ? s.nama : 'Santri';
  const mKey = document.getElementById('buktiSantriPeriodeSelect')?.value || currentBuktiSantriCtx.monthKey || state.activeMonth;
  const mLabel = getMonthLabel(mKey);
  const nominal = Number(document.getElementById('buktiSantriNominalInput')?.value || 0);

  if (method === 'cash') {
    if (btnDana) {
      btnDana.className = 'p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer hover:bg-slate-100';
    }
    if (btnCash) {
      btnCash.className = 'p-2.5 rounded-xl border-2 border-amber-600 bg-amber-50 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs';
    }
    if (cardDana) cardDana.classList.add('hidden');
    if (cardCash) cardCash.classList.remove('hidden');

    if (noteInput && (!noteInput.value || noteInput.value.includes('Transfer DANA'))) {
      noteInput.value = `Bayar Tunai / Cash langsung ke Bendahara (${mLabel})`;
    }

    // Buat voucher SVG otomatis konfirmasi bayar tunai
    const svgUrl = createCashPaymentSvgDataUrl(sName, formatRp(nominal), mLabel);
    currentBuktiSantriCtx.tempImgDataUrl = svgUrl;
    if (preview) {
      preview.src = svgUrl;
      preview.classList.remove('hidden');
    }
    if (empty) empty.classList.add('hidden');
  } else {
    if (btnDana) {
      btnDana.className = 'p-2.5 rounded-xl border-2 border-[#064e3b] bg-emerald-50 text-[#064e3b] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs';
    }
    if (btnCash) {
      btnCash.className = 'p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer hover:bg-slate-100';
    }
    if (cardDana) cardDana.classList.remove('hidden');
    if (cardCash) cardCash.classList.add('hidden');

    if (noteInput && noteInput.value.includes('Bayar Tunai / Cash')) {
      noteInput.value = `Transfer DANA ${state.nomorDanaBendahara || NOMOR_DANA_DEFAULT} (${mLabel})`;
    }

    currentBuktiSantriCtx.tempImgDataUrl = '';
    if (preview) {
      preview.src = '';
      preview.classList.add('hidden');
    }
    if (empty) empty.classList.remove('hidden');
  }
}

function handleBuktiSantriPeriodeChange(newMonthKey) {
  if (!newMonthKey || !currentBuktiSantriCtx.santriId) return;
  openUploadBuktiSantriModal(currentBuktiSantriCtx.santriId, newMonthKey);
}

function recalcBuktiSantriNominal() {
  const mKey = currentBuktiSantriCtx.monthKey || state.activeMonth;
  const curTarif = getTarif(mKey);
  const chkMakan = document.getElementById('chkBuktiMakan');
  const chkWifi = document.getElementById('chkBuktiWifi');
  const chkListrik = document.getElementById('chkBuktiListrik');
  const chkAir = document.getElementById('chkBuktiAir');

  let total = 0;
  if (chkMakan && chkMakan.checked && !chkMakan.disabled) total += curTarif.makan;
  if (chkWifi && chkWifi.checked) total += curTarif.wifi;
  if (chkListrik && chkListrik.checked) total += curTarif.listrik;
  if (chkAir && chkAir.checked) total += curTarif.air;

  const lbl = document.getElementById('buktiSantriNominalLabel');
  if (lbl) lbl.textContent = formatRp(total);
  const nomInput = document.getElementById('buktiSantriNominalInput');
  if (nomInput) nomInput.value = total;

  if (currentBuktiSantriCtx.method === 'cash') {
    const s = state.santri.find(x => x.id === currentBuktiSantriCtx.santriId);
    const sName = s ? s.nama : 'Santri';
    const selMKey = document.getElementById('buktiSantriPeriodeSelect')?.value || mKey;
    const svgUrl = createCashPaymentSvgDataUrl(sName, formatRp(total), getMonthLabel(selMKey));
    currentBuktiSantriCtx.tempImgDataUrl = svgUrl;
    const preview = document.getElementById('buktiSantriPreviewImg');
    if (preview) preview.src = svgUrl;
  }
}

function handleBuktiSantriFilePreview(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Pilih file gambar bukti transfer (JPG/PNG/WebP)', 'amber');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const maxDim = 900;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

      currentBuktiSantriCtx.tempImgDataUrl = compressedDataUrl;
      const preview = document.getElementById('buktiSantriPreviewImg');
      const empty = document.getElementById('buktiSantriEmptyState');
      if (preview) {
        preview.src = compressedDataUrl;
        preview.classList.remove('hidden');
      }
      if (empty) empty.classList.add('hidden');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function handleSubmitBuktiTransferSantri(event) {
  event.preventDefault();
  const sId = currentBuktiSantriCtx.santriId;
  const targetPeriode = document.getElementById('buktiSantriPeriodeSelect')?.value || currentBuktiSantriCtx.monthKey || state.activeMonth;
  const s = state.santri.find(x => x.id === sId);
  if (!s) return;

  const nominal = Number(document.getElementById('buktiSantriNominalInput')?.value || 0);
  const metode = currentBuktiSantriCtx.method || 'dana';

  if (!currentBuktiSantriCtx.tempImgDataUrl) {
    if (metode === 'cash') {
      currentBuktiSantriCtx.tempImgDataUrl = createCashPaymentSvgDataUrl(s.nama, formatRp(nominal), getMonthLabel(targetPeriode));
    } else {
      showToast('Silakan pilih foto / screenshot bukti transfer DANA terlebih dahulu!', 'amber');
      return;
    }
  }

  const makan = Boolean(document.getElementById('chkBuktiMakan')?.checked && !document.getElementById('chkBuktiMakan')?.disabled);
  const wifi = Boolean(document.getElementById('chkBuktiWifi')?.checked);
  const listrik = Boolean(document.getElementById('chkBuktiListrik')?.checked);
  const air = Boolean(document.getElementById('chkBuktiAir')?.checked);

  if (!makan && !wifi && !listrik && !air) {
    showToast('Pilih minimal 1 komponen iuran yang dibayar!', 'amber');
    return;
  }

  const defaultCatatan = metode === 'cash'
    ? `Bayar Tunai / Cash langsung ke Bendahara (${getMonthLabel(targetPeriode)})`
    : `Transfer DANA ${state.nomorDanaBendahara || NOMOR_DANA_DEFAULT} (${getMonthLabel(targetPeriode)})`;
  const catatan = (document.getElementById('buktiSantriCatatanInput')?.value || '').trim() || defaultCatatan;
  const tanggal = new Date().toISOString().slice(0, 10);

  const newProof = {
    id: 'KB' + Date.now(),
    santriId: s.id,
    monthKey: targetPeriode,
    periode: targetPeriode,
    nominal,
    makan,
    wifi,
    listrik,
    air,
    metode,
    catatan,
    proofImg: currentBuktiSantriCtx.tempImgDataUrl,
    buktiFoto: currentBuktiSantriCtx.tempImgDataUrl,
    status: 'pending',
    tanggal
  };

  if (!Array.isArray(state.konfirmasiBayar)) state.konfirmasiBayar = [];
  // Hapus bukti pending lama untuk santri & bulan yang sama agar tidak duplikat
  state.konfirmasiBayar = state.konfirmasiBayar.filter(p => !(p.santriId === s.id && (p.monthKey === targetPeriode || p.periode === targetPeriode) && p.status === 'pending'));
  state.konfirmasiBayar.unshift(newProof);

  if (window.location.protocol !== 'file:') {
    try {
      await fetch('api.php?action=submit_payment_proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProof)
      });
    } catch (err) {
      console.warn('Gagal mengirim bukti pembayaran ke server:', err);
    }
  }

  saveState();
  closeUploadBuktiSantriModal();
  renderAll();
  showToast(metode === 'cash' ? `✓ Konfirmasi bayar tunai periode ${getMonthLabel(targetPeriode)} terkirim ke Bendahara!` : `✓ Bukti transfer DANA periode ${getMonthLabel(targetPeriode)} berhasil dikirim!`, 'emerald');
}

function renderPendingProofsForAdmin() {
  const boxPembayaran = document.getElementById('adminPendingProofsBox');
  const boxDash = document.getElementById('dashPendingProofsBox');

  if (!state.isAdmin) {
    if (boxPembayaran) { boxPembayaran.classList.add('hidden'); boxPembayaran.innerHTML = ''; }
    if (boxDash) { boxDash.classList.add('hidden'); boxDash.innerHTML = ''; }
    return;
  }

  const pendingList = (state.konfirmasiBayar || []).filter(p => p.status === 'pending');
  if (pendingList.length === 0) {
    if (boxPembayaran) { boxPembayaran.classList.add('hidden'); boxPembayaran.innerHTML = ''; }
    if (boxDash) { boxDash.classList.add('hidden'); boxDash.innerHTML = ''; }
    return;
  }

  const cardsHtml = pendingList.map(p => {
    const s = state.santri.find(x => x.id === p.santriId);
    const namaSantri = s ? s.nama : p.santriId;
    const mLabel = getMonthLabel(p.monthKey);
    const items = [];
    if (p.makan) items.push('Makan');
    if (p.wifi) items.push('WiFi');
    if (p.listrik) items.push('Listrik');
    if (p.air) items.push('Air');

    const isCash = p.metode === 'cash' || (p.catatan && (p.catatan.toLowerCase().includes('tunai') || p.catatan.toLowerCase().includes('cash')));
    const methodBadge = isCash
      ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300">💵 TUNAI / CASH</span>`
      : `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">📱 TRANSFER DANA</span>`;

    return `
      <div class="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <img src="${p.proofImg}" alt="Bukti" onclick="openPreviewBuktiBayarModal('${p.id}')" class="w-12 h-12 rounded-xl object-cover border border-amber-200 cursor-pointer hover:opacity-80 shrink-0 bg-slate-100" title="Klik untuk lihat bukti" />
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs font-extrabold text-slate-900">${namaSantri}</span>
              ${methodBadge}
              <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900">${mLabel}</span>
            </div>
            <div class="text-[11px] font-mono font-bold text-emerald-800 mt-0.5">${formatRp(p.nominal)} <span class="font-sans font-normal text-slate-500">(${items.join(', ')})</span></div>
            <p class="text-[10px] text-slate-400 truncate">${p.tanggal} • ${p.catatan || (isCash ? 'Tunai' : 'DANA')}</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button type="button" onclick="openPreviewBuktiBayarModal('${p.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer">
            Lihat
          </button>
          <button type="button" onclick="approveBuktiTransferSantri('${p.id}')" class="px-3 py-1.5 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-[11px] font-bold cursor-pointer shadow-2xs flex items-center gap-1">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            <span>${isCash ? 'Terima Uang' : 'Terima'}</span>
          </button>
          <button type="button" onclick="rejectBuktiTransferSantri('${p.id}')" class="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold cursor-pointer">
            Tolak
          </button>
        </div>
      </div>
    `;
  }).join('');

  const wrapperHtml = `
    <div class="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-3 shadow-xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-amber-950">Verifikasi Pembayaran Santri (${pendingList.length})</h4>
        </div>
        <span class="text-[10px] font-semibold text-amber-800">Menunggu konfirmasi Bendahara</span>
      </div>
      <div class="space-y-2">
        ${cardsHtml}
      </div>
    </div>
  `;

  if (boxPembayaran) {
    boxPembayaran.innerHTML = wrapperHtml;
    boxPembayaran.classList.remove('hidden');
  }
  if (boxDash) {
    boxDash.innerHTML = wrapperHtml;
    boxDash.classList.remove('hidden');
  }
}

async function approveBuktiTransferSantri(proofId) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const proof = (state.konfirmasiBayar || []).find(p => p.id === proofId);
  if (!proof) return;

  const s = state.santri.find(x => x.id === proof.santriId);
  const rec = getPaymentRecord(proof.santriId, proof.monthKey);
  const tanpaMakan = isSantriTanpaMakan(s || proof.santriId);

  if (!tanpaMakan && proof.makan) rec.makan = true;
  if (proof.wifi) rec.wifi = true;
  if (proof.listrik) rec.listrik = true;
  if (proof.air) rec.air = true;

  const isCash = proof.metode === 'cash' || (proof.catatan && (proof.catatan.toLowerCase().includes('tunai') || proof.catatan.toLowerCase().includes('cash')));
  const metodeLabel = isCash ? 'Tunai (Cash)' : 'Transfer DANA';
  rec.metode = isCash ? 'cash' : 'dana';
  rec.catatan = proof.catatan || `Bayar ${metodeLabel}`;
  rec.updatedAt = new Date().toISOString().slice(0, 10);

  proof.status = 'approved';

  state.recentTransactions.unshift({
    id: 'T' + Date.now(),
    title: s ? s.nama : 'Santri',
    subtitle: `${metodeLabel} (${getMonthLabel(proof.monthKey)})`,
    type: 'income',
    amount: Number(proof.nominal || 0),
    date: 'Hari ini',
    status: 'Completed',
    icon: isCash ? 'banknote' : 'wallet'
  });

  if (window.location.protocol !== 'file:') {
    try {
      await fetch('api.php?action=verify_payment_proof', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id: proof.id, status: 'approved' })
      });
    } catch (err) {
      console.warn('Gagal verifikasi ke server:', err);
    }
  }

  closePreviewBuktiBayarModal();
  saveState();
  renderAll();
  showToast(`✓ Pembayaran ${metodeLabel} ${s ? s.nama : 'Santri'} diterima & LUNAS!`, 'emerald');
}

async function rejectBuktiTransferSantri(proofId) {
  if (!state.isAdmin) {
    openAdminLoginModal();
    return;
  }
  const proof = (state.konfirmasiBayar || []).find(p => p.id === proofId);
  if (!proof) return;
  if (!confirm('Tolak bukti transfer ini?')) return;

  proof.status = 'rejected';

  if (window.location.protocol !== 'file:') {
    try {
      await fetch('api.php?action=verify_payment_proof', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ id: proof.id, status: 'rejected' })
      });
    } catch (err) {
      console.warn('Gagal update status tolak ke server:', err);
    }
  }

  closePreviewBuktiBayarModal();
  saveState();
  renderAll();
  showToast('Bukti transfer ditolak', 'amber');
}

function openPreviewBuktiBayarModal(proofId) {
  const proof = (state.konfirmasiBayar || []).find(p => p.id === proofId);
  if (!proof) return;
  const s = state.santri.find(x => x.id === proof.santriId);
  const items = [];
  if (proof.makan) items.push('Makan');
  if (proof.wifi) items.push('WiFi');
  if (proof.listrik) items.push('Listrik');
  if (proof.air) items.push('Air');

  const subEl = document.getElementById('previewBuktiBayarSubtitle');
  if (subEl) subEl.textContent = `${s ? s.nama : proof.santriId} • ${getMonthLabel(proof.monthKey)}`;

  const imgEl = document.getElementById('previewBuktiBayarImg');
  if (imgEl) imgEl.src = proof.proofImg || '';

  const infoEl = document.getElementById('previewBuktiBayarInfo');
  if (infoEl) {
    infoEl.innerHTML = `
      <div><strong>Santri:</strong> ${s ? s.nama : proof.santriId}</div>
      <div><strong>Periode:</strong> ${getMonthLabel(proof.monthKey)} (${proof.tanggal})</div>
      <div><strong>Nominal & Komponen:</strong> <span class="font-mono font-bold text-emerald-800">${formatRp(proof.nominal)}</span> (${items.join(', ')})</div>
      <div><strong>Catatan:</strong> ${proof.catatan || '-'}</div>
    `;
  }

  const actionsEl = document.getElementById('previewBuktiBayarAdminActions');
  if (actionsEl) {
    if (state.isAdmin && proof.status === 'pending') {
      actionsEl.innerHTML = `
        <button type="button" onclick="approveBuktiTransferSantri('${proof.id}')" class="flex-1 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold cursor-pointer">
          ✓ Terima & Lunasi Sekarang
        </button>
        <button type="button" onclick="rejectBuktiTransferSantri('${proof.id}')" class="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer">
          Tolak
        </button>
      `;
    } else {
      actionsEl.innerHTML = '';
    }
  }

  const modal = document.getElementById('modalPreviewBuktiBayar');
  if (modal) modal.classList.remove('hidden');
}

function closePreviewBuktiBayarModal() {
  const modal = document.getElementById('modalPreviewBuktiBayar');
  if (modal) modal.classList.add('hidden');
}

// =========================================================================
// FITUR 4: EXPORT LAPORAN BULANAN KE EXCEL (.XLS) & CETAK LPJ RESMI (PDF)
// =========================================================================

function exportLpjExcel() {
  if (!state.isAdmin) {
    openAdminLoginModal('admin');
    showToast('Export Laporan Excel khusus untuk Bendahara', 'amber');
    return;
  }

  const fin = calculateGlobalFinancials();
  const mKey = state.activeMonth;
  const mLabel = getMonthLabel(mKey);
  const curTarif = getTarif(mKey);

  const rowsSantri = state.santri.map((s, idx) => {
    const rec = getPaymentRecord(s.id, mKey);
    const sum = calculateRecordSummary(rec, mKey, s);
    return `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td>${s.nama}</td>
        <td>${s.prodi}</td>
        <td style="text-align:center;">${sum.tanpaMakan ? 'Tanpa Makan' : (rec.makan ? 'Lunas' : 'Belum')}</td>
        <td style="text-align:center;">${rec.wifi ? 'Lunas' : 'Belum'}</td>
        <td style="text-align:center;">${rec.listrik ? 'Lunas' : 'Belum'}</td>
        <td style="text-align:center;">${rec.air ? 'Lunas' : 'Belum'}</td>
        <td style="text-align:right;">${sum.targetSantri}</td>
        <td style="text-align:right;">${sum.totalPaid}</td>
        <td style="text-align:right;">${sum.totalUnpaid}</td>
        <td style="text-align:center;">${sum.isFullLunas ? 'LUNAS' : 'BELUM LUNAS'}</td>
      </tr>
    `;
  }).join('');

  const rowsKasUmum = (state.kasUmumLogs || []).map((k, idx) => `
    <tr>
      <td style="text-align:center;">${idx + 1}</td>
      <td>${k.tanggal}</td>
      <td>${k.kategori || 'Lain-lain'}</td>
      <td>${k.keterangan}</td>
      <td>${k.tipe.toUpperCase()}</td>
      <td style="text-align:right;">${k.nominal}</td>
    </tr>
  `).join('');

  const htmlExcel = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 11pt; }
        th, td { border: 1px solid #333333; padding: 6px 8px; }
        th { background-color: #064e3b; color: #ffffff; font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>LAPORAN PERTANGGUNGJAWABAN (LPJ) KAS & SYAHRIYAH KOMPLEK TUBAN</h2>
      <p><strong>Pondok Pesantren Mojosari Loceret Nganjuk — Periode: ${mLabel}</strong></p>
      <p>Saldo Kas Komplek Tersedia: <strong>${formatRp(fin.saldoKasTersedia)}</strong> | Saldo Kas Dapur: <strong>${formatRp(fin.saldoMasakTersedia)}</strong> | Nomor DANA: <strong>${state.nomorDanaBendahara || NOMOR_DANA_DEFAULT}</strong></p>

      <h3>A. Matriks Pembayaran Syahriyah Santri (${mLabel})</h3>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Santri</th>
            <th>Program Studi</th>
            <th>Makan (${formatRp(curTarif.makan)})</th>
            <th>WiFi (${formatRp(curTarif.wifi)})</th>
            <th>Listrik (${formatRp(curTarif.listrik)})</th>
            <th>Air (${formatRp(curTarif.air)})</th>
            <th>Target (Rp)</th>
            <th>Terbayar (Rp)</th>
            <th>Tunggakan (Rp)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsSantri}
        </tbody>
      </table>

      <br/>
      <h3>B. Riwayat Pengeluaran & Pemasukan Kas Umum Komplek</h3>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Kategori</th>
            <th>Keterangan</th>
            <th>Jenis</th>
            <th>Nominal (Rp)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsKasUmum || '<tr><td colspan="6" style="text-align:center;">Belum ada transaksi kas umum</td></tr>'}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlExcel], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LPJ_Kas_Komplek_Tuban_${mKey}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`✓ File Excel LPJ ${mLabel} berhasil diunduh!`, 'emerald');
}

function openModalLpjResmi(monthKeyParam) {
  if (!state.isAdmin) {
    openAdminLoginModal('admin');
    showToast('Cetak LPJ Resmi khusus untuk Bendahara', 'amber');
    return;
  }

  if (monthKeyParam && monthKeyParam !== state.activeMonth) {
    state.activeMonth = monthKeyParam;
    const select = document.getElementById('globalMonthSelect');
    if (select) select.value = monthKeyParam;
    const mobileSelect = document.getElementById('mobileMonthSelect');
    if (mobileSelect) mobileSelect.value = monthKeyParam;
    renderAll();
  }

  const fin = calculateGlobalFinancials();
  const mKey = monthKeyParam || state.activeMonth;
  const mLabel = getMonthLabel(mKey);
  const wifiRec = getBendaharaWifiRecord(mKey);

  document.getElementById('modalNotaHeaderTitle').textContent = `LPJ Resmi Komplek Tuban — ${mLabel}`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = 'LPJ RESMI';
  badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200';
  document.getElementById('notaTimestamp').textContent = new Date().toISOString().slice(0, 10);

  const santriRowsHtml = state.santri.map((s, idx) => {
    const rec = getPaymentRecord(s.id, mKey);
    const sum = calculateRecordSummary(rec, mKey, s);
    return `
      <tr class="${idx % 2 === 1 ? 'bg-slate-50/60' : ''}">
        <td class="py-1.5 px-2 text-center font-mono text-slate-400">${idx + 1}</td>
        <td class="py-1.5 px-2.5 font-semibold text-slate-900">${s.nama} ${sum.tanpaMakan ? '<span class="text-[9px] text-amber-700">(Tanpa Makan)</span>' : ''}</td>
        <td class="py-1.5 px-2 text-center">${sum.tanpaMakan ? '-' : (rec.makan ? '✓' : '✗')}</td>
        <td class="py-1.5 px-2 text-center">${rec.wifi ? '✓' : '✗'}</td>
        <td class="py-1.5 px-2 text-center">${rec.listrik ? '✓' : '✗'}</td>
        <td class="py-1.5 px-2 text-center">${rec.air ? '✓' : '✗'}</td>
        <td class="py-1.5 px-2.5 text-right font-mono font-bold text-emerald-800">${formatRp(sum.totalPaid)}</td>
        <td class="py-1.5 px-2.5 text-right font-mono ${sum.totalUnpaid > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${formatRp(sum.totalUnpaid)}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
        <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
          <div class="text-slate-500">Terkumpul (${mLabel})</div>
          <div class="font-mono font-extrabold text-emerald-800 text-xs mt-0.5">${formatRp(fin.activeMonthTotalSent)}</div>
        </div>
        <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
          <div class="text-slate-500">Tunggakan (${mLabel})</div>
          <div class="font-mono font-extrabold text-rose-600 text-xs mt-0.5">${formatRp(fin.activeMonthTunggakan)}</div>
        </div>
        <div class="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
          <div class="text-emerald-800">Saldo Kas Komplek</div>
          <div class="font-mono font-extrabold text-emerald-950 text-xs mt-0.5">${formatRp(fin.saldoKasTersedia)}</div>
        </div>
        <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
          <div class="text-slate-500">Saldo Kas Dapur</div>
          <div class="font-mono font-extrabold text-slate-900 text-xs mt-0.5">${formatRp(fin.saldoMasakTersedia)}</div>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200">
        <table class="w-full text-[11px] border-collapse">
          <thead class="bg-slate-900 text-white text-[10px] uppercase font-bold">
            <tr>
              <th class="py-1.5 px-2 text-center w-7">No</th>
              <th class="py-1.5 px-2.5 text-left">Nama Santri</th>
              <th class="py-1.5 px-2 text-center">Mkn</th>
              <th class="py-1.5 px-2 text-center">WiFi</th>
              <th class="py-1.5 px-2 text-center">Lstrk</th>
              <th class="py-1.5 px-2 text-center">Air</th>
              <th class="py-1.5 px-2.5 text-right">Dibayar</th>
              <th class="py-1.5 px-2.5 text-right">Kurang</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${santriRowsHtml}
          </tbody>
        </table>
      </div>

      <div class="pt-3 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200">
        <div>
          <p class="font-bold text-slate-800">Mengetahui,</p>
          <p class="text-[10px] text-slate-500">Ketua Komplek Tuban</p>
          <div class="h-10"></div>
          <p class="font-bold text-slate-900 underline">( Pengurus Komplek Tuban )</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-slate-800">Nganjuk, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p class="text-[10px] text-slate-500">Bendahara Komplek Tuban</p>
          <div class="h-10"></div>
          <p class="font-bold text-emerald-900 underline">( Bendahara Komplek Tuban )</p>
        </div>
      </div>
    </div>
  `;

  const waText = generateRekapGrupText('santun');
  document.getElementById('notaWaTextPreview').value = waText;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(BENDAHARA_WA)}?text=${encodeURIComponent(waText)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;

  syncNotaModalAdminButtons();
  document.getElementById('modalNota').classList.remove('hidden');
}

// =========================================================================
// FITUR 3: PWA INSTALL & SERVICE WORKER
// =========================================================================

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
  const btnDesktop = document.getElementById('btnInstallPwaDesktop');
  const btnMobile = document.getElementById('btnInstallPwaMobile');
  if (btnDesktop) btnDesktop.classList.remove('hidden');
  if (btnMobile) btnMobile.classList.remove('hidden');
});

async function triggerInstallPwa() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('✓ Aplikasi PayMojosari berhasil di-install di perangkat Anda!', 'emerald');
    }
    deferredPwaPrompt = null;
  } else {
    showToast('Untuk install di HP: Buka menu browser (⋮ atau Share) lalu pilih "Tambahkan ke Layar Utama / Install Aplikasi"', 'emerald');
  }
}

// =========================================================================
// FITUR: PINDAH PERIODE PEMBAYARAN SANTRI (KOREKSI / ADVANCE PAYMENT)
// =========================================================================

let currentMovePaymentCtx = {
  santriId: null,
  fromMonthKey: null
};

function openMovePaymentModal(santriId, fromMonthKey) {
  if (!state.isAdmin) {
    showToast('Hanya Bendahara yang dapat memindahkan periode pembayaran', 'amber');
    return;
  }
  const s = state.santri.find(x => x.id === santriId);
  if (!s) return;
  const fromKey = fromMonthKey || state.activeMonth;
  const rec = getPaymentRecord(s.id, fromKey);
  const sum = calculateRecordSummary(rec, fromKey, s);

  if (sum.totalPaid <= 0) {
    showToast('Santri ini belum memiliki pembayaran tercatat di periode ini', 'amber');
    return;
  }

  currentMovePaymentCtx = {
    santriId: s.id,
    fromMonthKey: fromKey
  };

  const nameEl = document.getElementById('modalMoveSantriName');
  if (nameEl) nameEl.textContent = s.nama;
  const fromEl = document.getElementById('modalMoveFromLabel');
  if (fromEl) fromEl.textContent = getMonthLabel(fromKey);

  const compList = [];
  if (rec.makan) compList.push('Makan');
  if (rec.wifi) compList.push('WiFi');
  if (rec.listrik) compList.push('Listrik');
  if (rec.air) compList.push('Air');
  const detEl = document.getElementById('modalMoveDetails');
  if (detEl) detEl.textContent = `Dibayar: ${compList.join(', ')} (${formatRp(sum.totalPaid)})`;

  const sel = document.getElementById('modalMoveTargetSelect');
  if (sel) {
    sel.innerHTML = AVAILABLE_MONTHS
      .filter(m => m.key !== fromKey)
      .map(m => `<option value="${m.key}">${m.label}</option>`)
      .join('');
    // Default ke bulan berikutnya jika tersedia
    const nextMonthIdx = AVAILABLE_MONTHS.findIndex(m => m.key === fromKey) + 1;
    if (nextMonthIdx < AVAILABLE_MONTHS.length) {
      sel.value = AVAILABLE_MONTHS[nextMonthIdx].key;
    }
  }

  const modal = document.getElementById('modalMovePaymentPeriod');
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeMovePaymentModal() {
  const modal = document.getElementById('modalMovePaymentPeriod');
  if (modal) modal.classList.add('hidden');
}

async function handleExecuteMovePayment(e) {
  if (e) e.preventDefault();
  const { santriId, fromMonthKey } = currentMovePaymentCtx;
  if (!santriId || !fromMonthKey) return;

  const targetSelect = document.getElementById('modalMoveTargetSelect');
  const toMonthKey = targetSelect ? targetSelect.value : null;
  if (!toMonthKey || toMonthKey === fromMonthKey) {
    showToast('Pilih bulan tujuan yang berbeda', 'amber');
    return;
  }

  const s = state.santri.find(x => x.id === santriId);
  const sName = s ? s.nama : 'Santri';
  const fromRecord = getPaymentRecord(santriId, fromMonthKey);
  const targetRecord = getPaymentRecord(santriId, toMonthKey);

  // Pindahkan status bayar
  targetRecord.makan = fromRecord.makan;
  targetRecord.wifi = fromRecord.wifi;
  targetRecord.listrik = fromRecord.listrik;
  targetRecord.air = fromRecord.air;
  targetRecord.updatedAt = new Date().toISOString().slice(0, 10);

  // Kosongkan di periode asal
  fromRecord.makan = false;
  fromRecord.wifi = false;
  fromRecord.listrik = false;
  fromRecord.air = false;
  fromRecord.updatedAt = '-';

  // Simpan ke state
  state.pembayaran[`${santriId}_${toMonthKey}`] = { ...targetRecord };
  state.pembayaran[`${santriId}_${fromMonthKey}`] = { ...fromRecord };

  // Perbarui bukti transfer jika ada
  (state.konfirmasiBayar || []).forEach(kb => {
    if (kb.santriId === santriId && (kb.monthKey === fromMonthKey || kb.periode === fromMonthKey)) {
      kb.monthKey = toMonthKey;
      kb.periode = toMonthKey;
    }
  });

  saveState();

  // Panggil endpoint backend API
  try {
    if (window.location.protocol !== 'file:' && state.isAdmin) {
      await fetch('api.php?action=move_payment_period', {
        method: 'POST',
        credentials: 'same-origin',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          santri_id: santriId,
          from_periode: fromMonthKey,
          to_periode: toMonthKey
        })
      });
    }
  } catch (err) {
    console.warn('Gagal memindahkan via API:', err);
  }

  closeMovePaymentModal();
  renderAll();
  showToast(`✓ Pembayaran ${sName} berhasil dipindahkan ke ${getMonthLabel(toMonthKey)}!`, 'emerald');
}

// =========================================================================
// FITUR: TAMPILAN ARUS KAS & SALDO BERGULIR
// =========================================================================

function renderCashFlowRecap() {
  const cashFlowBody = document.getElementById('dashboardCashFlowRecapBody');
  if (!cashFlowBody) return;

  const rolls = getMonthlyCashFlowRollForward();
  cashFlowBody.innerHTML = rolls.map(r => {
    const isCur = r.key === state.activeMonth;
    return `
      <tr class="${isCur ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'} transition">
        <td class="py-2.5 px-3 cursor-pointer" onclick="selectDashboardMonth('${r.key}')">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900">${r.label}</span>
            ${isCur ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#064e3b] text-white uppercase">Aktif</span>` : ''}
          </div>
        </td>
        <td class="py-2.5 px-3 text-right font-mono text-slate-600">${formatRp(r.saldoAwalTotal)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">${formatRp(r.totalMasukMakan)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-rose-600">${formatRp(r.pengeluaranMasak)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">${formatRp(r.totalMasukKasUmum)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-rose-600">${formatRp(r.pengeluaranKasUmum + r.setoranWifiInduk)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-amber-800">${formatRp(r.saldoAkhirMakan)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-teal-800">${formatRp(r.saldoAkhirKasUmum)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-black text-emerald-950 bg-emerald-50/50">${formatRp(r.saldoAkhirTotal)}</td>
      </tr>
    `;
  }).join('');
}

function switchRecapTab(tab) {
  const btnIuran = document.getElementById('btnTabRecapIuran');
  const btnCashFlow = document.getElementById('btnTabRecapCashFlow');
  const wrapIuran = document.getElementById('wrapTableIuranRecap');
  const wrapCashFlow = document.getElementById('wrapTableCashFlowRecap');

  if (tab === 'cashflow') {
    if (btnIuran) btnIuran.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer text-slate-600 hover:text-slate-900';
    if (btnCashFlow) btnCashFlow.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer bg-white text-slate-900 shadow-2xs';
    if (wrapIuran) wrapIuran.classList.add('hidden');
    if (wrapCashFlow) wrapCashFlow.classList.remove('hidden');
  } else {
    if (btnIuran) btnIuran.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer bg-white text-slate-900 shadow-2xs';
    if (btnCashFlow) btnCashFlow.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer text-slate-600 hover:text-slate-900';
    if (wrapIuran) wrapIuran.classList.remove('hidden');
    if (wrapCashFlow) wrapCashFlow.classList.add('hidden');
  }
}

// =========================================================================
// BOOTSTRAP
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initControls();
  switchTab(state.activeTab || 'pembayaran');

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
