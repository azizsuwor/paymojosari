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

// Pastikan skema tabel santri mutakhir (tanpa_makan, pin_sandi, dan avatar LONGTEXT)
try {
    $colCheck = $pdo->query("SHOW COLUMNS FROM santri LIKE 'tanpa_makan'")->fetch();
    if (!$colCheck) {
        $pdo->exec("ALTER TABLE santri ADD COLUMN tanpa_makan TINYINT(1) NOT NULL DEFAULT 0 AFTER wa");
        $pdo->exec("UPDATE santri SET tanpa_makan = 1 WHERE id IN ('s1', 's11')");
    }
    $colPinCheck = $pdo->query("SHOW COLUMNS FROM santri LIKE 'pin_sandi'")->fetch();
    if (!$colPinCheck) {
        $pdo->exec("ALTER TABLE santri ADD COLUMN pin_sandi VARCHAR(100) DEFAULT NULL AFTER wa");
    }
    // Pastikan avatar bertipe LONGTEXT agar dapat menyimpan foto profil santri
    $pdo->exec("ALTER TABLE santri MODIFY COLUMN avatar LONGTEXT DEFAULT NULL");
} catch (Exception $e) {
    // Abaikan jika tabel belum ada
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

function normalize_wa_number($wa) {
    $clean = preg_replace('/[^0-9]/', '', (string)$wa);
    if (strpos($clean, '62') === 0) {
        $clean = '0' . substr($clean, 2);
    } elseif (strpos($clean, '8') === 0) {
        $clean = '0' . $clean;
    }
    return $clean;
}

// Ambil sandi resmi Admin / Bendahara dari database pengaturan_sistem (default: @Deja1590)
$admin_passwords = ['@Deja1590'];
$bendahara_wa_resmi = '081231256129';
try {
    $stmtPass = $pdo->query("SELECT kunci, nilai FROM pengaturan_sistem WHERE kunci IN ('sandi_bendahara', 'kontak_bendahara')");
    if ($stmtPass) {
        while ($r = $stmtPass->fetch()) {
            if ($r['kunci'] === 'sandi_bendahara' && !empty(trim($r['nilai']))) {
                $admin_passwords[] = trim($r['nilai']);
                $admin_passwords = array_values(array_unique($admin_passwords));
            }
            if ($r['kunci'] === 'kontak_bendahara' && !empty(trim($r['nilai']))) {
                $bendahara_wa_resmi = trim($r['nilai']);
            }
        }
    }
} catch (Exception $e) {
    // Gunakan default jika tabel belum siap
}

function check_admin_auth() {
    global $admin_passwords;
    $key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    if (!$key && function_exists('getallheaders')) {
        $headers = getallheaders();
        $key = $headers['X-Admin-Key'] ?? ($headers['x-admin-key'] ?? '');
    }
    if (!in_array($key, $admin_passwords)) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Akses ditolak: Hanya Bendahara / Admin yang berhak mengubah data pembayaran atau kas.'
        ]);
        exit;
    }
}

// 0. Verifikasi Password Admin (POST ?action=verify_admin)
if ($action === 'verify_admin') {
    $input = json_decode(file_get_contents('php://input'), true);
    $pass = isset($input['password']) ? trim($input['password']) : '';
    if (in_array($pass, $admin_passwords)) {
        echo json_encode(['status' => 'success', 'message' => 'Login Admin Berhasil']);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Sandi / PIN Bendahara salah. Silakan coba lagi.']);
    }
    exit;
}

// 0b. Ganti / Lupa Sandi Bendahara dengan Verifikasi Nomor WA (POST ?action=reset_admin_password)
if ($action === 'reset_admin_password') {
    $input = json_decode(file_get_contents('php://input'), true);
    $waInput = isset($input['wa']) ? normalize_wa_number($input['wa']) : '';
    $oldPass = isset($input['old_password']) ? trim($input['old_password']) : '';
    $newPass = isset($input['new_password']) ? trim($input['new_password']) : '';

    if (strlen($newPass) < 4) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Sandi baru minimal harus 4 karakter.']);
        exit;
    }

    $validAdminWas = [
        normalize_wa_number($bendahara_wa_resmi),
        normalize_wa_number('081231256129'), // Muhammad Abdul Aziz (Bendahara Pusat)
        normalize_wa_number('085335219903')  // Manshur Siroj (Bendahara)
    ];
    // Cek juga WA santri s1 (Aziz) & s14 (Manshur Siroj) di database jika ada
    try {
        $stmtBend = $pdo->query("SELECT wa FROM santri WHERE id IN ('s1', 's14')");
        if ($stmtBend) {
            while ($bRow = $stmtBend->fetch()) {
                if (!empty($bRow['wa'])) {
                    $validAdminWas[] = normalize_wa_number($bRow['wa']);
                }
            }
        }
    } catch (Exception $e) {
        // Gunakan daftar default
    }
    $validAdminWas = array_values(array_unique($validAdminWas));

    $isWaValid = ($waInput !== '' && in_array($waInput, $validAdminWas));
    $isOldPassValid = ($oldPass !== '' && in_array($oldPass, $admin_passwords));

    if (!$isWaValid && !$isOldPassValid) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Verifikasi gagal: Nomor WhatsApp tidak sesuai dengan nomor resmi Bendahara!'
        ]);
        exit;
    }

    try {
        $stmtUpd = $pdo->prepare("INSERT INTO pengaturan_sistem (kunci, nilai, keterangan)
            VALUES ('sandi_bendahara', :nilai, 'Sandi resmi login Bendahara Komplek Tuban')
            ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");
        $stmtUpd->execute([':nilai' => $newPass]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Sandi Bendahara berhasil diperbarui!'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// 0c. Ganti / Lupa Sandi Akun Santri dengan Verifikasi Nomor WA (POST ?action=reset_santri_password)
if ($action === 'reset_santri_password') {
    $input = json_decode(file_get_contents('php://input'), true);
    $santriId = isset($input['santri_id']) ? trim($input['santri_id']) : '';
    $waInput = isset($input['wa']) ? normalize_wa_number($input['wa']) : '';
    $newPin = isset($input['new_pin']) ? trim($input['new_pin']) : '';

    if (!$santriId || strlen($newPin) < 4) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Sandi / PIN baru minimal 4 karakter.']);
        exit;
    }

    try {
        $stmtS = $pdo->prepare("SELECT id, nama, wa FROM santri WHERE id = :id LIMIT 1");
        $stmtS->execute([':id' => $santriId]);
        $row = $stmtS->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Data santri tidak ditemukan.']);
            exit;
        }

        $registeredWa = normalize_wa_number($row['wa']);
        if ($waInput === '' || $waInput !== $registeredWa) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Verifikasi gagal: Nomor WhatsApp lengkap tidak cocok dengan data santri tersebut!'
            ]);
            exit;
        }

        $stmtUpd = $pdo->prepare("UPDATE santri SET pin_sandi = :pin WHERE id = :id");
        $stmtUpd->execute([':pin' => $newPin, ':id' => $santriId]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Sandi / Kode Akses untuk ' . $row['nama'] . ' berhasil diperbarui!'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// 0d. Simpan / Ganti Foto Profil Santri Mandiri (POST ?action=update_santri_photo)
if ($action === 'update_santri_photo') {
    $input = json_decode(file_get_contents('php://input'), true);
    $santriId = isset($input['santri_id']) ? trim($input['santri_id']) : '';
    $avatar = isset($input['avatar']) ? $input['avatar'] : '';
    $nama = isset($input['nama']) ? trim($input['nama']) : '';
    $alamat = isset($input['alamat']) ? trim($input['alamat']) : '';
    $prodi = isset($input['prodi']) ? trim($input['prodi']) : '';
    $wa = isset($input['wa']) ? trim($input['wa']) : '';

    if (!$santriId || !$avatar) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data foto santri tidak lengkap.']);
        exit;
    }

    try {
        if ($nama && $alamat && $prodi && $wa) {
            $shortName = explode(' ', $nama)[0];
            $stmtUpd = $pdo->prepare("UPDATE santri SET avatar = :avatar, nama = :nama, short_name = :short_name, alamat = :alamat, prodi = :prodi, wa = :wa WHERE id = :id");
            $stmtUpd->execute([
                ':avatar' => $avatar,
                ':nama' => $nama,
                ':short_name' => $shortName,
                ':alamat' => $alamat,
                ':prodi' => $prodi,
                ':wa' => $wa,
                ':id' => $santriId
            ]);
        } else {
            $stmtUpd = $pdo->prepare("UPDATE santri SET avatar = :avatar WHERE id = :id");
            $stmtUpd->execute([':avatar' => $avatar, ':id' => $santriId]);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Foto profil santri berhasil disimpan ke database!'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

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
                'pinSandi' => isset($row['pin_sandi']) ? $row['pin_sandi'] : null,
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
    check_admin_auth();
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
    check_admin_auth();
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
    check_admin_auth();
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
    check_admin_auth();
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
            $stmtSantri = $pdo->prepare("INSERT INTO santri (id, nama, short_name, alamat, prodi, wa, pin_sandi, tanpa_makan, avatar)
                VALUES (:id, :nama, :short_name, :alamat, :prodi, :wa, :pin_sandi, :tanpa_makan, :avatar)
                ON DUPLICATE KEY UPDATE
                nama = VALUES(nama),
                short_name = VALUES(short_name),
                alamat = VALUES(alamat),
                prodi = VALUES(prodi),
                wa = VALUES(wa),
                pin_sandi = COALESCE(VALUES(pin_sandi), pin_sandi),
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
                    ':pin_sandi' => !empty($s['pinSandi']) ? $s['pinSandi'] : null,
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
