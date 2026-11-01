# Dokumentasi & Riwayat Pengembangan PayMojosari
**Sistem Kas & Uang Makan — PP. Mojosari Loceret Nganjuk (Komplek Tuban / Rumah Wakaf)**

File ini merangkum seluruh instruksi, hasil kesepakatan, konfigurasi sistem, dan riwayat pengerjaan yang telah dilakukan selama sesi obrolan ini. File ini dapat dibuka kapan saja di Notepad, VS Code, atau disalin ke sesi percakapan AI baru untuk melanjutkan pengembangan.

---

## 1. Informasi Sesi Obrolan
- **ID Percakapan (Conversation ID):** `16659194-bfda-4845-a877-73369415817e` & `3a20c728-fbf2-4003-9c48-42f0d9c25b70`
- **Lokasi Log Asli Transkrip Sistem:**
  - `C:\Users\ThinkPad\.gemini\antigravity-cli\brain\16659194-bfda-4845-a877-73369415817e\.system_generated\logs\transcript.jsonl`
  - `C:\Users\ThinkPad\.gemini\antigravity-cli\brain\3a20c728-fbf2-4003-9c48-42f0d9c25b70\.system_generated\logs\transcript.jsonl`
- **Lokasi Proyek:** `C:\laragon\www\sistem-kas-mojosari\`
- **Database MySQL (Laragon):** `db_kas_mojosari` (User: `root`, Password: kosong, Host: `127.0.0.1`)

---

## 2. Ringkasan Perubahan & Fitur yang Telah Diterapkan

### A. Identitas Aplikasi & Ikon
1. **Nama Aplikasi:** Diubah menjadi **PayMojosari**.
2. **Ikon / Logo:**
   - Menggunakan logo kubah dan kaligrafi Mojosari berwarna hijau emerald (`#064e3b`).
   - Tanpa kotak pembungkus (transparan) bernama `logo-mojosari.png`.

### B. Data 17 Santri Resmi (Komplek Tuban)
Telah didaftarkan ke MySQL dan frontend:
1. `s1` - Muhammad Abdul Aziz (Lampung, Sistem Informasi, WA: 081231256129) — **Tanpa Uang Makan**
2. `s2` - Rahmat Taufik (Rejoso, Sistem Informasi, WA: 0891209269)
3. `s3` - Nailul Author Ahmad (Boyolali, Sistem Informasi, WA: 082136066882)
4. `s4` - Raihan Chayin (Ngawi, Sistem Informasi, WA: 082331491897)
5. `s5` - Angga Sanjaya (Purworejo, Sistem Informasi, WA: 083821865361)
6. `s6` - Ahmad Dimas Nasrulloh (Sidoarjo, Sistem Informasi, WA: 085645259514)
7. `s7` - Ahmad Lukman Hakim (Rejoso, Sistem Informasi, WA: 083849858925)
8. `s8` - Riyadlus Sholikhin (Loceret, Sistem Informasi, WA: 08318726592)
9. `s9` - Muhammad Saiful Anam (Sawahan, Sistem Informasi, WA: 082146282076)
10. `s10` - Ahmad Fathony Sidqan (Berbek, Sistem Informasi, WA: 0895414997822)
11. `s11` - Muhammad Nasikhul Umam (Loceret, Pendidikan Teknologi Informasi, WA: 085710272496) — **Tanpa Uang Makan**
12. `s12` - Alwi Shihab Azzuhry (Jambi, Pendidikan Teknologi Informasi, WA: 082294423387)
13. `s13` - Muhammad Choirul Anwar (Sawahan, Pendidikan Teknologi Informasi, WA: 081770092651)
14. `s14` - Manshur Siroj (Rejoso, Pendidikan Teknologi Informasi, WA: 085335219903)
15. `s15` - Fadli Hibatulloh Ahmad (Kudus, Teknik Industri, WA: 0887766847234)
16. `s16` - Muhammad Rasyid Fathoni (Madiun, Akuntansi Bisnis Digital, WA: 082143460969)
17. `s17` - Ahmad Zuhdi Affabillah (Ngeronggot, Akuntansi Bisnis Digital, WA: 085704414868)

> **Catatan Khusus Santri Tanpa Uang Makan:**
> Hanya santri `s1` (Aziz) dan `s11` (Umam) yang diset tanpa uang makan. Tarif tagihannya otomatis hanya komponen Kas (WiFi + Listrik + Air) tanpa tagihan konsumsi makan Rp 50.000.

---

### C. Laporan Pembayaran WiFi Induk (Bendahara ke Pemilik WiFi)
- Terdapat kartu khusus laporan setoran kas WiFi bulanan dari Bendahara ke pemilik WiFi (Pak H. Mahmud).
- Dilengkapi status lunas/belum lunas, tombol upload bukti chat/transfer, dan tombol WhatsApp konfirmasi langsung ke pemilik WiFi.

---

### D. Kartu Identitas Santri
- **Desain:** Putih bersih dengan aksen gradasi hijau lembut (`emerald`).
- **Murni Identitas:** Tanpa tabel pembayaran, tanpa rincian uang syahriyah, murni sebagai KTA / ID Card Santri Mukim Komplek Tuban.
- **Rasio Foto:** Menggunakan ukuran **pas foto 3:4** (lebar 66px × tinggi 88px, `aspect-ratio: 3/4`, `object-cover object-center`).
- **Fitur Cetak:**
  - Cetak perorangan via modal nota.
  - Cetak kolektif sekaligus untuk seluruh 17 santri.

---

### E. Fitur Edit Foto Profil Santri
- Form pendaftaran santri dilengkapi pratinjau pas foto 3:4.
- Pengguna dapat mengunggah file foto JPG/PNG/WebP langsung dari HP atau Laptop.
- Foto otomatis dikompres via HTML5 Canvas agar ringan dan tersimpan di database MySQL dalam format base64 Data URL.
- Tabel daftar santri dilengkapi thumbnail foto profil santri.
- Kolom database `santri.avatar` diubah menjadi tipe `LONGTEXT`.

---

## 3. Cara Menggunakan Kembali Obrolan Ini di Masa Mendatang

### Opsi 1: Melanjutkan Sesi Langsung di Antigravity
Sesi ini tersimpan otomatis di sistem Antigravity. Anda dapat membukanya kembali melalui:
1. **Sidebar History Chat** di aplikasi Antigravity (pilih sesi percakapan PayMojosari).
2. Jika menggunakan terminal CLI, gunakan perintah resume berdasarkan Conversation ID:
   ```powershell
   agy resume 16659194-bfda-4845-a877-73369415817e
   ```

### Opsi 2: Menggunakan File Catatan Ini di Obrolan Baru
Jika Anda membuka chat baru atau berganti perangkat, cukup lampirkan atau sebutkan file ini:
> *"Lanjutkan pengerjaan web PayMojosari dengan mengacu pada CATATAN_PROYEK_DAN_OBROLAN.md di folder proyek."*

AI baru akan langsung memahami seluruh aturan, santri tanpa makan, struktur database, serta desain yang sudah disepakati.

---

## 4. Struktur Berkas Proyek
- `index.html`: Halaman dashboard PayMojosari (FinPilot visual parity).
- `app.js`: Logika aplikasi, pengelolaan state, kartu santri 3:4, kalkulasi kas, dan manipulasi foto.
- `api.php`: Backend REST API untuk sinkronisasi dengan database MySQL Laragon.
- `config.php`: Konfigurasi koneksi database PDO MySQL.
- `database.sql`: Skrip skema database lengkap untuk impor ke MySQL.
- `logo-mojosari.png`: Ikon logo resmi aplikasi (hijau emerald transparan).


---

## 5. Progres Koneksi GitHub & Hosting Online (Update 31 Okt 2026)

### A. Repositori GitHub
- **URL Repositori:** `https://github.com/azizsuwor/paymojosari.git`
- **Cabang (Branch):** `main`
- **Status Lokal:** Git repo telah diinisialisasi (`git init`), seluruh berkas telah di-stage & di-commit (`Initial commit`).
- **Cara Push Manual ke GitHub (Jika Diperlukan):**
  Buka terminal/CMD di laptop Anda, jalankan:
  ```powershell
  cd C:\laragon\www\sistem-kas-mojosari
  C:\laragon\bin\git\cmd\git.exe push -u origin main
  ```

---

### B. Domain & Hosting Online (InfinityFree)
1. **Domain:** `paymojosari.my.id` (dibeli di `indo.domains`).
   - Nameservers di `indo.domains` diarahkan ke:
     - `ns1.infinityfree.com`
     - `ns2.infinityfree.com`
     - `ns1.byet.org`
     - `ns2.byet.org`
2. **Akun Hosting InfinityFree:**
   - **Username Akun:** `if0_43321488`
   - **Password cPanel/FTP:** `Mojosari2026`
   - **FTP Host:** `ftpupload.net`
   - **MySQL Host:** `sql101.infinityfree.com`
3. **Status Upload Berkas ke Server:**
   - **SELESAI (100% SUKSES)**: Seluruh file website (`index.html`, `app.js`, `api.php`, `config.php`, `logo-mojosari.png`, `logo-mojosari-white.png`, `database.sql`) telah di-upload langsung ke folder `/htdocs/` maupun `/paymojosari.my.id/htdocs/` via FTP.
   - File default `index2.html` sudah dihapus.
   - `config.php` telah dimutakhirkan ke mode Hybrid (otomatis terkoneksi ke Laragon di localhost, dan otomatis terkoneksi ke database InfinityFree saat online).

---

### C. Langkah yang Perlu Dilakukan Saat Kembali (Tinggal 2 Langkah Terakhir):
Ketika Anda kembali nanti, propagasi DNS dipastikan sudah selesai (telah lewat >15 menit). Anda cukup:
1. **Verifikasi Addon Domain di cPanel InfinityFree:**
   - Buka cPanel ➜ menu **Addon Domains**.
   - Masukkan `paymojosari.my.id`, klik **Add Domain** (akan langsung sukses warna hijau karena DNS sudah selesai propagasi).
2. **Buat Database & Import Data di cPanel:**
   - Buka menu **MySQL Databases** ➜ Buat database dengan nama **`kas`** (menjadi `if0_43321488_kas`).
   - Klik tombol **phpMyAdmin** di samping nama database tersebut.
   - Klik tab **Import** ➜ Pilih file `C:\laragon\www\sistem-kas-mojosari\database.sql` ➜ Klik **Import**.
3. **Selesai!** Website langsung online dan bisa diakses publik melalui:
   🌐 `http://paymojosari.my.id`

---

## 6. Pembaruan Responsif Mobile & Hak Akses Admin vs Santri (Update 1 Nov 2026)

### A. Tampilan Mobile Responsif Penuh (PWA / Native App Experience)
1. **Top Bar Sticky Khusus HP:**
   - Tombol Hamburger Menu (☰) untuk membuka laci samping (*off-canvas drawer*).
   - Dropdown periode bulan dan ikon notifikasi tunggakan dibuat kompak dan mudah dijangkau.
2. **Bottom Navigation Bar (Menu Bawah):**
   - Menempel di bawah layar HP: **Bayar**, **Dashboard**, **Tunggakan**, **Masak**, **Santri**, dan **Menu**.
3. **Metrik 2x2 Kompak:**
   - 4 kartu metrik keuangan tersusun rapi 2 kolom di HP tanpa scroll panjang.
4. **Touch & Modal Friendly:**
   - Tombol-tombol berukuran minimal 44px dan modal responsif bertumpuk vertikal di layar sempit.

### B. Sistem Privasi 3 Tingkat & Popup Login Bergaya FinPilot
1. **Mode Tamu Umum (`guest` — Default Pengunjung Belum Login):**
   - Dapat melihat **informasi umum (khalayak umum)**: 4 metrik ringkasan kas komplek, laporan setoran WiFi induk, riwayat belanja masak harian, serta direktori daftar 17 santri (nama, asal, program studi).
   - **Harus Login Terlebih Dahulu** jika ingin menjelajah ke dalam fitur-fitur pribadi (tab *Tunggakan*, tab *Utang Kas*, rincian tagihan syahriyah bulanan per santri, atau mencetak *Kartu Identitas Santri / KTA*).
2. **Mode Akun Santri Pribadi (`santri`):**
   - Setiap santri dapat login memilih profil/avatar dirinya dan memasukkan **4 digit terakhir nomor WhatsApp** miliknya (atau sandi kustom / nomor WA lengkap).
   - **Ganti Foto Profil Mandiri (Tersimpan Permanen di MySQL):** Setiap santri yang login ke akunnya dapat mengganti foto profil / pas foto KTA 3:4 miliknya sendiri melalui tombol **Ganti Foto** (`?action=update_santri_photo` di `api.php`), dan foto otomatis tersimpan permanen di database server tanpa bisa mengubah data santri lain.
   - **Privasi Data Pribadi:** Satu santri **hanya bisa melihat datanya sendiri** untuk hal-hal sensitif/pribadi: rincian pembayaran syahriyah miliknya sendiri, tunggakan miliknya sendiri, catatan utang kas miliknya sendiri, serta Kartu Identitas Santri (KTA) 3:4 miliknya sendiri.
   - Tetap bisa melihat daftar umum 17 santri mukim Komplek Tuban (dengan nomor WA santri lain disamarkan sebagian demi privasi).
3. **Mode Bendahara / Admin (`admin`):**
   - **2 Pengurus Bendahara Resmi:**
     1. **Muhammad Abdul Aziz** (`s1`, `NIS-TBN-2026-001`, Lampung, Sistem Informasi, WA: `081231256129`) — **Bendahara Pusat**.
     2. **Manshur Siroj** (`s14`, `NIS-TBN-2026-014`, Rejoso, Pendidikan Teknologi Informasi, WA: `085335219903`) — **Bendahara**.
   - Akses penuh untuk melihat data seluruh 17 santri dan melakukan pencatatan pembayaran, ubah status lunas/belum, kelola jurnal masak, utang kas, data santri, dan bukti WiFi induk.
   - **Sandi / PIN Bendahara:** **`@Deja1590`** (dapat diganti kapan saja melalui fitur **Ganti / Lupa Sandi** dengan verifikasi nomor WhatsApp Bendahara `081231256129` atau `085335219903`).
   - **Daftar Santri Bersih & Sejajar Scroll:**
     - Pada tabel **Daftar Santri Komplek Tuban**, label status di samping nama dihilangkan agar tampilan daftar santri bersih dan seragam.
     - Kotak **Daftar Santri Komplek Tuban**, **Riwayat Belanja Masak**, dan **Daftar Utang Santri** dibuat memiliki tinggi atas-bawah yang **sama persis** dengan kotak form di sampingnya (*Daftarkan Santri Baru*), dengan tabel yang dapat di-*scroll* ke bawah di bagian dalamnya.
   - **Fitur Ganti / Lupa Sandi (Verifikasi Nomor WhatsApp):**
     - Tersedia untuk **Bendahara (Admin)** maupun **Akun Santri**.
     - Memverifikasi nomor WhatsApp lengkap yang terdaftar di database (`081231256129` untuk Bendahara, atau nomor WA masing-masing santri), dilengkapi fitur kirim Kode OTP via WhatsApp dan opsi simpan pengingat sandi baru ke WhatsApp.
     - Sandi baru otomatis disimpan ke tabel `pengaturan_sistem` (`sandi_bendahara`) dan kolom `santri.pin_sandi` di MySQL.
4. **Popup Login Bergaya FinPilot:**
   - Didesain persis mengikuti estetika aplikasi **FinPilot** (kartu putih bersih `rounded-[32px]`, tab *segmented pill* `#f1f5f9` untuk **Akun Santri** | **Bendahara (Admin)**, deretan avatar bundar *Quick Transfer* dengan cincin aktif hijau `#064e3b`, kotak input `#f8fafc`, serta tombol utama `#064e3b`).
5. **Keamanan Berlapis (Frontend & Backend):**
   - Di frontend: UI dan filter privasi menyesuaikan secara otomatis berdasarkan akun yang sedang aktif.
   - Di backend (`api.php`): Seluruh aksi perubahan data (`save_payment`, `save_masak`, `save_wifi_bendahara`, `sync_all`) diverifikasi dengan header `X-Admin-Key`. Request tanpa sandi akan ditolak dengan `HTTP 403 Forbidden`.
6. **Penyesuaian Fitur Nota, Metrik Pribadi & WiFi Induk Rp 200.000:**
   - **4 Kartu Metrik Atas & Tabel Bulanan Sesuai Akun:**
     - **Santri Biasa:** Menampilkan murni angka pribadi santri tersebut (*Terbayar Saya, Tunggakan Saya, Utang Kas Saya, Status Syahriyah*, dan riwayat bulanan pribadi).
     - **Tamu Umum:** Hanya menampilkan profil umum komplek (*17 Santri Mukim, Tarif Syahriyah Rp 100.000, Kas Rp 50.000, Uang Makan Rp 50.000*).
     - **Bendahara (Admin):** Menampilkan rekapitulasi pembukuan penuh 17 santri (*Total Terkumpul, Tunggakan 17 Santri Rp 1.600.000, Saldo Kas, Utang Kas*).
   - **Wewenang Cetak Nota & Siaran Grup WA:**
     - Penerbitan **Nota Pembayaran / Tagihan WA** dan **Siaran Rekap Grup WA** dikunci khusus untuk **Bendahara (Admin)**.
     - Di modal Siaran Grup WA Bendahara tersedia **2 Mode**: **Format Santun (Privasi Terjaga)** tanpa mengumbar nama penunggak/peminjam di grup, serta **Format Lengkap (17 Nama)**.
     - Untuk **Santri Biasa**, tombol Nota diganti menjadi tombol **"Konfirmasi ke WA Bendahara"** yang langsung mengarah ke WA Bendahara (`081231256129`).
   - **Setoran WiFi Induk `Rp 200.000 / bulan` & Sisa Masuk Kas:**
     - Tagihan bulanan ke WiFi Induk yang dibayarkan Bendahara adalah **`Rp 200.000 / bulan`**.
     - Dari target iuran WiFi 17 santri (`17 × Rp 20.000 = Rp 340.000`), sisa **`Rp 140.000 / bulan`** otomatis tercatat dan disimpan di **Saldo Kas Komplek (Bendahara)**.
