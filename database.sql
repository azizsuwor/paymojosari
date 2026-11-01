-- =========================================================================
-- DATABASE: db_kas_mojosari
-- SISTEM PEMBAYARAN UANG MAKAN & KAS KOMPLEK TUBAN (RUMAH WAKAF)
-- PONDOK PESANTREN MOJOSARI LOCERET NGANJUK
-- =========================================================================

-- CREATE DATABASE IF NOT EXISTS `db_kas_mojosari` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `db_kas_mojosari`;

-- -------------------------------------------------------------------------
-- 1. Tabel Santri (Data santri mukim Komplek Tuban)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `santri` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `short_name` VARCHAR(50) DEFAULT NULL,
  `alamat` VARCHAR(255) NOT NULL,
  `prodi` ENUM('Sistem Informasi', 'Pendidikan Teknologi Informasi', 'Teknik Industri', 'Akuntansi Bisnis Digital') NOT NULL,
  `wa` VARCHAR(30) NOT NULL,
  `tanpa_makan` TINYINT(1) NOT NULL DEFAULT 0,
  `avatar` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 2. Tabel Tarif Bulanan (Makan, Listrik, Air, dan Kas WiFi yang bisa diatur manual)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tarif_bulanan` (
  `periode` VARCHAR(10) NOT NULL PRIMARY KEY, -- Cth: '2026-10'
  `tarif_makan` INT NOT NULL DEFAULT 50000,
  `tarif_wifi` INT NOT NULL DEFAULT 20000,   -- Bisa diatur manual per bulan
  `tarif_listrik` INT NOT NULL DEFAULT 20000,
  `tarif_air` INT NOT NULL DEFAULT 10000,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 3. Tabel Pembayaran Iuran Santri ke Bendahara (Per Periode Bulan)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pembayaran_santri` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `santri_id` VARCHAR(50) NOT NULL,
  `periode` VARCHAR(10) NOT NULL, -- Cth: '2026-10'
  `bayar_makan` TINYINT(1) NOT NULL DEFAULT 0,
  `bayar_wifi` TINYINT(1) NOT NULL DEFAULT 0,
  `bayar_listrik` TINYINT(1) NOT NULL DEFAULT 0,
  `bayar_air` TINYINT(1) NOT NULL DEFAULT 0,
  `tgl_bayar` DATE DEFAULT NULL,
  `catatan` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unik_santri_periode` (`santri_id`, `periode`),
  CONSTRAINT `fk_pembayaran_santri` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 4. Tabel Setoran WiFi Bulanan oleh Bendahara ke Pemilik WiFi
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `setoran_wifi_bendahara` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `periode` VARCHAR(10) NOT NULL UNIQUE, -- Cth: '2026-10'
  `nominal_bayar` INT NOT NULL DEFAULT 200000, -- Tagihan WiFi Induk Rp 200.000/bulan (sisa masuk kas)
  `tgl_bayar` DATE DEFAULT NULL,
  `bukti_foto_chat` LONGTEXT DEFAULT NULL, -- Path atau Data URL foto screenshot chat/transfer
  `catatan` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('unpaid', 'pending_confirm', 'paid') NOT NULL DEFAULT 'unpaid',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 5. Tabel Jurnal Masak Harian (Pemasukan Donasi & Pengeluaran Belanja)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jurnal_masak` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `tipe` ENUM('pemasukan', 'pengeluaran') NOT NULL,
  `keterangan` VARCHAR(255) NOT NULL,
  `nominal` INT NOT NULL,
  `petugas` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 6. Tabel Utang Santri (Diambil dari Uang Kas Komplek)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `utang_kas` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `santri_id` VARCHAR(50) NOT NULL,
  `tanggal` DATE NOT NULL,
  `nominal` INT NOT NULL,
  `keterangan` VARCHAR(255) NOT NULL,
  `status` ENUM('belum_lunas', 'lunas') NOT NULL DEFAULT 'belum_lunas',
  `tgl_lunas` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_utang_santri` FOREIGN KEY (`santri_id`) REFERENCES `santri` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 7. Tabel Jurnal Kas Umum Komplek (Listrik, Air, Alat Kebersihan, Fasilitas)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jurnal_kas_umum` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `tipe` ENUM('pemasukan', 'pengeluaran') NOT NULL DEFAULT 'pengeluaran',
  `kategori` VARCHAR(100) NOT NULL DEFAULT 'Token Listrik',
  `keterangan` VARCHAR(255) NOT NULL,
  `nominal` INT NOT NULL,
  `petugas` VARCHAR(100) NOT NULL DEFAULT 'Bendahara Komplek',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 8. Tabel Konfirmasi Bukti Transfer Santri (Upload Bukti DANA / Transfer)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `konfirmasi_bayar` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `santri_id` VARCHAR(50) NOT NULL,
  `periode` VARCHAR(10) NOT NULL,
  `bayar_makan` TINYINT(1) NOT NULL DEFAULT 0,
  `bayar_wifi` TINYINT(1) NOT NULL DEFAULT 0,
  `bayar_listrik` TINYINT(1) NOT NULL DEFAULT 0,
  `bayar_air` TINYINT(1) NOT NULL DEFAULT 0,
  `nominal` INT NOT NULL DEFAULT 0,
  `bukti_foto` LONGTEXT NOT NULL,
  `catatan` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `tanggal` VARCHAR(30) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------------------
-- 9. Tabel Pengaturan Sistem (Kontak Bendahara, Nomor DANA, Link Grup WA, dll.)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pengaturan_sistem` (
  `kunci` VARCHAR(50) NOT NULL PRIMARY KEY,
  `nilai` TEXT NOT NULL,
  `keterangan` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================================
-- DATA SANTRI MUKIM KOMPLEK TUBAN (17 SANTRI) & KONFIGURASI DEFAULT
-- =========================================================================

-- Kosongkan Seluruh Transaksi Default (Siap Input Baru)
DELETE FROM `pembayaran_santri`;
DELETE FROM `setoran_wifi_bendahara`;
DELETE FROM `jurnal_masak`;
DELETE FROM `utang_kas`;
DELETE FROM `santri`;

-- Insert 17 Data Santri Komplek Tuban (Rumah Wakaf) — s1 (Aziz) & s11 (Umam) Tanpa Uang Makan (tanpa_makan = 1)
INSERT INTO `santri` (`id`, `nama`, `short_name`, `alamat`, `prodi`, `wa`, `tanpa_makan`, `avatar`) VALUES
('s1', 'Muhammad Abdul Aziz', 'Aziz', 'Lampung', 'Sistem Informasi', '081231256129', 1, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'),
('s2', 'Rahmat Taufik', 'Taufik', 'Rejoso', 'Sistem Informasi', '0891209269', 0, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80'),
('s3', 'Nailul Author Ahmad', 'Nailul', 'Boyolali', 'Sistem Informasi', '082136066882', 0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'),
('s4', 'Raihan Chayin', 'Raihan', 'Ngawi', 'Sistem Informasi', '082331491897', 0, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'),
('s5', 'Angga Sanjaya', 'Angga', 'Purworejo', 'Sistem Informasi', '083821865361', 0, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'),
('s6', 'Ahmad Dimas Nasrulloh', 'Dimas', 'Sidoarjo', 'Sistem Informasi', '085645259514', 0, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80'),
('s7', 'Ahmad Lukman Hakim', 'Lukman', 'Rejoso', 'Sistem Informasi', '083849858925', 0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'),
('s8', 'Riyadlus Sholikhin', 'Riyad', 'Loceret', 'Sistem Informasi', '08318726592', 0, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'),
('s9', 'Muhammad Saiful Anam', 'Anam', 'Sawahan', 'Sistem Informasi', '082146282076', 0, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'),
('s10', 'Ahmad Fathony Sidqan', 'Fathony', 'Berbek', 'Sistem Informasi', '0895414997822', 0, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80'),
('s11', 'Muhammad Nasikhul Umam', 'Umam', 'Loceret', 'Pendidikan Teknologi Informasi', '085710272496', 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'),
('s12', 'Alwi Shihab Azzuhry', 'Alwi', 'Jambi', 'Pendidikan Teknologi Informasi', '082294423387', 0, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'),
('s13', 'Muhammad Choirul Anwar', 'Anwar', 'Sawahan', 'Pendidikan Teknologi Informasi', '081770092651', 0, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'),
('s14', 'Manshur Siroj', 'Manshur', 'Rejoso', 'Pendidikan Teknologi Informasi', '085335219903', 0, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80'),
('s15', 'Fadli Hibatulloh Ahmad', 'Fadli', 'Kudus', 'Teknik Industri', '0887766847234', 0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'),
('s16', 'Muhammad Rasyid Fathoni', 'Rasyid', 'Madiun', 'Akuntansi Bisnis Digital', '082143460969', 0, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80'),
('s17', 'Ahmad Zuhdi Affabillah', 'Zuhdi', 'Ngeronggot', 'Akuntansi Bisnis Digital', '085704414868', 0, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80')
ON DUPLICATE KEY UPDATE
  `nama`=VALUES(`nama`),
  `short_name`=VALUES(`short_name`),
  `alamat`=VALUES(`alamat`),
  `prodi`=VALUES(`prodi`),
  `wa`=VALUES(`wa`),
  `tanpa_makan`=VALUES(`tanpa_makan`),
  `avatar`=VALUES(`avatar`);

-- Tarif Periode (Mulai Oktober 2026 s/d Desember 2027)
DELETE FROM `tarif_bulanan` WHERE `periode` < '2026-10';
INSERT INTO `tarif_bulanan` (`periode`, `tarif_makan`, `tarif_wifi`, `tarif_listrik`, `tarif_air`) VALUES
('2026-10', 50000, 20000, 20000, 10000),
('2026-11', 50000, 20000, 20000, 10000),
('2026-12', 50000, 20000, 20000, 10000),
('2027-01', 50000, 20000, 20000, 10000),
('2027-02', 50000, 20000, 20000, 10000),
('2027-03', 50000, 20000, 20000, 10000),
('2027-04', 50000, 20000, 20000, 10000),
('2027-05', 50000, 20000, 20000, 10000),
('2027-06', 50000, 20000, 20000, 10000),
('2027-07', 50000, 20000, 20000, 10000),
('2027-08', 50000, 20000, 20000, 10000),
('2027-09', 50000, 20000, 20000, 10000),
('2027-10', 50000, 20000, 20000, 10000),
('2027-11', 50000, 20000, 20000, 10000),
('2027-12', 50000, 20000, 20000, 10000)
ON DUPLICATE KEY UPDATE `tarif_wifi`=VALUES(`tarif_wifi`);

-- Pengaturan Sistem (Kontak, Nomor DANA, Sandi Bendahara & Link Grup WA)
INSERT INTO `pengaturan_sistem` (`kunci`, `nilai`, `keterangan`) VALUES
('kontak_bendahara', '081231256129', 'Nomor WA resmi Bendahara Komplek Tuban'),
('nomor_dana_bendahara', '085335219903', 'Nomor DANA resmi tujuan transfer pembayaran Komplek Tuban'),
('sandi_bendahara', '@Deja1590', 'Sandi resmi login Bendahara Komplek Tuban'),
('link_grup_wa', 'https://chat.whatsapp.com/LgVFDhgRgHmDTuC3tCly7c', 'Tautan undangan grup WhatsApp Santri Komplek Tuban'),
('nama_komplek', 'Komplek Tuban (Rumah Wakaf)', 'Nama komplek pondok pesantren'),
('nama_pesantren', 'Pondok Pesantren Mojosari Loceret Nganjuk', 'Nama lembaga pesantren')
ON DUPLICATE KEY UPDATE `nilai`=VALUES(`nilai`);
