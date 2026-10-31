<?php
// =========================================================================
// API ENDPOINT: api.php
// MENYEDIAKAN AKSES DATA DARI DATABASE MYSQL LARAGON KE APLIKASI WEB
// =========================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config.php';

// Pastikan skema tabel santri mutakhir (tanpa_makan dan avatar LONGTEXT)
try {
    $colCheck = $pdo->query("SHOW COLUMNS FROM santri LIKE 'tanpa_makan'")->fetch();
    if (!$colCheck) {
        $pdo->exec("ALTER TABLE santri ADD COLUMN tanpa_makan TINYINT(1) NOT NULL DEFAULT 0 AFTER wa");
        $pdo->exec("UPDATE santri SET tanpa_makan = 1 WHERE id IN ('s1', 's11')");
    }
    // Pastikan avatar bertipe LONGTEXT agar dapat menyimpan foto profil santri
    $pdo->exec("ALTER TABLE santri MODIFY COLUMN avatar LONGTEXT DEFAULT NULL");
} catch (Exception $e) {
    // Abaikan jika tabel belum ada
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// -------------------------------------------------------------------------
// 1. Ambil Semua Data State Lengkap dari Database (GET ?action=get_all)
// -------------------------------------------------------------------------
if ($action === 'get_all') {
    try {
        // Ambil Data Santri
        $stmt = $pdo->query("SELECT * FROM santri ORDER BY CAST(SUBSTRING(id, 2) AS UNSIGNED) ASC, id ASC");
        $santriRows = $stmt->fetchAll();
        $santri = [];
        foreach ($santriRows as $row) {
            $santri[] = [
                'id' => $row['id'],
                'nama' => $row['nama'],
                'shortName' => $row['short_name'] ?: explode(' ', $row['nama'])[0],
                'alamat' => $row['alamat'],
                'prodi' => $row['prodi'],
                'wa' => $row['wa'],
                'tanpaMakan' => !empty($row['tanpa_makan']),
                'avatar' => $row['avatar']
            ];
        }

        // Ambil Tarif Per Bulan
        $stmt = $pdo->query("SELECT * FROM tarif_bulanan");
        $tarif = [];
        while ($row = $stmt->fetch()) {
            $tarif[$row['periode']] = (int)$row['tarif_wifi'];
        }

        // Ambil Pembayaran Santri
        $stmt = $pdo->query("SELECT * FROM pembayaran_santri");
        $pembayaran = [];
        while ($row = $stmt->fetch()) {
            $key = $row['santri_id'] . '_' . $row['periode'];
            $pembayaran[$key] = [
                'makan' => (bool)$row['bayar_makan'],
                'wifi' => (bool)$row['bayar_wifi'],
                'listrik' => (bool)$row['bayar_listrik'],
                'air' => (bool)$row['bayar_air'],
                'updatedAt' => $row['tgl_bayar'] ?: '-'
            ];
        }

        // Ambil Setoran WiFi Bendahara
        $stmt = $pdo->query("SELECT * FROM setoran_wifi_bendahara");
        $setoranWifi = [];
        while ($row = $stmt->fetch()) {
            $setoranWifi[$row['periode']] = [
                'status' => $row['status'],
                'proofImg' => $row['bukti_foto_chat'] ?: '',
                'proofNote' => $row['catatan'] ?: '',
                'tanggalBayar' => $row['tgl_bayar'] ?: '',
                'nominalBayar' => (int)$row['nominal_bayar']
            ];
        }

        // Ambil Jurnal Masak
        $stmt = $pdo->query("SELECT * FROM jurnal_masak ORDER BY tanggal DESC");
        $masak = [];
        while ($row = $stmt->fetch()) {
            $masak[] = [
                'id' => $row['id'],
                'tanggal' => $row['tanggal'],
                'tipe' => $row['tipe'],
                'keterangan' => $row['keterangan'],
                'nominal' => (int)$row['nominal'],
                'petugas' => $row['petugas']
            ];
        }

        // Ambil Utang Kas
        $stmt = $pdo->query("SELECT * FROM utang_kas ORDER BY tanggal DESC");
        $utang = [];
        while ($row = $stmt->fetch()) {
            $utang[] = [
                'id' => $row['id'],
                'santriId' => $row['santri_id'],
                'tanggal' => $row['tanggal'],
                'nominal' => (int)$row['nominal'],
                'keterangan' => $row['keterangan'],
                'status' => $row['status'],
                'tanggalLunas' => $row['tgl_lunas']
            ];
        }

        // Ambil Pengaturan (Grup WA & Kontak)
        $stmt = $pdo->query("SELECT * FROM pengaturan_sistem");
        $pengaturan = [];
        while ($row = $stmt->fetch()) {
            $pengaturan[$row['kunci']] = $row['nilai'];
        }

        echo json_encode([
            'status' => 'success',
            'data' => [
                'santri' => $santri,
                'tarifWifiPerBulan' => $tarif,
                'pembayaran' => $pembayaran,
                'setoranWifiBendahara' => $setoranWifi,
                'masakLogs' => $masak,
                'utangKas' => $utang,
                'linkGrupWa' => isset($pengaturan['link_grup_wa']) ? $pengaturan['link_grup_wa'] : 'https://chat.whatsapp.com/LgVFDhgRgHmDTuC3tCly7c'
            ]
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// -------------------------------------------------------------------------
// 2. Simpan Pembayaran Santri (POST ?action=save_payment)
// -------------------------------------------------------------------------
if ($action === 'save_payment') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit;
    }

    $santri_id = $input['santri_id'];
    $periode = $input['periode'];
    $makan = !empty($input['makan']) ? 1 : 0;
    $wifi = !empty($input['wifi']) ? 1 : 0;
    $listrik = !empty($input['listrik']) ? 1 : 0;
    $air = !empty($input['air']) ? 1 : 0;
    $tgl_bayar = date('Y-m-d');
    $catatan = isset($input['catatan']) ? $input['catatan'] : 'Pembayaran Santri';

    try {
        $sql = "INSERT INTO pembayaran_santri (santri_id, periode, bayar_makan, bayar_wifi, bayar_listrik, bayar_air, tgl_bayar, catatan)
                VALUES (:santri_id, :periode, :makan, :wifi, :listrik, :air, :tgl, :catatan)
                ON DUPLICATE KEY UPDATE 
                bayar_makan = VALUES(bayar_makan),
                bayar_wifi = VALUES(bayar_wifi),
                bayar_listrik = VALUES(bayar_listrik),
                bayar_air = VALUES(bayar_air),
                tgl_bayar = VALUES(tgl_bayar),
                catatan = VALUES(catatan)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':santri_id' => $santri_id,
            ':periode' => $periode,
            ':makan' => $makan,
            ':wifi' => $wifi,
            ':listrik' => $listrik,
            ':air' => $air,
            ':tgl' => $tgl_bayar,
            ':catatan' => $catatan
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Pembayaran berhasil disimpan']);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// -------------------------------------------------------------------------
// 3. Simpan Catatan Jurnal Masak (POST ?action=save_masak)
// -------------------------------------------------------------------------
if ($action === 'save_masak') {
    $input = json_decode(file_get_contents('php://input'), true);
    try {
        $stmt = $pdo->prepare("INSERT INTO jurnal_masak (id, tanggal, tipe, keterangan, nominal, petugas) 
                               VALUES (:id, :tanggal, :tipe, :keterangan, :nominal, :petugas)");
        $stmt->execute([
            ':id' => 'M' . time(),
            ':tanggal' => $input['tanggal'],
            ':tipe' => $input['tipe'],
            ':keterangan' => $input['keterangan'],
            ':nominal' => $input['nominal'],
            ':petugas' => $input['petugas']
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Catatan masak berhasil disimpan']);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// -------------------------------------------------------------------------
// 4. Update Setoran WiFi Bendahara (POST ?action=save_wifi_bendahara)
// -------------------------------------------------------------------------
if ($action === 'save_wifi_bendahara') {
    $input = json_decode(file_get_contents('php://input'), true);
    try {
        $sql = "INSERT INTO setoran_wifi_bendahara (periode, nominal_bayar, tgl_bayar, bukti_foto_chat, catatan, status)
                VALUES (:periode, :nominal, :tgl, :foto, :catatan, :status)
                ON DUPLICATE KEY UPDATE 
                nominal_bayar = VALUES(nominal_bayar),
                tgl_bayar = VALUES(tgl_bayar),
                bukti_foto_chat = VALUES(bukti_foto_chat),
                catatan = VALUES(catatan),
                status = VALUES(status)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':periode' => $input['periode'],
            ':nominal' => $input['nominal'],
            ':tgl' => $input['tanggal'],
            ':foto' => isset($input['foto']) ? $input['foto'] : '',
            ':catatan' => isset($input['catatan']) ? $input['catatan'] : '',
            ':status' => $input['status']
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Setoran WiFi berhasil disimpan']);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// -------------------------------------------------------------------------
// 5. Sinkronisasi Penuh Seluruh State ke Database MySQL (POST ?action=sync_all)
// -------------------------------------------------------------------------
if ($action === 'sync_all') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Sinkronisasi Tarif WiFi Bulanan
        $pdo->exec("DELETE FROM tarif_bulanan WHERE periode < '2026-10'");
        if (!empty($input['tarifWifiPerBulan']) && is_array($input['tarifWifiPerBulan'])) {
            $stmtTarif = $pdo->prepare("INSERT INTO tarif_bulanan (periode, tarif_makan, tarif_wifi, tarif_listrik, tarif_air)
                VALUES (:periode, 50000, :wifi, 20000, 10000)
                ON DUPLICATE KEY UPDATE tarif_wifi = VALUES(tarif_wifi)");
            foreach ($input['tarifWifiPerBulan'] as $periode => $wifiNominal) {
                if ($periode < '2026-10') continue;
                $stmtTarif->execute([
                    ':periode' => $periode,
                    ':wifi' => (int)$wifiNominal
                ]);
            }
        }

        // Sinkronisasi Data Santri
        if (isset($input['santri']) && is_array($input['santri'])) {
            $ids = [];
            $stmtSantri = $pdo->prepare("INSERT INTO santri (id, nama, short_name, alamat, prodi, wa, tanpa_makan, avatar)
                VALUES (:id, :nama, :short_name, :alamat, :prodi, :wa, :tanpa_makan, :avatar)
                ON DUPLICATE KEY UPDATE
                nama = VALUES(nama),
                short_name = VALUES(short_name),
                alamat = VALUES(alamat),
                prodi = VALUES(prodi),
                wa = VALUES(wa),
                tanpa_makan = VALUES(tanpa_makan),
                avatar = VALUES(avatar)");
            foreach ($input['santri'] as $s) {
                $prodi = $s['prodi'];
                if ($prodi === 'Akuntansi Bisdin') {
                    $prodi = 'Akuntansi Bisnis Digital';
                }
                $ids[] = $s['id'];
                $tanpaMakan = !empty($s['tanpaMakan']) ? 1 : 0;
                $stmtSantri->execute([
                    ':id' => $s['id'],
                    ':nama' => $s['nama'],
                    ':short_name' => isset($s['shortName']) ? $s['shortName'] : explode(' ', $s['nama'])[0],
                    ':alamat' => $s['alamat'],
                    ':prodi' => $prodi,
                    ':wa' => $s['wa'],
                    ':tanpa_makan' => $tanpaMakan,
                    ':avatar' => isset($s['avatar']) ? $s['avatar'] : null
                ]);
            }
            if (count($ids) > 0) {
                $placeholders = implode(',', array_fill(0, count($ids), '?'));
                $delSantri = $pdo->prepare("DELETE FROM santri WHERE id NOT IN ($placeholders)");
                $delSantri->execute($ids);
            } else {
                $pdo->exec("DELETE FROM santri");
            }
        }

        // Sinkronisasi Pembayaran Santri
        $pdo->exec("DELETE FROM pembayaran_santri");
        if (!empty($input['pembayaran']) && is_array($input['pembayaran'])) {
            $stmtPay = $pdo->prepare("INSERT INTO pembayaran_santri (santri_id, periode, bayar_makan, bayar_wifi, bayar_listrik, bayar_air, tgl_bayar, catatan)
                VALUES (:santri_id, :periode, :makan, :wifi, :listrik, :air, :tgl, :catatan)");
            foreach ($input['pembayaran'] as $key => $rec) {
                $parts = explode('_', $key);
                if (count($parts) === 2) {
                    $santriId = $parts[0];
                    $periode = $parts[1];
                    $tgl = (!empty($rec['updatedAt']) && $rec['updatedAt'] !== '-') ? $rec['updatedAt'] : null;
                    $stmtPay->execute([
                        ':santri_id' => $santriId,
                        ':periode' => $periode,
                        ':makan' => !empty($rec['makan']) ? 1 : 0,
                        ':wifi' => !empty($rec['wifi']) ? 1 : 0,
                        ':listrik' => !empty($rec['listrik']) ? 1 : 0,
                        ':air' => !empty($rec['air']) ? 1 : 0,
                        ':tgl' => $tgl,
                        ':catatan' => 'Disinkronisasi dari aplikasi'
                    ]);
                }
            }
        }

        // Sinkronisasi Setoran WiFi Bendahara
        $pdo->exec("DELETE FROM setoran_wifi_bendahara");
        if (!empty($input['setoranWifiBendahara']) && is_array($input['setoranWifiBendahara'])) {
            $stmtWifi = $pdo->prepare("INSERT INTO setoran_wifi_bendahara (periode, nominal_bayar, tgl_bayar, bukti_foto_chat, catatan, status)
                VALUES (:periode, :nominal, :tgl, :foto, :catatan, :status)");
            foreach ($input['setoranWifiBendahara'] as $periode => $w) {
                $stmtWifi->execute([
                    ':periode' => $periode,
                    ':nominal' => (int)($w['nominalBayar'] ?? 120000),
                    ':tgl' => !empty($w['tanggalBayar']) ? $w['tanggalBayar'] : null,
                    ':foto' => $w['proofImg'] ?? '',
                    ':catatan' => $w['proofNote'] ?? '',
                    ':status' => $w['status'] ?? 'unpaid'
                ]);
            }
        }

        // Sinkronisasi Jurnal Masak
        if (isset($input['masakLogs']) && is_array($input['masakLogs'])) {
            $pdo->exec("DELETE FROM jurnal_masak");
            $stmtMasak = $pdo->prepare("INSERT INTO jurnal_masak (id, tanggal, tipe, keterangan, nominal, petugas)
                VALUES (:id, :tanggal, :tipe, :keterangan, :nominal, :petugas)");
            foreach ($input['masakLogs'] as $m) {
                $stmtMasak->execute([
                    ':id' => $m['id'],
                    ':tanggal' => $m['tanggal'],
                    ':tipe' => $m['tipe'],
                    ':keterangan' => $m['keterangan'],
                    ':nominal' => (int)$m['nominal'],
                    ':petugas' => $m['petugas']
                ]);
            }
        }

        // Sinkronisasi Utang Kas
        if (isset($input['utangKas']) && is_array($input['utangKas'])) {
            $pdo->exec("DELETE FROM utang_kas");
            $stmtUtang = $pdo->prepare("INSERT INTO utang_kas (id, santri_id, tanggal, nominal, keterangan, status, tgl_lunas)
                VALUES (:id, :santri_id, :tanggal, :nominal, :keterangan, :status, :tgl_lunas)");
            foreach ($input['utangKas'] as $u) {
                $stmtUtang->execute([
                    ':id' => $u['id'],
                    ':santri_id' => $u['santriId'],
                    ':tanggal' => $u['tanggal'],
                    ':nominal' => (int)$u['nominal'],
                    ':keterangan' => $u['keterangan'],
                    ':status' => $u['status'],
                    ':tgl_lunas' => !empty($u['tanggalLunas']) ? $u['tanggalLunas'] : null
                ]);
            }
        }

        // Sinkronisasi Link Grup WA
        if (!empty($input['linkGrupWa'])) {
            $stmtCfg = $pdo->prepare("INSERT INTO pengaturan_sistem (kunci, nilai, keterangan)
                VALUES ('link_grup_wa', :nilai, 'Tautan undangan grup WhatsApp Santri Komplek Tuban')
                ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");
            $stmtCfg->execute([':nilai' => $input['linkGrupWa']]);
        }

        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Seluruh data berhasil disinkronisasi ke MySQL Laragon']);
        exit;
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Action tidak ditemukan']);
