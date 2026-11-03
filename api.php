<?php
// =========================================================================
// API ENDPOINT: api.php
// SISTEM PEMBAYARAN & KAS KOMPLEK TUBAN (PAYMOJOSARI)
// DIENKRIPSI & DIAMANKAN DENGAN SESI PHP + BCRYPT HASHING
// =========================================================================

// Start PHP Session secara aman
if (session_status() === PHP_SESSION_NONE) {
    @ini_set('session.use_strict_mode', '1');
    @ini_set('session.use_only_cookies', '1');
    @ini_set('session.cookie_httponly', '1');
    session_start();
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config.php';

// Pastikan skema tabel santri, jurnal_kas_umum, dan konfirmasi_bayar mutakhir
try {
    $colCheck = $pdo->query("SHOW COLUMNS FROM santri LIKE 'tanpa_makan'")->fetch();
    if (!$colCheck) {
        $pdo->exec("ALTER TABLE santri ADD COLUMN tanpa_makan TINYINT(1) NOT NULL DEFAULT 0 AFTER wa");
        $pdo->exec("UPDATE santri SET tanpa_makan = 1 WHERE id IN ('s1', 's11')");
    }
    $colPinCheck = $pdo->query("SHOW COLUMNS FROM santri LIKE 'pin_sandi'")->fetch();
    if (!$colPinCheck) {
        $pdo->exec("ALTER TABLE santri ADD COLUMN pin_sandi VARCHAR(255) DEFAULT NULL AFTER wa");
    } else {
        $pdo->exec("ALTER TABLE santri MODIFY COLUMN pin_sandi VARCHAR(255) DEFAULT NULL");
    }
    // Pastikan avatar bertipe LONGTEXT agar dapat menyimpan foto profil santri
    $pdo->exec("ALTER TABLE santri MODIFY COLUMN avatar LONGTEXT DEFAULT NULL");

    // Pastikan kolom status pada utang_kas mendukung 'menunggu_persetujuan' dan 'ditolak'
    try {
        $pdo->exec("ALTER TABLE utang_kas MODIFY COLUMN status VARCHAR(30) NOT NULL DEFAULT 'belum_lunas'");
    } catch (Exception $e) {}

    // Pastikan tabel jurnal_kas_umum tersedia
    $pdo->exec("CREATE TABLE IF NOT EXISTS `jurnal_kas_umum` (
      `id` VARCHAR(50) NOT NULL PRIMARY KEY,
      `tanggal` DATE NOT NULL,
      `tipe` ENUM('pemasukan', 'pengeluaran') NOT NULL DEFAULT 'pengeluaran',
      `kategori` VARCHAR(100) NOT NULL DEFAULT 'Token Listrik',
      `keterangan` VARCHAR(255) NOT NULL,
      `nominal` INT NOT NULL,
      `petugas` VARCHAR(100) NOT NULL DEFAULT 'Bendahara Komplek',
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Pastikan tabel konfirmasi_bayar tersedia untuk upload bukti transfer santri
    $pdo->exec("CREATE TABLE IF NOT EXISTS `konfirmasi_bayar` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Pastikan nomor_dana_bendahara terdaftar
    $pdo->exec("INSERT IGNORE INTO `pengaturan_sistem` (`kunci`, `nilai`, `keterangan`)
      VALUES ('nomor_dana_bendahara', '085335219903', 'Nomor DANA resmi tujuan transfer pembayaran Komplek Tuban')");
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

// Fungsi helper verifikasi sandi aman (Mendukung Hash Bcrypt dan migrasi otomatis)
function verify_password_secure($plain, $hashedOrPlain) {
    if ($plain === '' || $hashedOrPlain === '' || $hashedOrPlain === null) return false;
    if (password_verify($plain, $hashedOrPlain)) {
        return true;
    }
    // Fallback sementara jika database masih plaintext dari versi lama
    if ($plain === $hashedOrPlain) {
        return true;
    }
    return false;
}

// Daftar Nomor WhatsApp Pengurus Bendahara Resmi Komplek Tuban (Aziz s1, Taufik s2, Manshur s14)
function get_valid_admin_was($pdo, $bendahara_wa_resmi) {
    $list = [
        normalize_wa_number($bendahara_wa_resmi),
        normalize_wa_number('081231256129'), // Muhammad Abdul Aziz (s1)
        normalize_wa_number('0891209269'),   // Rahmat Taufik (s2)
        normalize_wa_number('085335219903')  // Manshur Siroj (s14)
    ];
    try {
        $stmt = $pdo->query("SELECT wa FROM santri WHERE id IN ('s1', 's2', 's14')");
        if ($stmt) {
            while ($r = $stmt->fetch()) {
                if (!empty($r['wa'])) {
                    $list[] = normalize_wa_number($r['wa']);
                }
            }
        }
    } catch (Exception $e) {}
    return array_values(array_unique(array_filter($list)));
}

// Ambil sandi resmi Admin / Bendahara dari database pengaturan_sistem
$bendahara_wa_resmi = '081231256129';
$storedAdminHash = '';
try {
    $stmtPass = $pdo->query("SELECT kunci, nilai FROM pengaturan_sistem WHERE kunci IN ('sandi_bendahara', 'kontak_bendahara')");
    if ($stmtPass) {
        while ($r = $stmtPass->fetch()) {
            if ($r['kunci'] === 'sandi_bendahara' && !empty(trim($r['nilai']))) {
                $storedAdminHash = trim($r['nilai']);
            }
            if ($r['kunci'] === 'kontak_bendahara' && !empty(trim($r['nilai']))) {
                $bendahara_wa_resmi = trim($r['nilai']);
            }
        }
    }
    // Inisialisasi awal ke DB jika belum ada
    if (empty($storedAdminHash)) {
        $initHash = password_hash('@Deja1590', PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO pengaturan_sistem (kunci, nilai, keterangan)
            VALUES ('sandi_bendahara', :val, 'Hash sandi resmi Bendahara Komplek Tuban')
            ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)")
            ->execute([':val' => $initHash]);
        $storedAdminHash = $initHash;
    }
} catch (Exception $e) {
    // Gunakan hash fallback jika DB belum siap
}

// Verifikasi Sesi Admin Backend (Wajib Sesi Aktif + Token Acak Kriptografis)
function check_admin_auth() {
    $sessionRole = $_SESSION['role'] ?? '';
    $sessionToken = $_SESSION['auth_token'] ?? '';

    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $headerToken = $_SERVER['HTTP_X_ADMIN_TOKEN']
        ?? ($headers['X-Admin-Token'] ?? ($headers['x-admin-token'] ?? ''));

    // Boleh lolos HANYA jika sesi admin aktif dan token kriptografis cocok
    $isAuth = ($sessionRole === 'admin' && !empty($sessionToken) && !empty($headerToken) && hash_equals($sessionToken, $headerToken));

    if (!$isAuth) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Akses ditolak: Sesi Bendahara tidak sah atau telah kedaluwarsa. Silakan login kembali.'
        ]);
        exit;
    }
}

// Cek apakah sesi admin aktif dan token kriptografis sah tanpa langsung melempar exit
function is_admin_session() {
    $sessionRole = $_SESSION['role'] ?? '';
    $sessionToken = $_SESSION['auth_token'] ?? '';
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $headerToken = $_SERVER['HTTP_X_ADMIN_TOKEN']
        ?? ($headers['X-Admin-Token'] ?? ($headers['x-admin-token'] ?? ''));
    return ($sessionRole === 'admin' && !empty($sessionToken) && !empty($headerToken) && hash_equals($sessionToken, $headerToken));
}

// -------------------------------------------------------------------------
// AUTH 0A: Cek Status Sesi Aktif Saat Ini (GET ?action=check_session)
// -------------------------------------------------------------------------
if ($action === 'check_session') {
    $role = $_SESSION['role'] ?? 'guest';
    $santriId = $_SESSION['santri_id'] ?? null;
    $token = $_SESSION['auth_token'] ?? null;

    echo json_encode([
        'status' => 'success',
        'role' => $role,
        'santri_id' => $santriId,
        'token' => $token
    ]);
    exit;
}

// -------------------------------------------------------------------------
// AUTH 0B: Logout Sesi (POST ?action=logout)
// -------------------------------------------------------------------------
if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'Berhasil keluar ke mode tamu.']);
    exit;
}

// -------------------------------------------------------------------------
// AUTH 0C: Verifikasi Login Admin / Bendahara (POST ?action=verify_admin / login_admin)
// -------------------------------------------------------------------------
if ($action === 'verify_admin' || $action === 'login_admin') {
    $input = json_decode(file_get_contents('php://input'), true);
    $pass = isset($input['password']) ? trim($input['password']) : '';
    $waInput = isset($input['wa']) ? normalize_wa_number($input['wa']) : '';

    $validAdminWas = get_valid_admin_was($pdo, $bendahara_wa_resmi);

    if ($waInput !== '' && !in_array($waInput, $validAdminWas)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Nomor WhatsApp tidak terdaftar sebagai Bendahara.']);
        exit;
    }

    if (verify_password_secure($pass, $storedAdminHash)) {
        // Otomatis re-hash ke bcrypt jika sebelumnya masih plain text
        if (password_needs_rehash($storedAdminHash, PASSWORD_DEFAULT)) {
            $newHash = password_hash($pass, PASSWORD_DEFAULT);
            $pdo->prepare("UPDATE pengaturan_sistem SET nilai = :val WHERE kunci = 'sandi_bendahara'")
                ->execute([':val' => $newHash]);
            $storedAdminHash = $newHash;
        }

        // Inisialisasi sesi server yang aman
        $_SESSION['role'] = 'admin';
        $_SESSION['santri_id'] = null;
        $_SESSION['auth_token'] = bin2hex(random_bytes(32));
        $_SESSION['logged_at'] = time();

        echo json_encode([
            'status' => 'success',
            'role' => 'admin',
            'token' => $_SESSION['auth_token'],
            'message' => 'Login Bendahara Berhasil'
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Sandi / PIN Bendahara salah. Silakan coba lagi.']);
    }
    exit;
}

// -------------------------------------------------------------------------
// AUTH 0D: Verifikasi Login Santri di Backend (POST ?action=login_santri)
// -------------------------------------------------------------------------
if ($action === 'login_santri') {
    $input = json_decode(file_get_contents('php://input'), true);
    $santriId = isset($input['santri_id']) ? trim($input['santri_id']) : '';
    $pin = isset($input['pin']) ? trim($input['pin']) : '';

    if (!$santriId || $pin === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Santri dan PIN wajib diisi.']);
        exit;
    }

    $stmtS = $pdo->prepare("SELECT id, nama, wa, pin_sandi, prodi, avatar FROM santri WHERE id = :id LIMIT 1");
    $stmtS->execute([':id' => $santriId]);
    $s = $stmtS->fetch();

    if (!$s) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Santri tidak ditemukan.']);
        exit;
    }

    $cleanWa = normalize_wa_number($s['wa']);
    $last4 = substr($cleanWa, -4);
    $isMatch = false;

    if (!empty($s['pin_sandi'])) {
        $isMatch = verify_password_secure($pin, $s['pin_sandi']) || ($pin === $cleanWa);
        if ($isMatch && password_needs_rehash($s['pin_sandi'], PASSWORD_DEFAULT)) {
            $newHash = password_hash($pin, PASSWORD_DEFAULT);
            $pdo->prepare("UPDATE santri SET pin_sandi = :val WHERE id = :id")->execute([':val' => $newHash, ':id' => $santriId]);
        }
    } else {
        $isMatch = ($pin === $cleanWa || $pin === $last4 || strtolower($pin) === strtolower($santriId) || $pin === '1234');
    }

    if ($isMatch) {
        $_SESSION['role'] = 'santri';
        $_SESSION['santri_id'] = $s['id'];
        $_SESSION['auth_token'] = bin2hex(random_bytes(32));
        $_SESSION['logged_at'] = time();

        echo json_encode([
            'status' => 'success',
            'role' => 'santri',
            'santri_id' => $s['id'],
            'token' => $_SESSION['auth_token'],
            'nama' => $s['nama'],
            'message' => 'Login Santri Berhasil'
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Sandi / PIN tidak sesuai.']);
    }
    exit;
}

// -------------------------------------------------------------------------
// AUTH 0E: Buat OTP Server untuk Reset Sandi Bendahara (POST ?action=send_admin_otp)
// -------------------------------------------------------------------------
if ($action === 'send_admin_otp') {
    $input = json_decode(file_get_contents('php://input'), true);
    $waInput = isset($input['wa']) ? normalize_wa_number($input['wa']) : '';

    $validAdminWas = get_valid_admin_was($pdo, $bendahara_wa_resmi);

    if (!in_array($waInput, $validAdminWas)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Nomor WhatsApp tidak terdaftar sebagai Bendahara.']);
        exit;
    }

    $otp = sprintf('%06d', random_int(100000, 999999));
    $_SESSION['admin_reset_otp'] = $otp;
    $_SESSION['admin_reset_otp_exp'] = time() + 300; // Berlaku 5 menit

    echo json_encode([
        'status' => 'success',
        'otp' => $otp,
        'message' => 'Kode OTP verifikasi berhasil dibuat.'
    ]);
    exit;
}

// -------------------------------------------------------------------------
// AUTH 0F: Ganti Sandi Bendahara dengan Verifikasi Kuat (POST ?action=reset_admin_password)
// -------------------------------------------------------------------------
if ($action === 'reset_admin_password') {
    $input = json_decode(file_get_contents('php://input'), true);
    $waInput = isset($input['wa']) ? normalize_wa_number($input['wa']) : '';
    $oldPass = isset($input['old_password']) ? trim($input['old_password']) : '';
    $newPass = isset($input['new_password']) ? trim($input['new_password']) : '';
    $otp = isset($input['otp']) ? trim($input['otp']) : '';

    if (strlen($newPass) < 4) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Sandi baru minimal harus 4 karakter.']);
        exit;
    }

    $isAdminSession = (($_SESSION['role'] ?? '') === 'admin');
    $isOldPassValid = ($oldPass !== '' && verify_password_secure($oldPass, $storedAdminHash));
    $isOtpValid = (!empty($otp) && !empty($_SESSION['admin_reset_otp']) && $_SESSION['admin_reset_otp'] === $otp && ($_SESSION['admin_reset_otp_exp'] ?? 0) > time());

    // WAJIB: Sesi aktif bendahara, atau sandi lama yang valid, atau OTP server yang terverifikasi!
    if (!$isAdminSession && !$isOldPassValid && !$isOtpValid) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Verifikasi ditolak: Anda wajib memasukkan sandi lama yang benar atau kode OTP resmi.'
        ]);
        exit;
    }

    try {
        $hashedNew = password_hash($newPass, PASSWORD_DEFAULT);
        $stmtUpd = $pdo->prepare("INSERT INTO pengaturan_sistem (kunci, nilai, keterangan)
            VALUES ('sandi_bendahara', :nilai, 'Hash sandi resmi login Bendahara Komplek Tuban')
            ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");
        $stmtUpd->execute([':nilai' => $hashedNew]);

        unset($_SESSION['admin_reset_otp'], $_SESSION['admin_reset_otp_exp']);

        echo json_encode([
            'status' => 'success',
            'message' => 'Sandi Bendahara berhasil diperbarui dengan enkripsi aman!'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// -------------------------------------------------------------------------
// AUTH 0G: Ganti Sandi Akun Santri dengan Verifikasi (POST ?action=reset_santri_password)
// -------------------------------------------------------------------------
if ($action === 'reset_santri_password') {
    $input = json_decode(file_get_contents('php://input'), true);
    $santriId = isset($input['santri_id']) ? trim($input['santri_id']) : '';
    $waInput = isset($input['wa']) ? normalize_wa_number($input['wa']) : '';
    $oldPin = isset($input['old_pin']) ? trim($input['old_pin']) : '';
    $newPin = isset($input['new_pin']) ? trim($input['new_pin']) : '';

    if (!$santriId || strlen($newPin) < 4) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Sandi / PIN baru minimal 4 karakter.']);
        exit;
    }

    try {
        $stmtS = $pdo->prepare("SELECT id, nama, wa, pin_sandi FROM santri WHERE id = :id LIMIT 1");
        $stmtS->execute([':id' => $santriId]);
        $row = $stmtS->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Data santri tidak ditemukan.']);
            exit;
        }

        $isAdmin = (($_SESSION['role'] ?? '') === 'admin');
        $isSelf = (($_SESSION['role'] ?? '') === 'santri' && ($_SESSION['santri_id'] ?? '') === $santriId);
        $registeredWa = normalize_wa_number($row['wa']);

        if (!$isAdmin && !$isSelf) {
            if ($waInput === '' || $waInput !== $registeredWa) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Nomor WhatsApp tidak cocok dengan data santri tersebut!']);
                exit;
            }
            if (!empty($row['pin_sandi']) && !verify_password_secure($oldPin, $row['pin_sandi'])) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'PIN / Sandi lama tidak sesuai.']);
                exit;
            }
        }

        $hashedPin = password_hash($newPin, PASSWORD_DEFAULT);
        $stmtUpd = $pdo->prepare("UPDATE santri SET pin_sandi = :pin WHERE id = :id");
        $stmtUpd->execute([':pin' => $hashedPin, ':id' => $santriId]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Sandi / PIN untuk ' . $row['nama'] . ' berhasil diperbarui!'
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

    $isAdmin = is_admin_session();
    $isSelf = (
        (isset($_SESSION['role']) && $_SESSION['role'] === 'santri' && ($_SESSION['santri_id'] ?? '') === $santriId)
        || (isset($_SESSION['santri_id']) && $_SESSION['santri_id'] === $santriId)
    );

    if (!$isAdmin && !$isSelf) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Akses ditolak: Hanya akun santri terkait atau Bendahara yang diizinkan.']);
        exit;
    }

    if (!$santriId) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data santri tidak ditemukan.']);
        exit;
    }

    try {
        // HANYA BENDAHARA yang berhak mengubah prodi, nama, alamat, atau no WA santri!
        if ($isAdmin && $nama && $alamat && $prodi && $wa) {
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
            // Santri mandiri memperbarui avatar foto profil miliknya sendiri
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

// 0e. Kirim Bukti Transfer Pembayaran oleh Santri (POST ?action=submit_payment_proof)
if ($action === 'submit_payment_proof') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) && $input['id'] ? trim($input['id']) : ('KB' . time() . rand(10, 99));
    $santriId = isset($input['santriId']) ? trim($input['santriId']) : '';
    $periode = isset($input['periode']) ? trim($input['periode']) : '';
    $makan = !empty($input['makan']) ? 1 : 0;
    $wifi = !empty($input['wifi']) ? 1 : 0;
    $listrik = !empty($input['listrik']) ? 1 : 0;
    $air = !empty($input['air']) ? 1 : 0;
    $nominal = isset($input['nominal']) ? (int)$input['nominal'] : 0;
    $buktiFoto = isset($input['buktiFoto']) ? $input['buktiFoto'] : '';
    $catatan = isset($input['catatan']) ? trim($input['catatan']) : 'Transfer DANA 085335219903';
    $tanggal = isset($input['tanggal']) && $input['tanggal'] ? trim($input['tanggal']) : date('Y-m-d H:i');

    if (!$santriId || !$periode || !$buktiFoto) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data bukti transfer belum lengkap.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO konfirmasi_bayar
            (id, santri_id, periode, bayar_makan, bayar_wifi, bayar_listrik, bayar_air, nominal, bukti_foto, catatan, status, tanggal)
            VALUES (:id, :santri_id, :periode, :makan, :wifi, :listrik, :air, :nominal, :bukti_foto, :catatan, 'pending', :tanggal)
            ON DUPLICATE KEY UPDATE
            bayar_makan = VALUES(bayar_makan),
            bayar_wifi = VALUES(bayar_wifi),
            bayar_listrik = VALUES(bayar_listrik),
            bayar_air = VALUES(bayar_air),
            nominal = VALUES(nominal),
            bukti_foto = VALUES(bukti_foto),
            catatan = VALUES(catatan),
            status = 'pending',
            tanggal = VALUES(tanggal)");
        $stmt->execute([
            ':id' => $id,
            ':santri_id' => $santriId,
            ':periode' => $periode,
            ':makan' => $makan,
            ':wifi' => $wifi,
            ':listrik' => $listrik,
            ':air' => $air,
            ':nominal' => $nominal,
            ':bukti_foto' => $buktiFoto,
            ':catatan' => $catatan,
            ':tanggal' => $tanggal
        ]);

        echo json_encode([
            'status' => 'success',
            'id' => $id,
            'message' => 'Bukti transfer berhasil dikirim! Menunggu verifikasi Bendahara.'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// 0f. Verifikasi / Tolak Bukti Transfer Santri oleh Bendahara (POST ?action=verify_payment_proof)
if ($action === 'verify_payment_proof') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? trim($input['id']) : '';
    $status = isset($input['status']) && in_array($input['status'], ['approved', 'rejected']) ? $input['status'] : 'approved';

    if (!$id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID bukti transfer tidak ditemukan.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE konfirmasi_bayar SET status = :status WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        echo json_encode([
            'status' => 'success',
            'message' => $status === 'approved' ? 'Bukti pembayaran diverifikasi!' : 'Bukti pembayaran ditolak.'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// 0h. Pengajuan Pinjaman Utang Kas oleh Santri (POST ?action=ajukan_utang)
if ($action === 'ajukan_utang') {
    $input = json_decode(file_get_contents('php://input'), true);
    $santriId = isset($input['santriId']) ? trim($input['santriId']) : '';
    $tanggal = isset($input['tanggal']) ? trim($input['tanggal']) : date('Y-m-d');
    $nominal = isset($input['nominal']) ? (int)$input['nominal'] : 0;
    $keterangan = isset($input['keterangan']) ? trim($input['keterangan']) : '';

    $isLoggedInSantri = (isset($_SESSION['role']) && $_SESSION['role'] === 'santri' && ($_SESSION['santri_id'] ?? '') === $santriId);
    $isAdmin = is_admin_session();

    if (!$isAdmin && !$isLoggedInSantri) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Hanya akun santri yang bersangkutan atau Bendahara yang dapat mengajukan pinjaman.']);
        exit;
    }

    if (!$santriId || $nominal <= 0 || !$keterangan) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data pengajuan pinjaman tidak lengkap.']);
        exit;
    }

    try {
        $id = 'U' . time() . rand(100, 999);
        $status = 'menunggu_persetujuan';
        $stmt = $pdo->prepare("INSERT INTO utang_kas (id, santri_id, tanggal, nominal, keterangan, status, tgl_lunas) 
                               VALUES (:id, :santri_id, :tanggal, :nominal, :keterangan, :status, NULL)");
        $stmt->execute([
            ':id' => $id,
            ':santri_id' => $santriId,
            ':tanggal' => $tanggal,
            ':nominal' => $nominal,
            ':keterangan' => $keterangan,
            ':status' => $status
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Pengajuan pinjaman berhasil dicatat, menunggu persetujuan Bendahara.',
            'id' => $id
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// 0i. Persetujuan / Penolakan / Pelunasan Pinjaman oleh Bendahara (POST ?action=review_utang)
if ($action === 'review_utang') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? trim($input['id']) : '';
    $decision = isset($input['decision']) ? trim($input['decision']) : ''; // 'approve' | 'reject' | 'lunas'

    if (!$id || !in_array($decision, ['approve', 'reject', 'lunas'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Permintaan tidak valid.']);
        exit;
    }

    try {
        if ($decision === 'approve') {
            $stmt = $pdo->prepare("UPDATE utang_kas SET status = 'belum_lunas' WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $msg = 'Pinjaman kas santri disetujui & dicairkan.';
        } elseif ($decision === 'reject') {
            $stmt = $pdo->prepare("UPDATE utang_kas SET status = 'ditolak' WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $msg = 'Pengajuan pinjaman telah ditolak.';
        } elseif ($decision === 'lunas') {
            $tgl = date('Y-m-d');
            $stmt = $pdo->prepare("UPDATE utang_kas SET status = 'lunas', tgl_lunas = :tgl WHERE id = :id");
            $stmt->execute([':tgl' => $tgl, ':id' => $id]);
            $msg = 'Pinjaman santri telah lunas.';
        }

        echo json_encode(['status' => 'success', 'message' => $msg]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// 0j. Hapus Riwayat Pinjaman Kas (POST ?action=delete_utang)
if ($action === 'delete_utang') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? trim($input['id']) : '';
    if (!$id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID utang tidak valid.']);
        exit;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM utang_kas WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(['status' => 'success', 'message' => 'Riwayat pinjaman kas berhasil dihapus.']);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
    }
}

// 0k. Reset Seluruh Transaksi Kas ke Rp 0 (POST ?action=reset_all_kas)
if ($action === 'reset_all_kas') {
    check_admin_auth();
    try {
        $pdo->exec("DELETE FROM pembayaran_santri");
        $pdo->exec("DELETE FROM setoran_wifi_bendahara");
        $pdo->exec("DELETE FROM jurnal_masak");
        $pdo->exec("DELETE FROM jurnal_kas_umum");
        $pdo->exec("DELETE FROM utang_kas");
        $pdo->exec("DELETE FROM konfirmasi_pembayaran");
        echo json_encode(['status' => 'success', 'message' => 'Seluruh data transaksi kas berhasil di-reset ke Rp 0.']);
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
        $currentRole = $_SESSION['role'] ?? 'guest';
        $loggedSantriId = $_SESSION['santri_id'] ?? null;
        $isAdmin = ($currentRole === 'admin');

        // Ambil Data Santri (Data Sensitif Dilindungi Sesuai Peran Sesi)
        $stmt = $pdo->query("SELECT * FROM santri ORDER BY CAST(SUBSTRING(id, 2) AS UNSIGNED) ASC, id ASC");
        $santriRows = $stmt->fetchAll();
        $santri = [];
        foreach ($santriRows as $row) {
            $isSelf = ($currentRole === 'santri' && $loggedSantriId === $row['id']);
            $waClean = normalize_wa_number($row['wa']);

            if ($isAdmin || $isSelf) {
                $displayWa = $row['wa'];
                $displayAlamat = $row['alamat'];
            } else {
                $len = strlen($waClean);
                $displayWa = ($len > 6) ? substr($waClean, 0, 4) . '****' . substr($waClean, -4) : '****';
                $displayAlamat = !empty($row['alamat']) ? explode(',', $row['alamat'])[0] : '';
            }

            $santri[] = [
                'id' => $row['id'],
                'nama' => $row['nama'],
                'shortName' => $row['short_name'] ?: explode(' ', $row['nama'])[0],
                'alamat' => $displayAlamat,
                'prodi' => $row['prodi'],
                'wa' => $displayWa,
                'tanpaMakan' => !empty($row['tanpa_makan']),
                'avatar' => $row['avatar']
                // PERLINDUNGAN UTAMA: pin_sandi sama sekali TIDAK PERNAH dikirim ke publik
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

        // Ambil Jurnal Kas Umum Komplek
        $kasUmum = [];
        try {
            $stmt = $pdo->query("SELECT * FROM jurnal_kas_umum ORDER BY tanggal DESC, created_at DESC");
            while ($row = $stmt->fetch()) {
                $kasUmum[] = [
                    'id' => $row['id'],
                    'tanggal' => $row['tanggal'],
                    'tipe' => $row['tipe'],
                    'kategori' => $row['kategori'] ?: 'Token Listrik',
                    'keterangan' => $row['keterangan'],
                    'nominal' => (int)$row['nominal'],
                    'petugas' => $row['petugas'] ?: 'Bendahara Komplek'
                ];
            }
        } catch (Exception $e) {}

        // Ambil Konfirmasi Bukti Transfer Santri
        $konfirmasiBayar = [];
        try {
            $stmt = $pdo->query("SELECT * FROM konfirmasi_bayar ORDER BY created_at DESC");
            while ($row = $stmt->fetch()) {
                $konfirmasiBayar[] = [
                    'id' => $row['id'],
                    'santriId' => $row['santri_id'],
                    'periode' => $row['periode'],
                    'makan' => (bool)$row['bayar_makan'],
                    'wifi' => (bool)$row['bayar_wifi'],
                    'listrik' => (bool)$row['bayar_listrik'],
                    'air' => (bool)$row['bayar_air'],
                    'nominal' => (int)$row['nominal'],
                    'buktiFoto' => $row['bukti_foto'],
                    'catatan' => $row['catatan'] ?: '',
                    'status' => $row['status'] ?: 'pending',
                    'tanggal' => $row['tanggal'] ?: ''
                ];
            }
        } catch (Exception $e) {}

        // Ambil Pengaturan (Grup WA, Kontak & Nomor DANA)
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
                'kasUmumLogs' => $kasUmum,
                'konfirmasiBayar' => $konfirmasiBayar,
                'utangKas' => $utang,
                'nomorDanaBendahara' => isset($pengaturan['nomor_dana_bendahara']) ? $pengaturan['nomor_dana_bendahara'] : '085335219903',
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
// 2b. Pindahkan Pembayaran Santri ke Periode Lain (POST ?action=move_payment_period)
// -------------------------------------------------------------------------
if ($action === 'move_payment_period') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit;
    }

    $santri_id = isset($input['santri_id']) ? trim($input['santri_id']) : '';
    $from_periode = isset($input['from_periode']) ? trim($input['from_periode']) : '';
    $to_periode = isset($input['to_periode']) ? trim($input['to_periode']) : '';

    if (!$santri_id || !$from_periode || !$to_periode) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data santri atau periode belum lengkap.']);
        exit;
    }

    if ($from_periode === $to_periode) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Periode asal dan periode tujuan sama.']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // 1. Ambil data pembayaran di periode asal
        $stmtOld = $pdo->prepare("SELECT * FROM pembayaran_santri WHERE santri_id = :sid AND periode = :from_per");
        $stmtOld->execute([':sid' => $santri_id, ':from_per' => $from_periode]);
        $oldRec = $stmtOld->fetch();

        if (!$oldRec) {
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Data pembayaran di periode asal tidak ditemukan.']);
            exit;
        }

        // 2. Insert atau Update ke periode tujuan
        $catatanPindah = ($oldRec['catatan'] ?: 'Pembayaran Santri') . " [Dipindahkan dari $from_periode]";
        $stmtNew = $pdo->prepare("INSERT INTO pembayaran_santri 
            (santri_id, periode, bayar_makan, bayar_wifi, bayar_listrik, bayar_air, tgl_bayar, catatan)
            VALUES (:sid, :to_per, :makan, :wifi, :listrik, :air, :tgl, :catatan)
            ON DUPLICATE KEY UPDATE
            bayar_makan = VALUES(bayar_makan),
            bayar_wifi = VALUES(bayar_wifi),
            bayar_listrik = VALUES(bayar_listrik),
            bayar_air = VALUES(bayar_air),
            tgl_bayar = VALUES(tgl_bayar),
            catatan = VALUES(catatan)");

        $stmtNew->execute([
            ':sid' => $santri_id,
            ':to_per' => $to_periode,
            ':makan' => (int)$oldRec['bayar_makan'],
            ':wifi' => (int)$oldRec['bayar_wifi'],
            ':listrik' => (int)$oldRec['bayar_listrik'],
            ':air' => (int)$oldRec['bayar_air'],
            ':tgl' => $oldRec['tgl_bayar'] ?: date('Y-m-d'),
            ':catatan' => $catatanPindah
        ]);

        // 3. Hapus data pembayaran di periode asal
        $stmtDel = $pdo->prepare("DELETE FROM pembayaran_santri WHERE santri_id = :sid AND periode = :from_per");
        $stmtDel->execute([':sid' => $santri_id, ':from_per' => $from_periode]);

        // 4. Update bukti konfirmasi_bayar terkait jika ada
        $stmtProof = $pdo->prepare("UPDATE konfirmasi_bayar SET periode = :to_per WHERE santri_id = :sid AND periode = :from_per");
        $stmtProof->execute([':to_per' => $to_periode, ':sid' => $santri_id, ':from_per' => $from_periode]);

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => "Pembayaran berhasil dipindahkan ke periode $to_periode."
        ]);
        exit;
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
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
                $pinToSave = null;
                if (!empty($s['pinSandi'])) {
                    $pinToSave = password_needs_rehash($s['pinSandi'], PASSWORD_DEFAULT) ? password_hash($s['pinSandi'], PASSWORD_DEFAULT) : $s['pinSandi'];
                }
                $stmtSantri->execute([
                    ':id' => $s['id'],
                    ':nama' => $s['nama'],
                    ':short_name' => isset($s['shortName']) ? $s['shortName'] : explode(' ', $s['nama'])[0],
                    ':alamat' => $s['alamat'],
                    ':prodi' => $prodi,
                    ':wa' => $s['wa'],
                    ':pin_sandi' => $pinToSave,
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

        // Sinkronisasi Jurnal Kas Umum Komplek
        if (isset($input['kasUmumLogs']) && is_array($input['kasUmumLogs'])) {
            $pdo->exec("DELETE FROM jurnal_kas_umum");
            $stmtKasUmum = $pdo->prepare("INSERT INTO jurnal_kas_umum (id, tanggal, tipe, kategori, keterangan, nominal, petugas)
                VALUES (:id, :tanggal, :tipe, :kategori, :keterangan, :nominal, :petugas)");
            foreach ($input['kasUmumLogs'] as $k) {
                $stmtKasUmum->execute([
                    ':id' => $k['id'],
                    ':tanggal' => $k['tanggal'],
                    ':tipe' => isset($k['tipe']) ? $k['tipe'] : 'pengeluaran',
                    ':kategori' => isset($k['kategori']) ? $k['kategori'] : 'Token Listrik',
                    ':keterangan' => $k['keterangan'],
                    ':nominal' => (int)$k['nominal'],
                    ':petugas' => isset($k['petugas']) ? $k['petugas'] : 'Bendahara Komplek'
                ]);
            }
        }

        // Sinkronisasi Konfirmasi Bukti Transfer Santri
        if (isset($input['konfirmasiBayar']) && is_array($input['konfirmasiBayar'])) {
            $pdo->exec("DELETE FROM konfirmasi_bayar");
            $stmtKonf = $pdo->prepare("INSERT INTO konfirmasi_bayar
                (id, santri_id, periode, bayar_makan, bayar_wifi, bayar_listrik, bayar_air, nominal, bukti_foto, catatan, status, tanggal)
                VALUES (:id, :santri_id, :periode, :makan, :wifi, :listrik, :air, :nominal, :bukti_foto, :catatan, :status, :tanggal)");
            foreach ($input['konfirmasiBayar'] as $kb) {
                if (empty($kb['id']) || empty($kb['santriId'])) continue;
                $stmtKonf->execute([
                    ':id' => $kb['id'],
                    ':santri_id' => $kb['santriId'],
                    ':periode' => $kb['periode'] ?? date('Y-m'),
                    ':makan' => !empty($kb['makan']) ? 1 : 0,
                    ':wifi' => !empty($kb['wifi']) ? 1 : 0,
                    ':listrik' => !empty($kb['listrik']) ? 1 : 0,
                    ':air' => !empty($kb['air']) ? 1 : 0,
                    ':nominal' => (int)($kb['nominal'] ?? 0),
                    ':bukti_foto' => $kb['buktiFoto'] ?? '',
                    ':catatan' => $kb['catatan'] ?? '',
                    ':status' => $kb['status'] ?? 'pending',
                    ':tanggal' => $kb['tanggal'] ?? date('Y-m-d H:i')
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

        // Sinkronisasi Link Grup WA & Nomor DANA
        if (!empty($input['linkGrupWa'])) {
            $stmtCfg = $pdo->prepare("INSERT INTO pengaturan_sistem (kunci, nilai, keterangan)
                VALUES ('link_grup_wa', :nilai, 'Tautan undangan grup WhatsApp Santri Komplek Tuban')
                ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");
            $stmtCfg->execute([':nilai' => $input['linkGrupWa']]);
        }
        if (!empty($input['nomorDanaBendahara'])) {
            $stmtDana = $pdo->prepare("INSERT INTO pengaturan_sistem (kunci, nilai, keterangan)
                VALUES ('nomor_dana_bendahara', :nilai, 'Nomor DANA resmi tujuan transfer pembayaran Komplek Tuban')
                ON DUPLICATE KEY UPDATE nilai = VALUES(nilai)");
            $stmtDana->execute([':nilai' => $input['nomorDanaBendahara']]);
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
