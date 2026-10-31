# Dokumentasi & Riwayat Pengembangan PayMojosari
**Sistem Kas & Uang Makan — PP. Mojosari Loceret Nganjuk (Komplek Tuban / Rumah Wakaf)**

File ini merangkum seluruh instruksi, hasil kesepakatan, konfigurasi sistem, dan riwayat pengerjaan yang telah dilakukan selama sesi obrolan ini. File ini dapat dibuka kapan saja di Notepad, VS Code, atau disalin ke sesi percakapan AI baru untuk melanjutkan pengembangan.

---

## 1. Informasi Sesi Obrolan
- **ID Percakapan (Conversation ID):** `16659194-bfda-4845-a877-73369415817e`
- **Lokasi Log Asli Transkrip Sistem:**
  - `C:\Users\ThinkPad\.gemini\antigravity-cli\brain\16659194-bfda-4845-a877-73369415817e\.system_generated\logs\transcript.jsonl`
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
