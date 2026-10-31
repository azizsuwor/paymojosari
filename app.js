// =========================================================================
// SIM-KAS & UANG MAKAN — PP. MOJOSARI LOCERET NGANJUK
// KOMPLEK TUBAN (RUMAH WAKAF)
// FINPILOT DESIGN ADAPTATION (100% VISUAL & INTERACTION PARITY)
// =========================================================================

const STORAGE_KEY = 'SIMKAS_MOJOSARI_FINPILOT_V13';
const BENDAHARA_WA = '081231256129';
const DEFAULT_GRUP_LINK = 'https://chat.whatsapp.com/LgVFDhgRgHmDTuC3tCly7c';

const TARIF_DEFAULT = {
  makan: 50000,
  wifi: 20000,
  listrik: 20000,
  air: 10000
};

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

const DEFAULT_SANTRI = [
  { id: 's1', nama: 'Muhammad Abdul Aziz', shortName: 'Aziz', alamat: 'Lampung', prodi: 'Sistem Informasi', wa: '081231256129', tanpaMakan: true, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's2', nama: 'Rahmat Taufik', shortName: 'Taufik', alamat: 'Rejoso', prodi: 'Sistem Informasi', wa: '0891209269', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's3', nama: 'Nailul Author Ahmad', shortName: 'Nailul', alamat: 'Boyolali', prodi: 'Sistem Informasi', wa: '082136066882', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's4', nama: 'Raihan Chayin', shortName: 'Raihan', alamat: 'Ngawi', prodi: 'Sistem Informasi', wa: '082331491897', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's5', nama: 'Angga Sanjaya', shortName: 'Angga', alamat: 'Purworejo', prodi: 'Sistem Informasi', wa: '083821865361', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's6', nama: 'Ahmad Dimas Nasrulloh', shortName: 'Dimas', alamat: 'Sidoarjo', prodi: 'Sistem Informasi', wa: '085645259514', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's7', nama: 'Ahmad Lukman Hakim', shortName: 'Lukman', alamat: 'Rejoso', prodi: 'Sistem Informasi', wa: '083849858925', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's8', nama: 'Riyadlus Sholikhin', shortName: 'Riyad', alamat: 'Loceret', prodi: 'Sistem Informasi', wa: '08318726592', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's9', nama: 'Muhammad Saiful Anam', shortName: 'Anam', alamat: 'Sawahan', prodi: 'Sistem Informasi', wa: '082146282076', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's10', nama: 'Ahmad Fathony Sidqan', shortName: 'Fathony', alamat: 'Berbek', prodi: 'Sistem Informasi', wa: '0895414997822', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's11', nama: 'Muhammad Nasikhul Umam', shortName: 'Umam', alamat: 'Loceret', prodi: 'Pendidikan Teknologi Informasi', wa: '085710272496', tanpaMakan: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's12', nama: 'Alwi Shihab Azzuhry', shortName: 'Alwi', alamat: 'Jambi', prodi: 'Pendidikan Teknologi Informasi', wa: '082294423387', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's13', nama: 'Muhammad Choirul Anwar', shortName: 'Anwar', alamat: 'Sawahan', prodi: 'Pendidikan Teknologi Informasi', wa: '081770092651', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's14', nama: 'Manshur Siroj', shortName: 'Manshur', alamat: 'Rejoso', prodi: 'Pendidikan Teknologi Informasi', wa: '085335219903', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's15', nama: 'Fadli Hibatulloh Ahmad', shortName: 'Fadli', alamat: 'Kudus', prodi: 'Teknik Industri', wa: '0887766847234', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's16', nama: 'Muhammad Rasyid Fathoni', shortName: 'Rasyid', alamat: 'Madiun', prodi: 'Akuntansi Bisnis Digital', wa: '082143460969', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' },
  { id: 's17', nama: 'Ahmad Zuhdi Affabillah', shortName: 'Zuhdi', alamat: 'Ngeronggot', prodi: 'Akuntansi Bisnis Digital', wa: '085704414868', tanpaMakan: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80' }
];

let state = {
  activeMonth: '2026-10',
  activeTab: 'pembayaran', // Defaulting to Payments tab matching FinPilot
  selectedSantriId: 's1',  // Selected in Quick Transfer
  quickMode: 'full',       // 'full' (100k) | 'makan' (50k) | 'wifi' (manual)
  linkGrupWa: DEFAULT_GRUP_LINK,
  santri: JSON.parse(JSON.stringify(DEFAULT_SANTRI)),
  tarifWifiPerBulan: buildDefaultTarifMap(),
  pembayaran: {},
  setoranWifiBendahara: {},
  masakLogs: [],
  utangKas: [],
  recentTransactions: []
};

let currentWifiModalCtx = {
  monthKey: null,
  tempImgDataUrl: ''
};

let currentSantriPhotoUrl = '';

// Avatar profile placeholder pictures matching FinPilot's clean avatars
const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'
];

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

function getInitialDemoState() {
  return {
    activeMonth: '2026-10',
    activeTab: 'pembayaran',
    selectedSantriId: 's1',
    quickMode: 'full',
    linkGrupWa: DEFAULT_GRUP_LINK,
    santri: JSON.parse(JSON.stringify(DEFAULT_SANTRI)),
    tarifWifiPerBulan: buildDefaultTarifMap(),
    pembayaran: {},
    setoranWifiBendahara: {},
    masakLogs: [],
    utangKas: [],
    recentTransactions: []
  };
}

function purgeOldMonthsFromState() {
  if (!AVAILABLE_MONTHS.some(m => m.key === state.activeMonth)) {
    state.activeMonth = START_MONTH_KEY;
  }
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
    } else {
      state = getInitialDemoState();
      saveState(true);
    }
    purgeOldMonthsFromState();
    if (!state.selectedSantriId && state.santri.length > 0) {
      state.selectedSantriId = state.santri[0].id;
    }
  } catch (e) {
    console.error('Gagal memuat state:', e);
    state = getInitialDemoState();
  }
  syncFromBackend();
}

async function syncFromBackend() {
  if (window.location.protocol === 'file:') return;
  try {
    const res = await fetch('api.php?action=get_all');
    if (!res.ok) return;
    const json = await res.json();
    if (json && json.status === 'success' && json.data) {
      const d = json.data;
      if (Array.isArray(d.santri)) {
        state.santri = d.santri;
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
            state.setoranWifiBendahara[k] = {
              ...item,
              proofImg: item.proofImg || existingImg || createSampleWifiChatDataUrl(getMonthLabel(k), formatRp(item.nominalBayar || 120000))
            };
          });
        }
      }
      if (Array.isArray(d.masakLogs)) {
        state.masakLogs = d.masakLogs;
      }
      if (Array.isArray(d.utangKas)) {
        state.utangKas = d.utangKas;
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
  if (!skipRemote && window.location.protocol !== 'file:') {
    fetch('api.php?action=sync_all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  const currentTarif = getTarif(monthKey);
  if (!state.setoranWifiBendahara[monthKey]) {
    state.setoranWifiBendahara[monthKey] = {
      status: 'unpaid',
      proofImg: '',
      proofNote: '',
      tanggalBayar: '2026-10-30',
      nominalBayar: state.santri.length * currentTarif.wifi
    };
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

  const totalUtangAktif = state.utangKas
    .filter(u => u.status === 'belum_lunas')
    .reduce((acc, u) => acc + Number(u.nominal), 0);

  const totalUtangLunas = state.utangKas
    .filter(u => u.status === 'lunas')
    .reduce((acc, u) => acc + Number(u.nominal), 0);

  const saldoKasTersedia = totalKasCollectedAllTime - totalUtangAktif;

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
// UI CONTROLS & ROUTING
// =========================================================================

function initControls() {
  const select = document.getElementById('globalMonthSelect');
  select.innerHTML = AVAILABLE_MONTHS.map(m =>
    `<option value="${m.key}" ${m.key === state.activeMonth ? 'selected' : ''}>${m.label}</option>`
  ).join('');

  select.onchange = (e) => {
    state.activeMonth = e.target.value;
    saveState(true);
    renderAll();
  };

  const today = '2026-10-30';
  const masakDate = document.getElementById('masakTanggal');
  if (masakDate && !masakDate.value) masakDate.value = today;

  const utangDate = document.getElementById('utangTanggal');
  if (utangDate && !utangDate.value) utangDate.value = today;
}

function switchTab(tabName) {
  state.activeTab = tabName;
  saveState(true);

  // Hide all panels
  document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(`view-${tabName}`);
  if (target) target.classList.remove('hidden');

  // Reset all nav buttons to inactive
  document.querySelectorAll('nav button').forEach(btn => {
    btn.className = 'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer font-medium text-[13px]';
  });

  // Activate selected nav button (FinPilot dark green pill)
  const activeBtn = document.getElementById(`nav-${tabName}`);
  if (activeBtn) {
    activeBtn.className = 'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full transition-all bg-[#064e3b] text-white font-semibold shadow-xs cursor-pointer text-[13px]';
  }

  // Update Page Header Title
  const titles = {
    pembayaran: 'Payments',
    dashboard: 'Dashboard',
    tunggakan: 'Arrears & Invoices',
    masak: 'Kitchen Expenses',
    utang: 'Student Cash Loans',
    santri: 'Students Directory'
  };
  const titleEl = document.getElementById('pageHeadingTitle');
  if (titleEl) titleEl.textContent = titles[tabName] || 'Payments';

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
      ? `Full Kas (${curTarif.totalKas / 1000}rb)`
      : `Full (${curTarif.totalBulanan / 1000}rb)`;
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

function handleQuickSubmitPayment() {
  if (!state.selectedSantriId) {
    showToast('Silakan pilih salah satu santri di deretan avatar!', 'amber');
    return;
  }
  const s = state.santri.find(x => x.id === state.selectedSantriId);
  const tanpaMakan = isSantriTanpaMakan(s || state.selectedSantriId);
  const rec = getPaymentRecord(state.selectedSantriId, state.activeMonth);
  const note = document.getElementById('quickNoteInput')?.value || '';
  const curTarif = getTarif(state.activeMonth);

  if (state.quickMode === 'makan' && tanpaMakan) {
    showToast(`${s ? s.nama : 'Santri ini'} terdaftar Tanpa Uang Makan (Hanya Kas Komplek)!`, 'amber');
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
    desc = tanpaMakan ? 'Iuran Kas Komplek Lunas (Tanpa Uang Makan)' : 'Iuran Syahriyah Lunas';
  } else if (state.quickMode === 'makan') {
    rec.makan = true;
    amt = curTarif.makan;
    desc = 'Pembayaran Uang Makan';
  } else if (state.quickMode === 'wifi') {
    rec.wifi = true;
    amt = curTarif.wifi;
    desc = 'Pembayaran Kas WiFi Manual';
  }

  rec.updatedAt = new Date().toISOString().slice(0, 10);

  // Push to recent transactions
  state.recentTransactions.unshift({
    id: 'T' + Date.now(),
    title: s ? s.nama : 'Santri',
    subtitle: note ? `${desc} (${note})` : desc,
    type: 'income',
    amount: amt,
    date: 'Hari ini',
    status: 'Completed',
    icon: 'wallet'
  });

  saveState();
  if (document.getElementById('quickNoteInput')) {
    document.getElementById('quickNoteInput').value = '';
  }
  renderAll();
  showToast(`Berhasil mencatat pembayaran untuk ${s ? s.nama : ''}!`);
}

// =========================================================================
// RENDERERS (MATCHING 100% FINPILOT VIEW)
// =========================================================================

function renderAll() {
  const fin = calculateGlobalFinancials();
  const curTarif = getTarif(state.activeMonth);

  // Metrics Bar (Payments Tab & Dashboard Tab)
  const monthLabelShort = getMonthLabel(state.activeMonth);
  if (document.getElementById('mMonthBadge')) document.getElementById('mMonthBadge').textContent = monthLabelShort;
  if (document.getElementById('dashMonthBadge')) document.getElementById('dashMonthBadge').textContent = monthLabelShort;
  if (document.getElementById('dashActiveMonthTitle')) document.getElementById('dashActiveMonthTitle').textContent = monthLabelShort;

  document.getElementById('mTotalSent').textContent = formatRp(fin.activeMonthTotalSent);
  const pctSent = fin.activeMonthTarget > 0 ? Math.round((fin.activeMonthTotalSent / fin.activeMonthTarget) * 100) : 0;
  document.getElementById('mTotalSentPct').innerHTML = `<i data-lucide="arrow-up" class="w-3 h-3"></i> ${pctSent}%`;

  document.getElementById('mPending').textContent = formatRp(fin.activeMonthTunggakan);
  const pctPending = fin.activeMonthTarget > 0 ? Math.round((fin.activeMonthTunggakan / fin.activeMonthTarget) * 100) : 0;
  document.getElementById('mPendingPct').innerHTML = `<i data-lucide="arrow-down" class="w-3 h-3"></i> ${pctPending}%`;

  document.getElementById('mScheduled').textContent = formatRp(fin.saldoKasTersedia);
  const activeLoanCount = state.utangKas.filter(u => u.status === 'belum_lunas').length;
  document.getElementById('mFailed').textContent = formatRp(fin.totalUtangAktif);
  document.getElementById('mFailedSub').textContent = `${activeLoanCount} Santri Utang`;

  // Sync Dashboard Top Cards
  if (document.getElementById('dashTotalSent')) {
    document.getElementById('dashTotalSent').textContent = formatRp(fin.activeMonthTotalSent);
    document.getElementById('dashTotalSentPct').textContent = `${pctSent}%`;
    document.getElementById('dashPending').textContent = formatRp(fin.activeMonthTunggakan);
    document.getElementById('dashPendingPct').textContent = `${pctPending}%`;
    document.getElementById('dashScheduled').textContent = formatRp(fin.saldoKasTersedia);
    document.getElementById('dashFailed').textContent = formatRp(fin.totalUtangAktif);
    document.getElementById('dashFailedSub').textContent = `${activeLoanCount} Santri Utang`;
  }

  // Payment Limits Widget
  document.getElementById('limitDailyRatio').textContent = `${formatRp(fin.activeMonthTotalSent)} / ${formatRp(fin.activeMonthTarget)}`;
  document.getElementById('limitDailyBar').style.width = `${Math.min(100, pctSent)}%`;

  const wifiTarget = state.santri.length * curTarif.wifi;
  const wifiPct = wifiTarget > 0 ? Math.round((fin.activeMonthWifi / wifiTarget) * 100) : 0;
  document.getElementById('limitMonthlyRatio').textContent = `${formatRp(fin.activeMonthWifi)} / ${formatRp(wifiTarget)}`;
  document.getElementById('limitMonthlyBar').style.width = `${Math.min(100, wifiPct)}%`;

  // Status Setoran WiFi Induk Widget
  const wifiRecActive = getBendaharaWifiRecord(state.activeMonth);
  const widgetWifiBadge = document.getElementById('widgetWifiIndukBadge');
  if (widgetWifiBadge) {
    if (wifiRecActive.status === 'paid') {
      widgetWifiBadge.textContent = `✓ Lunas (${formatRp(wifiRecActive.nominalBayar)})`;
      widgetWifiBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200';
    } else if (wifiRecActive.status === 'pending_confirm') {
      widgetWifiBadge.textContent = `Menunggu Konfirmasi (${formatRp(wifiRecActive.nominalBayar)})`;
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
  renderScheduledPayments();
  renderRecentPayments();
  renderDashboardTab(fin);
  renderTunggakanTab(fin);
  renderMasakTab(fin);
  renderUtangTab(fin);
  renderSantriTab();

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
        <div class="relative w-11 h-11 rounded-full p-0.5 ${isSelected ? 'ring-2 ring-[#064e3b] ring-offset-2' : 'group-hover:opacity-80'} transition-all">
          <img src="${s.avatar || AVATAR_IMAGES[idx % AVATAR_IMAGES.length]}" alt="${s.nama}" class="w-full h-full rounded-full object-cover" />
          ${isSelected ? `<span class="absolute bottom-0 right-0 w-3 h-3 bg-[#064e3b] border-2 border-white rounded-full"></span>` : ''}
        </div>
        <span class="text-[11px] font-semibold text-slate-700">${s.shortName || s.nama.split(' ')[0]}</span>
      </div>
    `;
  }).join('');

  const addNewBtn = `
    <div onclick="switchTab('santri')" class="flex flex-col items-center gap-1.5 cursor-pointer shrink-0">
      <div class="w-11 h-11 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition">
        <i data-lucide="plus" class="w-4 h-4"></i>
      </div>
      <span class="text-[11px] font-semibold text-slate-400">Add New</span>
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
  const avatarUrl = s.avatar || AVATAR_IMAGES[idx % AVATAR_IMAGES.length];

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
          <img src="${avatarUrl}" alt="${s.nama}" class="w-full h-full object-cover object-center" style="aspect-ratio: 3/4;" onerror="this.src='${AVATAR_IMAGES[0]}'" />
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

function renderActiveKartuSantriWidget() {
  const widget = document.getElementById('activeKartuSantriWidget');
  if (!widget) return;

  const s = state.santri.find(x => x.id === state.selectedSantriId) || state.santri[0];
  if (!s) {
    widget.innerHTML = `<div class="text-xs text-slate-400 text-center py-4">Belum ada santri dipilih</div>`;
    return;
  }
  const idx = state.santri.findIndex(x => x.id === s.id);

  widget.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900 font-display">Kartu Identitas Santri</h3>
        <p class="text-[11px] text-slate-400">Identitas santri mukim Komplek Tuban</p>
      </div>
      <div class="flex items-center gap-1.5">
        <button type="button" onclick="openKartuSantriModal('${s.id}')" class="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold cursor-pointer transition">
          Cetak Kartu
        </button>
        <button type="button" onclick="openSemuaKartuSantriModal()" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer transition">
          Semua (17)
        </button>
      </div>
    </div>
    ${buildKartuSantriVisualHtml(s, idx >= 0 ? idx : 0, false)}
  `;
}

// 2. Render Scheduled Payments (Netflix Subscription / Monthly Rent / Gym style)
function renderScheduledPayments(searchFilter = '') {
  const container = document.getElementById('scheduledPaymentsList');
  if (!container) return;

  const q = searchFilter.toLowerCase();
  const list = state.santri.filter(s => {
    return s.nama.toLowerCase().includes(q) || s.prodi.toLowerCase().includes(q);
  });

  if (list.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs">Tidak ada data santri</div>`;
    return;
  }

  container.innerHTML = list.map(s => {
    const rec = getPaymentRecord(s.id, state.activeMonth);
    const sum = calculateRecordSummary(rec, state.activeMonth, s);

    return `
      <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
        <div class="flex items-center gap-3.5 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <i data-lucide="calendar" class="w-4 h-4 text-slate-500"></i>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-slate-900 truncate">${s.nama} (${s.prodi.split(' ')[0]}) ${sum.tanpaMakan ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Makan</span>` : ''}</h4>
            <p class="text-[11px] text-slate-400 truncate">${sum.tanpaMakan ? 'Iuran Kas Komplek (Tanpa Uang Makan)' : 'Iuran Syahriyah'} • ${getMonthLabel(state.activeMonth)}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right">
            <div class="text-xs font-bold text-slate-900 font-mono">${formatRp(sum.totalPaid)}</div>
            ${sum.totalUnpaid > 0 ? `<div class="text-[10px] text-rose-500 font-semibold">Kurang ${formatRp(sum.totalUnpaid)}</div>` : ''}
          </div>

          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${sum.isFullLunas ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
            ${sum.isFullLunas ? 'Active' : 'Pending'}
          </span>

          <div class="flex items-center gap-1">
            <button onclick="openNotaPembayaranModal('${s.id}', '${state.activeMonth}')" title="Nota Lunas" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-800 hover:bg-slate-100 cursor-pointer">
              <i data-lucide="receipt" class="w-4 h-4"></i>
            </button>
            <button onclick="openNotaTunggakanSantriModal('${s.id}')" title="Kirim Tagihan WA" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 cursor-pointer">
              <i data-lucide="send" class="w-4 h-4"></i>
            </button>
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

  container.innerHTML = state.recentTransactions.slice(0, 6).map(tx => {
    const isInc = tx.type === 'income';
    const statusColor = tx.status === 'Completed' ? 'text-emerald-800 font-medium' : tx.status === 'Pending' ? 'text-amber-500 font-medium' : 'text-rose-500 font-medium';

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
          <div class="text-[10px] ${statusColor}">${tx.status}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Render Dashboard Tab Matrix & Monthly Recap
function toggleComponentPayment(santriId, monthKey, field) {
  if (field === 'makan' && isSantriTanpaMakan(santriId)) {
    showToast('Santri ini terdaftar Tanpa Uang Makan (Hanya Kas Komplek)', 'amber');
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
  saveState(true);
  renderAll();
}

function openRekapGrupForMonth(monthKey) {
  state.activeMonth = monthKey;
  const select = document.getElementById('globalMonthSelect');
  if (select) select.value = monthKey;
  saveState(true);
  renderAll();
  openRekapGrupModal();
}

function resetBulanIni(monthKeyParam) {
  const mKey = monthKeyParam || state.activeMonth;
  const mLabel = getMonthLabel(mKey);
  if (!confirm(`Reset / kosongkan semua pembayaran pada bulan ${mLabel} menjadi Rp 0 (Belum Bayar)?`)) return;

  state.santri.forEach(s => {
    const key = `${s.id}_${mKey}`;
    delete state.pembayaran[key];
  });
  delete state.setoranWifiBendahara[mKey];

  saveState();
  renderAll();
  showToast(`Data pembayaran bulan ${mLabel} berhasil di-reset ke Rp 0`);
}

function resetSemuaKeNol() {
  if (!confirm('Reset seluruh pembayaran di semua bulan, kas masak, dan utang kas menjadi Rp 0 (Data Santri tetap tersimpan)?')) return;
  state.pembayaran = {};
  state.setoranWifiBendahara = {};
  state.masakLogs = [];
  state.utangKas = [];
  state.recentTransactions = [];
  saveState();
  renderAll();
  showToast('Seluruh data keuangan berhasil di-reset ke Rp 0 & disinkronkan ke MySQL!');
}

function renderDashboardTab(fin) {
  // 1. Render Laporan Pembayaran WiFi Induk Bulan Aktif
  const wifiSummaryBox = document.getElementById('dashWifiIndukSummaryBox');
  if (wifiSummaryBox) {
    const wifiRec = getBendaharaWifiRecord(state.activeMonth);
    const curTarif = getTarif(state.activeMonth);
    const statusLabel = wifiRec.status === 'paid'
      ? '✓ LUNAS DISETOR KE PEMILIK WIFI'
      : wifiRec.status === 'pending_confirm'
        ? 'MENUNGGU KONFIRMASI (BUKTI DIUPLOAD)'
        : 'BELUM DISETOR KE PEMILIK WIFI';
    const statusClass = wifiRec.status === 'paid'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : wifiRec.status === 'pending_confirm'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-rose-50 text-rose-600 border-rose-200';

    wifiSummaryBox.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
        <div class="lg:col-span-8 overflow-x-auto">
          <table class="w-full text-xs border-collapse">
            <tbody class="divide-y divide-slate-200/70">
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold w-44">Status Setoran WiFi Induk</td>
                <td class="py-1.5">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusClass}">${statusLabel}</span>
                </td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold">Nominal Tagihan WiFi Induk</td>
                <td class="py-1.5 font-mono font-bold text-slate-900">${formatRp(wifiRec.nominalBayar || 0)} <span class="text-[10px] font-normal text-slate-400">(Tarif Santri: ${formatRp(curTarif.wifi)}/santri)</span></td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold">Kas WiFi Terkumpul (Santri)</td>
                <td class="py-1.5 font-mono font-bold text-emerald-800">${formatRp(fin.activeMonthWifi)} <span class="text-[10px] font-normal text-slate-500">(${fin.activeMonthWifiSantriCount}/${state.santri.length} Santri Lunas WiFi)</span></td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-semibold">Tanggal Bayar & Catatan</td>
                <td class="py-1.5 text-slate-700"><span class="font-mono font-semibold">${wifiRec.tanggalBayar || '-'}</span> • ${wifiRec.proofNote || 'Belum ada catatan setoran WiFi induk'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="lg:col-span-4 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl p-3 bg-white text-center">
          ${wifiRec.proofImg
            ? `<img src="${wifiRec.proofImg}" alt="Bukti Setoran WiFi Induk" onclick="openNotaWifiIndukModal('${state.activeMonth}')" class="max-h-28 rounded-lg object-contain border border-slate-200 cursor-pointer hover:opacity-90 transition" title="Klik untuk perbesar di Nota Laporan WiFi" />
               <span class="text-[10px] font-bold text-emerald-800 mt-1.5">✓ Bukti Chat/Transfer Terlampir</span>`
            : `<div class="py-4 text-[11px] text-slate-400">Belum ada foto bukti chat/transfer WiFi induk</div>`
          }
        </div>
      </div>
    `;
  }

  // 2. Render Tabel Rekapitulasi Bulanan
  const recapBody = document.getElementById('dashboardMonthlyRecapBody');
  if (recapBody) {
    recapBody.innerHTML = AVAILABLE_MONTHS.map(m => {
      const mTarif = getTarif(m.key);
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
      const isCurrent = m.key === state.activeMonth;
      const wRec = getBendaharaWifiRecord(m.key);
      const wifiStatusBadge = wRec.status === 'paid'
        ? `<span onclick="openNotaWifiIndukModal('${m.key}')" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer">✓ Lunas (${formatRp(wRec.nominalBayar)})</span>`
        : wRec.status === 'pending_confirm'
          ? `<span onclick="openNotaWifiIndukModal('${m.key}')" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 cursor-pointer">Pending (${formatRp(wRec.nominalBayar)})</span>`
          : `<span onclick="openBendaharaWifiModal('${m.key}')" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer">Belum Setor</span>`;

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

  const matrixBody = document.getElementById('dashboardMatrixBody');
  if (!matrixBody) return;

  if (state.santri.length === 0) {
    matrixBody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400 text-xs">Belum ada data santri. Klik menu <button onclick="switchTab('santri')" class="font-bold text-emerald-800 hover:underline cursor-pointer">Data Santri</button> untuk menambahkan santri baru.</td></tr>`;
    return;
  }

  matrixBody.innerHTML = state.santri.map(s => {
    const rec = getPaymentRecord(s.id, state.activeMonth);
    const sum = calculateRecordSummary(rec, state.activeMonth, s);

    const badge = (paid, field) => paid
      ? `<button onclick="toggleComponentPayment('${s.id}', '${state.activeMonth}', '${field}')" title="Klik untuk ubah status" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer">✓ Lunas</button>`
      : `<button onclick="toggleComponentPayment('${s.id}', '${state.activeMonth}', '${field}')" title="Klik untuk ubah status" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer">Belum</button>`;

    const makanBadge = sum.tanpaMakan
      ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200" title="Santri ini tanpa Uang Makan (Hanya Kas Komplek)">Tanpa Makan</span>`
      : badge(rec.makan, 'makan');

    return `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="py-3 px-3">
          <div class="font-bold text-slate-900">${s.nama} ${sum.tanpaMakan ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Uang Makan</span>` : ''}</div>
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
            <button onclick="openNotaPembayaranModal('${s.id}', '${state.activeMonth}')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer">
              Nota
            </button>
            <button onclick="openNotaTunggakanSantriModal('${s.id}')" class="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold cursor-pointer">
              WA
            </button>
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

  const mode = document.getElementById('filterTunggakanMode')?.value || 'nunggak';
  const rows = [];

  state.santri.forEach(s => {
    const monthDetails = fin.monthsToCheck.map(mKey => {
      const rec = getPaymentRecord(s.id, mKey);
      const sum = calculateRecordSummary(rec, mKey, s);
      return { monthKey: mKey, monthLabel: getMonthLabel(mKey), rec, sum };
    });

    const totalArrears = monthDetails.reduce((acc, d) => acc + d.sum.totalUnpaid, 0);
    const activeLoans = state.utangKas.filter(u => u.santriId === s.id && u.status === 'belum_lunas');
    const totalUtang = activeLoans.reduce((acc, u) => acc + Number(u.nominal), 0);
    const grandTotal = totalArrears + totalUtang;

    if (mode === 'nunggak' && grandTotal === 0) return;
    if (mode === 'lunas' && grandTotal > 0) return;

    rows.push({ santri: s, monthDetails, totalArrears, activeLoans, totalUtang, grandTotal });
  });

  if (rows.length === 0) {
    listEl.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">Tidak ada data tunggakan.</div>`;
    return;
  }

  listEl.innerHTML = rows.map(r => `
    <div class="p-4 rounded-2xl border ${r.grandTotal === 0 ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 bg-white'} shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-xs font-bold text-slate-900">${r.santri.nama} ${isSantriTanpaMakan(r.santri) ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Uang Makan</span>` : ''} • <span class="text-slate-400 font-normal">${r.santri.prodi}</span></h4>
          <p class="text-[11px] text-slate-500">WA: <span class="font-mono">${r.santri.wa}</span></p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold font-mono ${r.grandTotal === 0 ? 'text-emerald-800' : 'text-rose-600'}">
            ${r.grandTotal === 0 ? 'LUNAS SEMUA BULAN' : `Total Tunggakan: ${formatRp(r.grandTotal)}`}
          </span>
          <button onclick="openNotaTunggakanSantriModal('${r.santri.id}')" class="px-3 py-1.5 rounded-xl bg-[#064e3b] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>Kirim WA</span>
          </button>
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

// 7. Render Utang Kas
function handleSaveUtangKas(event) {
  event.preventDefault();
  const santriId = document.getElementById('utangSantriId').value;
  const tanggal = document.getElementById('utangTanggal').value;
  const nominal = Number(document.getElementById('utangNominal').value);
  const keterangan = document.getElementById('utangKeterangan').value.trim();

  if (!santriId || !nominal || !keterangan) return;

  state.utangKas.unshift({
    id: 'U' + Date.now(),
    santriId,
    tanggal,
    nominal,
    keterangan,
    status: 'belum_lunas',
    tanggalLunas: null
  });

  const s = state.santri.find(x => x.id === santriId);
  state.recentTransactions.unshift({
    id: 'T' + Date.now(),
    title: `Utang Kas: ${s ? s.nama : 'Santri'}`,
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
  showToast('Utang kas santri berhasil dicatat');
}

function markUtangLunas(id) {
  const item = state.utangKas.find(u => u.id === id);
  if (!item) return;
  item.status = 'lunas';
  item.tanggalLunas = new Date().toISOString().slice(0, 10);
  saveState();
  renderAll();
  showToast('Utang santri lunas & kas telah kembali');
}

function renderUtangTab(finData) {
  const fin = finData || calculateGlobalFinancials();
  const badge = document.getElementById('rekapUtangAktifBadge');
  if (badge) badge.textContent = `Total Utang: ${formatRp(fin.totalUtangAktif)}`;

  const sel = document.getElementById('utangSantriId');
  if (sel) {
    const cur = sel.value;
    sel.innerHTML = state.santri.map(s =>
      `<option value="${s.id}" ${s.id === cur ? 'selected' : ''}>${s.nama} (${s.prodi})</option>`
    ).join('');
  }

  const tbody = document.getElementById('utangTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.utangKas.map(u => {
    const s = state.santri.find(x => x.id === u.santriId);
    return `
      <tr class="hover:bg-slate-50">
        <td class="py-2.5 px-3 font-mono text-slate-500">${u.tanggal}</td>
        <td class="py-2.5 px-3 font-bold text-slate-900">${s ? s.nama : 'Santri'}</td>
        <td class="py-2.5 px-3 text-slate-600">${u.keterangan}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${formatRp(u.nominal)}</td>
        <td class="py-2.5 px-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'lunas' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-600'}">
            ${u.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
          </span>
        </td>
        <td class="py-2.5 px-3 text-right">
          ${u.status === 'belum_lunas' ? `
            <button onclick="markUtangLunas('${u.id}')" class="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer">
              Lunasi
            </button>
          ` : ''}
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
  const randIdx = Math.floor(Math.random() * AVATAR_IMAGES.length);
  currentSantriPhotoUrl = AVATAR_IMAGES[randIdx];
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = currentSantriPhotoUrl;
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';
  showToast('Avatar acak dipilih');
}

function handleResetFotoSantri() {
  currentSantriPhotoUrl = AVATAR_IMAGES[0];
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = currentSantriPhotoUrl;
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';
  showToast('Foto dikembalikan ke default');
}

function handleSaveSantri(event) {
  event.preventDefault();
  const editId = document.getElementById('editSantriId').value;
  const nama = document.getElementById('santriNama').value.trim();
  const alamat = document.getElementById('santriAlamat').value.trim();
  const prodi = document.getElementById('santriProdi').value;
  const wa = document.getElementById('santriWa').value.trim();
  const tanpaMakan = Boolean(document.getElementById('santriTanpaMakan')?.checked);

  if (!nama || !alamat || !prodi || !wa) return;

  if (editId) {
    const idx = state.santri.findIndex(s => s.id === editId);
    if (idx !== -1) {
      const existing = state.santri[idx];
      const avatar = currentSantriPhotoUrl || existing.avatar || AVATAR_IMAGES[idx % AVATAR_IMAGES.length];
      state.santri[idx] = { 
        ...existing, 
        nama, 
        alamat, 
        prodi, 
        wa, 
        tanpaMakan, 
        avatar, 
        shortName: nama.split(' ')[0] 
      };
    }
  } else {
    const newId = 's' + (state.santri.length + 1);
    const avatar = currentSantriPhotoUrl || AVATAR_IMAGES[state.santri.length % AVATAR_IMAGES.length];
    state.santri.push({ 
      id: newId, 
      nama, 
      alamat, 
      prodi, 
      wa, 
      tanpaMakan, 
      avatar, 
      shortName: nama.split(' ')[0] 
    });
    if (!state.selectedSantriId) {
      state.selectedSantriId = newId;
    }
  }

  saveState();
  resetSantriForm();
  renderAll();
  showToast('Data & foto santri berhasil disimpan');
}

function editSantri(id) {
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
  currentSantriPhotoUrl = s.avatar || AVATAR_IMAGES[idx >= 0 ? idx % AVATAR_IMAGES.length : 0];
  const preview = document.getElementById('santriPhotoPreview');
  if (preview) preview.src = currentSantriPhotoUrl;
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';

  document.getElementById('formSantriTitle').textContent = 'Edit Data Santri';
  document.getElementById('btnSaveSantriText').textContent = 'Simpan Perubahan';
  document.getElementById('btnCancelEditSantri').classList.remove('hidden');

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
  if (preview) preview.src = AVATAR_IMAGES[0];
  const fileInput = document.getElementById('santriPhotoFile');
  if (fileInput) fileInput.value = '';

  document.getElementById('formSantriTitle').textContent = 'Daftarkan Santri Baru';
  document.getElementById('btnSaveSantriText').textContent = 'Simpan Santri';
  document.getElementById('btnCancelEditSantri').classList.add('hidden');
}

function deleteSantri(id) {
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
    tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 text-xs">Belum ada data santri. Silakan isi form di samping untuk mendaftarkan santri baru.</td></tr>`;
    if (cardsGrid) cardsGrid.innerHTML = `<div class="col-span-full py-6 text-center text-slate-400 text-xs">Belum ada kartu santri.</div>`;
    return;
  }

  tbody.innerHTML = state.santri.map((s, idx) => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="py-2.5 px-3 font-bold text-slate-900">
        <div class="flex items-center gap-2.5">
          <img src="${s.avatar || AVATAR_IMAGES[idx % AVATAR_IMAGES.length]}" alt="${s.nama}" class="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100" onerror="this.src='${AVATAR_IMAGES[0]}'" />
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span>${s.nama}</span>
              ${isSantriTanpaMakan(s) ? `<span class="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">Tanpa Uang Makan</span>` : ''}
            </div>
            <div class="text-[10px] font-mono text-slate-400 font-normal">${getNomorIndukSantri(s, idx)}</div>
          </div>
        </div>
      </td>
      <td class="py-2.5 px-3 text-slate-500">${s.alamat}</td>
      <td class="py-2.5 px-3 text-slate-600">${s.prodi}</td>
      <td class="py-2.5 px-3 font-mono text-slate-500">${s.wa}</td>
      <td class="py-2.5 px-3 text-right whitespace-nowrap">
        <button onclick="openKartuSantriModal('${s.id}')" class="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold mr-1.5 cursor-pointer">Kartu</button>
        <button onclick="editSantri('${s.id}')" class="text-xs font-semibold text-slate-600 hover:text-slate-900 mr-2 cursor-pointer">Edit</button>
        <button onclick="deleteSantri('${s.id}')" class="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer">Hapus</button>
      </td>
    </tr>
  `).join('');

  if (cardsGrid) {
    cardsGrid.innerHTML = state.santri.map((s, idx) => buildKartuSantriVisualHtml(s, idx, true)).join('');
  }
}

function openKartuSantriModal(santriId) {
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
    `*KARTU IDENTITAS SANTRI KOMPLEK TUBAN*`,
    `*PONDOK PESANTREN MOJOSARI LOCERET NGANJUK*`,
    `====================================`,
    `No. Induk    : *${nis}*`,
    `Nama Santri  : *${s.nama}*`,
    `Program Studi: ${s.prodi}`,
    `Alamat Asal  : ${s.alamat}`,
    `No. WhatsApp : ${s.wa}`,
    `Komplek      : Komplek Tuban (Rumah Wakaf)`,
    `Status       : *SANTRI MUKIM AKTIF*`,
    `====================================`,
    `Kartu ini merupakan tanda identitas resmi santri mukim Komplek Tuban (Rumah Wakaf) PP. Mojosari.`
  ].join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(s.wa)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  document.getElementById('modalNota').classList.remove('hidden');
}

function openSemuaKartuSantriModal() {
  document.getElementById('modalNotaHeaderTitle').textContent = `Cetak Kolektif Kartu Identitas Santri (${state.santri.length} Santri)`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = `${state.santri.length} KARTU IDENTITAS`;
  badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200';
  document.getElementById('notaTimestamp').textContent = 'Komplek Tuban • PP. Mojosari';

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="grid grid-cols-1 gap-3">
      ${state.santri.map((s, idx) => buildKartuSantriVisualHtml(s, idx, false)).join('')}
    </div>
  `;

  const listLines = state.santri.map((s, idx) => {
    return `${idx + 1}. [${getNomorIndukSantri(s, idx)}] *${s.nama}* — ${s.prodi} (${s.alamat})`;
  });

  const waLines = [
    `*DAFTAR KARTU IDENTITAS SANTRI KOMPLEK TUBAN (RUMAH WAKAF)*`,
    `*PONDOK PESANTREN MOJOSARI LOCERET NGANJUK*`,
    `====================================`,
    ...listLines,
    `====================================`,
    `Total: *${state.santri.length} Santri Mukim Aktif*`
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
  const curTarif = getTarif(monthKey);
  currentWifiModalCtx = { monthKey, tempImgDataUrl: wifiRec.proofImg || '' };

  document.getElementById('modalWifiSubtitle').textContent = `Periode: ${getMonthLabel(monthKey)}`;
  document.getElementById('wifiProofDateInput').value = wifiRec.tanggalBayar || '2026-10-30';
  document.getElementById('wifiProofNominalInput').value = wifiRec.nominalBayar || (state.santri.length * curTarif.wifi);
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
  const curTarif = getTarif(currentWifiModalCtx.monthKey);
  const nominalVal = Number(document.getElementById('wifiProofNominalInput').value) || (state.santri.length * curTarif.wifi);
  const sampleUrl = createSampleWifiChatDataUrl(monthLabel, formatRp(nominalVal));

  currentWifiModalCtx.tempImgDataUrl = sampleUrl;
  const preview = document.getElementById('wifiProofPreviewImg');
  const empty = document.getElementById('wifiProofEmptyState');
  preview.src = sampleUrl;
  preview.classList.remove('hidden');
  empty.classList.add('hidden');

  const noteInput = document.getElementById('wifiProofNoteInput');
  if (!noteInput.value) {
    noteInput.value = `Bendahara transfer bayar WiFi ke Pak H. Mahmud (${monthLabel})`;
  }
}

function saveWifiProofOnly() {
  if (!currentWifiModalCtx.tempImgDataUrl) {
    showToast('Pilih foto bukti atau gunakan contoh screenshot!', 'amber');
    return;
  }
  const curTarif = getTarif(currentWifiModalCtx.monthKey);
  const wifiRec = getBendaharaWifiRecord(currentWifiModalCtx.monthKey);
  wifiRec.proofImg = currentWifiModalCtx.tempImgDataUrl;
  wifiRec.proofNote = document.getElementById('wifiProofNoteInput').value.trim() || 'Foto bukti chat bayar WiFi diupload';
  wifiRec.tanggalBayar = document.getElementById('wifiProofDateInput').value || '2026-10-30';
  wifiRec.nominalBayar = Number(document.getElementById('wifiProofNominalInput').value) || (state.santri.length * curTarif.wifi);
  wifiRec.status = 'pending_confirm';

  saveState();
  closeWifiModal();
  renderAll();
  showToast('Bukti chat WiFi disimpan');
}

function confirmWifiPaidWithProof() {
  if (!currentWifiModalCtx.tempImgDataUrl) {
    showToast('Wajib ada foto bukti chat bayar WiFi ke pemilik WiFi!', 'amber');
    return;
  }
  const curTarif = getTarif(currentWifiModalCtx.monthKey);
  const wifiRec = getBendaharaWifiRecord(currentWifiModalCtx.monthKey);
  wifiRec.proofImg = currentWifiModalCtx.tempImgDataUrl;
  wifiRec.proofNote = document.getElementById('wifiProofNoteInput').value.trim() || 'Setoran lunas dikonfirmasi Bendahara';
  wifiRec.tanggalBayar = document.getElementById('wifiProofDateInput').value || '2026-10-30';
  wifiRec.nominalBayar = Number(document.getElementById('wifiProofNominalInput').value) || (state.santri.length * curTarif.wifi);
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

  const padCol = (str, len) => String(str).padEnd(len, ' ');
  const waLines = [
    `*NOTA PEMBAYARAN SYAHRIYAH*`,
    `*PP. MOJOSARI — KOMPLEK TUBAN (RUMAH WAKAF)*`,
    `====================================`,
    `Nama Santri : *${s.nama}*${sum.tanpaMakan ? ' _(Tanpa Uang Makan)_' : ''}`,
    `Prodi       : ${s.prodi}`,
    `Periode     : *${monthLabel}*`,
    `====================================`,
    `*TABEL RINCIAN KOMPONEN IURAN:*`,
    '```',
    `${padCol('No Komponen', 15)} | ${padCol('Status', 7)} | Nominal`,
    `-------------------------------------`,
    `${padCol('1. Uang Makan', 15)} | ${padCol(sum.tanpaMakan ? 'BEBAS' : (rec.makan ? 'LUNAS' : 'BELUM'), 7)} | ${sum.tanpaMakan ? 'Rp 0 (Tanpa Makan)' : formatRp(curTarif.makan)}`,
    `${padCol('2. Kas WiFi', 15)} | ${padCol(rec.wifi ? 'LUNAS' : 'BELUM', 7)} | ${formatRp(curTarif.wifi)}`,
    `${padCol('3. Kas Listrik', 15)} | ${padCol(rec.listrik ? 'LUNAS' : 'BELUM', 7)} | ${formatRp(curTarif.listrik)}`,
    `${padCol('4. Kas Air', 15)} | ${padCol(rec.air ? 'LUNAS' : 'BELUM', 7)} | ${formatRp(curTarif.air)}`,
    `-------------------------------------`,
    `${padCol('TOTAL DIBAYAR', 25)} : ${formatRp(sum.totalPaid)}`,
    `${padCol('SISA KURANG', 25)} : ${formatRp(sum.totalUnpaid)}`,
    '```',
    `Status Akhir : *${sum.isFullLunas ? 'LUNAS 100% ✓' : 'BELUM LUNAS'}*`,
    `Bendahara    : 081231256129`,
    `Jazakumullah khairan katsiran.`
  ].join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(s.wa)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  document.getElementById('modalNota').classList.remove('hidden');
}

function openNotaTunggakanSantriModal(santriId) {
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

  const padT = (str, len) => String(str).padEnd(len, ' ');
  const tableRowsWa = [];
  arrearsPerMonth.forEach((a, i) => {
    tableRowsWa.push(`${padT((i + 1) + '. ' + a.monthLabel, 16)} | ${padT(formatRp(a.unpaid), 11)} | ${a.items.map(x => x.nama).join(', ')}`);
  });
  activeLoans.forEach((u, i) => {
    tableRowsWa.push(`${padT((arrearsPerMonth.length + i + 1) + '. Utang Kas', 16)} | ${padT(formatRp(u.nominal), 11)} | ${u.keterangan}`);
  });

  const waLines = [
    `Assalamu'alaikum Wr. Wb.`,
    `Yth. Kang *${s.nama}* (${s.prodi})`,
    ``,
    `Berikut *Tabel Rincian Tunggakan Syahriyah & Kas Komplek Tuban (Rumah Wakaf)*:`,
    '```',
    `${padT('Periode/Jenis', 16)} | ${padT('Nominal', 11)} | Rincian`,
    `--------------------------------------------------`,
    tableRowsWa.length > 0 ? tableRowsWa.join('\n') : 'Alhamdulillah Nihil / Lunas Semua Bulan',
    `--------------------------------------------------`,
    `TOTAL TAGIHAN : ${formatRp(grandTotal)}`,
    '```',
    `Mohon segera konfirmasi pembayaran ke Bendahara Komplek (081231256129).`,
    `Wassalamu'alaikum Wr. Wb.`
  ].filter(Boolean).join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(s.wa)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
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
    ? 'LUNAS DISETOR'
    : wifiRec.status === 'pending_confirm'
      ? 'PENDING KONFIRMASI'
      : 'BELUM DISETOR';

  document.getElementById('modalNotaHeaderTitle').textContent = `Laporan Pembayaran WiFi Induk — ${monthLabel}`;
  const badge = document.getElementById('notaBadgeStatus');
  badge.textContent = statusText;
  badge.className = wifiRec.status === 'paid'
    ? 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200'
    : wifiRec.status === 'pending_confirm'
      ? 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200'
      : 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200';
  document.getElementById('notaTimestamp').textContent = wifiRec.tanggalBayar || '30 Okt 2026';

  document.getElementById('notaContentHtml').innerHTML = `
    <div class="overflow-hidden rounded-xl border border-slate-200">
      <table class="w-full text-[11px] border-collapse">
        <tbody class="divide-y divide-slate-200">
          <tr class="bg-slate-50/70">
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-36">Jenis Laporan</td>
            <td class="py-1.5 px-3 font-bold text-slate-900">Setoran WiFi Induk Komplek Tuban</td>
            <td class="py-1.5 px-3 text-slate-500 font-semibold w-24">Periode</td>
            <td class="py-1.5 px-3 font-bold text-emerald-800">${monthLabel}</td>
          </tr>
          <tr>
            <td class="py-1.5 px-3 text-slate-500 font-semibold">Penyetor</td>
            <td class="py-1.5 px-3 font-semibold text-slate-800">Bendahara Komplek (${BENDAHARA_WA})</td>
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
            <th class="py-2 px-3 text-left">Keterangan Laporan WiFi</th>
            <th class="py-2 px-3 text-center">Detail / Status</th>
            <th class="py-2 px-3 text-right">Nominal</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">1</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Tarif Iuran WiFi per Santri (Manual)</td>
            <td class="py-2 px-3 text-center text-slate-500">${state.santri.length} Santri Terdaftar</td>
            <td class="py-2 px-3 text-right font-mono font-bold text-slate-800">${formatRp(curTarif.wifi)}</td>
          </tr>
          <tr class="bg-slate-50/50">
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">2</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Dana Kas WiFi Terkumpul dari Santri</td>
            <td class="py-2 px-3 text-center font-bold text-emerald-800">${wifiPaidSantriCount}/${state.santri.length} Santri Lunas</td>
            <td class="py-2 px-3 text-right font-mono font-bold text-emerald-800">${formatRp(wifiCollectedMonth)}</td>
          </tr>
          <tr>
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">3</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Tagihan WiFi Induk Dibayar ke Pemilik WiFi</td>
            <td class="py-2 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${wifiRec.status === 'paid' ? 'bg-emerald-50 text-emerald-800' : wifiRec.status === 'pending_confirm' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-600'}">${statusText}</span>
            </td>
            <td class="py-2 px-3 text-right font-mono font-bold text-slate-900">${formatRp(wifiRec.nominalBayar || 0)}</td>
          </tr>
          <tr class="bg-slate-50/50">
            <td class="py-2 px-2.5 text-center text-slate-400 font-mono">4</td>
            <td class="py-2 px-3 font-semibold text-slate-800">Catatan Bendahara</td>
            <td colspan="2" class="py-2 px-3 text-right text-slate-700">${wifiRec.proofNote || 'Belum ada catatan'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    ${wifiRec.proofImg ? `
      <div class="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center space-y-1.5">
        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Lampiran Bukti Chat / Transfer Pembayaran WiFi Induk:</span>
        <img src="${wifiRec.proofImg}" alt="Bukti Pembayaran WiFi Induk" class="max-h-56 mx-auto rounded-lg border border-slate-200 bg-white object-contain" />
      </div>
    ` : `
      <div class="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 text-center text-[11px] text-slate-400">
        Belum ada foto bukti chat/transfer yang diunggah oleh Bendahara.
      </div>
    `}
  `;

  const padW = (str, len) => String(str).padEnd(len, ' ');
  const waLines = [
    `*LAPORAN PEMBAYARAN WIFI INDUK KOMPLEK TUBAN*`,
    `*PAYMOJOSARI — PP. MOJOSARI LOCERET NGANJUK*`,
    `====================================`,
    `Periode Bulan : *${monthLabel}*`,
    `Tanggal Setor : ${wifiRec.tanggalBayar || '-'}`,
    `Status Setor  : *${statusText}*`,
    `====================================`,
    `*TABEL RINCIAN PEMBAYARAN WIFI INDUK:*`,
    '```',
    `${padW('Keterangan', 22)} | Nominal / Detail`,
    `------------------------------------------`,
    `${padW('1. Tarif WiFi/Santri', 22)} | ${formatRp(curTarif.wifi)}`,
    `${padW('2. Santri Lunas WiFi', 22)} | ${wifiPaidSantriCount}/${state.santri.length} Santri`,
    `${padW('3. Dana WiFi Terkumpul', 22)} | ${formatRp(wifiCollectedMonth)}`,
    `${padW('4. Setor WiFi Induk', 22)} | ${formatRp(wifiRec.nominalBayar || 0)}`,
    `${padW('5. Bukti Foto Chat/TF', 22)} | ${wifiRec.proofImg ? 'Ada / Terlampir ✓' : 'Belum Diupload'}`,
    '```',
    `Catatan Bendahara : _${wifiRec.proofNote || '-'}_`,
    `Kontak Bendahara  : ${BENDAHARA_WA}`,
    `Jazakumullah khairan katsiran.`
  ].join('\n');

  document.getElementById('notaWaTextPreview').value = waLines;
  document.getElementById('btnSendWaDirect').href = `https://wa.me/${formatPhoneToWa(BENDAHARA_WA)}?text=${encodeURIComponent(waLines)}`;
  const groupBtn = document.getElementById('btnSendWaGroup');
  if (groupBtn) {
    groupBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waLines)}`;
  }
  document.getElementById('modalNota').classList.remove('hidden');
}

function closeNotaModal() {
  document.getElementById('modalNota').classList.add('hidden');
}

function copyWaText() {
  const el = document.getElementById('notaWaTextPreview');
  el.select();
  navigator.clipboard.writeText(el.value);
  showToast('Teks pesan WhatsApp disalin!');
}

// =========================================================================
// SIARAN REKAP LENGKAP KE GRUP WHATSAPP
// =========================================================================

function generateRekapGrupText() {
  const fin = calculateGlobalFinancials();
  const curTarif = getTarif(state.activeMonth);
  const monthLabel = getMonthLabel(state.activeMonth);

  const lunasList = [];
  const nunggakList = [];

  state.santri.forEach(s => {
    const rec = getPaymentRecord(s.id, state.activeMonth);
    const sum = calculateRecordSummary(rec, state.activeMonth, s);
    const labelKet = sum.tanpaMakan ? ' [Tanpa Uang Makan]' : '';
    if (sum.isFullLunas) {
      lunasList.push(`• *${s.nama}* (${s.prodi.split(' ')[0]})${labelKet} - Lunas (${formatRp(sum.totalPaid)})`);
    } else {
      const itemsText = sum.unpaidItems.map(i => i.nama).join(', ');
      nunggakList.push(`• *${s.nama}* (${s.prodi.split(' ')[0]})${labelKet} - Kurang ${formatRp(sum.totalUnpaid)} [${itemsText}]`);
    }
  });

  const activeLoans = state.utangKas.filter(u => u.status === 'belum_lunas');
  const loanText = activeLoans.length > 0
    ? `\n*PINJAMAN / UTANG KAS SANTRI:*\n` + activeLoans.map(u => {
        const s = state.santri.find(x => x.id === u.santriId);
        return `• ${s ? s.nama : 'Santri'} : ${formatRp(u.nominal)} (${u.keterangan})`;
      }).join('\n') + `\n*Total Utang Kas : ${formatRp(fin.totalUtangAktif)}*\n`
    : '';

  const pctSent = fin.activeMonthTarget > 0 ? Math.round((fin.activeMonthTotalSent / fin.activeMonthTarget) * 100) : 0;
  const pctPending = fin.activeMonthTarget > 0 ? Math.round((fin.activeMonthTunggakan / fin.activeMonthTarget) * 100) : 0;
  const activeLoanCount = state.utangKas.filter(u => u.status === 'belum_lunas').length;

  const wifiRec = getBendaharaWifiRecord(state.activeMonth);
  const wifiStatusLabel = wifiRec.status === 'paid'
    ? 'LUNAS DISETOR ✓'
    : wifiRec.status === 'pending_confirm'
      ? 'PENDING KONFIRMASI'
      : 'BELUM DISETOR';

  const text = [
    `*LAPORAN SYAHRIYAH & KAS KOMPLEK TUBAN (RUMAH WAKAF)*`,
    `*PAYMOJOSARI — PP. MOJOSARI LOCERET NGANJUK*`,
    `Periode Bulan: *${monthLabel}*`,
    `================================`,
    `*RINGKASAN KAS & PEMBAYARAN (${monthLabel}):*`,
    `• Total Terkumpul Bulan Ini : *${formatRp(fin.activeMonthTotalSent)}* (${pctSent}%)`,
    `• Tunggakan (Pending)       : *${formatRp(fin.activeMonthTunggakan)}* (${pctPending}%)`,
    `• Saldo Uang Kas Komplek    : *${formatRp(fin.saldoKasTersedia)}* (Kas Aktif)`,
    `• Utang Kas Santri          : *${formatRp(fin.totalUtangAktif)}* (${activeLoanCount} Santri Utang)`,
    `• Saldo Dapur / Uang Makan  : *${formatRp(fin.saldoMasakTersedia)}*`,
    `--------------------------------`,
    `*LAPORAN PEMBAYARAN WIFI INDUK (BENDAHARA):*`,
    `• Status Setoran WiFi       : *${wifiStatusLabel}*`,
    `• Nominal Bayar WiFi Induk  : *${formatRp(wifiRec.nominalBayar || 0)}*`,
    `• Tanggal Pembayaran        : ${wifiRec.tanggalBayar || '-'}`,
    `• Bukti Chat / Transfer     : ${wifiRec.proofImg ? 'Ada / Terlampir ✓' : 'Belum Diupload'}`,
    `• Catatan Bendahara         : _${wifiRec.proofNote || '-'}_`,
    `--------------------------------`,
    `*RINCIAN IURAN PER SANTRI (Total ${formatRp(curTarif.totalBulanan)}):*`,
    `1. Uang Makan : ${formatRp(curTarif.makan)}`,
    `2. Kas WiFi (Manual/Aktif) : ${formatRp(curTarif.wifi)}`,
    `3. Kas Listrik : ${formatRp(curTarif.listrik)}`,
    `4. Kas Air : ${formatRp(curTarif.air)}`,
    `--------------------------------`,
    `*REKAP STATUS SANTRI (${monthLabel}):*`,
    `*A. SUDAH LUNAS (${lunasList.length} Santri):*`,
    lunasList.length > 0 ? lunasList.join('\n') : '• (Belum ada yang lunas)',
    ``,
    `*B. MASIH ADA TUNGGAKAN (${nunggakList.length} Santri):*`,
    nunggakList.length > 0 ? nunggakList.join('\n') : '• Alhamdulillah semua sudah lunas',
    loanText,
    `================================`,
    `Bagi kang santri yang masih ada kekurangan, mohon segera konfirmasi pembayaran ke Bendahara Komplek.`,
    `Jazakumullah khairan katsiran.`,
    `_Bendahara Komplek Tuban (Rumah Wakaf)_`,
    `_Kontak Bendahara: 081231256129_`
  ].join('\n');

  return text;
}

function openRekapGrupModal() {
  const text = generateRekapGrupText();
  document.getElementById('rekapGrupWaText').value = text;
  document.getElementById('modalRekapGrupSubtitle').textContent = `Periode: ${getMonthLabel(state.activeMonth)}`;

  // Tampilkan link grup yang ditautkan
  const inputLink = document.getElementById('inputLinkGrupWa');
  if (inputLink) inputLink.value = state.linkGrupWa || DEFAULT_GRUP_LINK;

  const btnDirectGroup = document.getElementById('btnBukaLinkGrupLangsung');
  if (btnDirectGroup) btnDirectGroup.href = state.linkGrupWa || DEFAULT_GRUP_LINK;

  // Tombol Kirim Siaran Langsung ke WhatsApp (membawa teks siaran)
  document.getElementById('btnSendGroupBroadcast').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
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
  showToast('Tautan grup WhatsApp berhasil diperbarui & ditautkan!');
}

function closeRekapGrupModal() {
  document.getElementById('modalRekapGrup').classList.add('hidden');
}

function copyGroupWaText() {
  const el = document.getElementById('rekapGrupWaText');
  el.select();
  navigator.clipboard.writeText(el.value);
  showToast('Teks laporan siaran grup WhatsApp disalin!');
}

// =========================================================================
// BOOTSTRAP
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initControls();
  switchTab(state.activeTab || 'pembayaran');
});
