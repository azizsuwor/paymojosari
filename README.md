# PayMojosari 🕌
**Sistem Pembayaran Uang Makan & Kas Santri**  
*Pondok Pesantren Mojosari Loceret Nganjuk — Komplek Tuban (Rumah Wakaf)*

Aplikasi manajemen keuangan berbasis web yang dirancang untuk mempermudah pencatatan, transparansi, dan rekapitulasi iuran syahriyah santri mukim, pengelolaan kas operasional, setoran WiFi bulanan, dan jurnal belanja dapur harian.

---

## 🌟 Fitur Utama

1. **Dashboard Finansial & Saldo Terintegrasi**
   - Monitoring Saldo Kas Komplek (WiFi, Listrik, Air) & Saldo Dapur / Masak.
   - Status pelunasan syahriyah per bulan berjalan.
   - Total tunggakan bulanan santri dan utang kas aktif.

2. **Skema Iuran Syahriyah (Total Rp 100.000 / Bulan)**
   - **Uang Makan**: Rp 50.000 / anak (opsi khusus santri non-makan).
   - **Kas WiFi**: Rp 20.000 / anak (fleksibel / bisa diatur manual).
   - **Kas Listrik**: Rp 20.000 / anak.
   - **Kas Air**: Rp 10.000 / anak.

3. **Setoran WiFi Bulanan Khusus Bendahara**
   - Fitur upload foto / screenshot bukti transfer chat ke pemilik WiFi.
   - Input manual tagihan riil dari pemilik WiFi.
   - Verifikasi status lunas setoran bulanan.

4. **Rekapitulasi Tunggakan & Integrasi WhatsApp**
   - Pantau status bayar santri bulan per bulan.
   - Generator **Nota Pembayaran** resmi format WhatsApp & cetak PDF.
   - Pengiriman **Nota Tagihan Tunggakan** langsung ke nomor WhatsApp santri.

5. **Kartu Identitas Santri Digital (KTA)**
   - Desain modern minimalis bertema emerald putih.
   - Format pas foto standar resmi rasio **3:4**.
   - Dilengkapi fitur upload foto santri, kompresi canvas otomatis, acak avatar, dan cetak kolektif (17 santri).

6. **Jurnal Masak Harian & Utang Kas Santri**
   - Catatan pengeluaran belanja bahan dapur harian per tim piket.
   - Pengelolaan pinjaman / utang santri yang diambil dari kas komplek.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5, Tailwind CSS, Lucide Icons, Vanilla JavaScript.
- **Backend:** PHP (PDO MySQL).
- **Database:** MySQL (Laragon).
- **Environment:** Laragon Web Server (Apache/Nginx & MySQL).

---

## 🚀 Cara Menjalankan Lokal (Laragon)

1. Clone repository ini ke direktori web Laragon Anda:
   ```bash
   cd C:\laragon\www
   git clone https://github.com/azizsuwor/paymojosari.git
   ```
2. Nyalakan Laragon (**Start All**).
3. Buka **HeidiSQL** atau **phpMyAdmin** di Laragon, lalu buat database baru:
   ```sql
   CREATE DATABASE db_kas_mojosari;
   ```
4. Impor file skema database:
   - Impor file `database.sql` ke dalam database `db_kas_mojosari`.
5. Buka di browser Anda:
   ```
   http://localhost/paymojosari/
   ```
   atau jika nama folder adalah `sistem-kas-mojosari`:
   ```
   http://localhost/sistem-kas-mojosari/
   ```

---

## 👥 Pengembang & Hak Cipta
Dikembangkan untuk kebutuhan operasional **Komplek Tuban (Rumah Wakaf)**  
Pondok Pesantren Mojosari Loceret Nganjuk.
