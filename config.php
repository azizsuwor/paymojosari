<?php
// =========================================================================
// KONEKSI DATABASE HYBRID: LARAGON (LOKAL) & INFINITYFREE (ONLINE)
// PAYMOJOSARI — PP. MOJOSARI KOMPLEK TUBAN (RUMAH WAKAF)
// =========================================================================

$host = $_SERVER['HTTP_HOST'] ?? '';
$is_local = in_array($host, ['localhost', '127.0.0.1']) || strpos($host, 'localhost:') === 0 || strpos($host, '127.0.0.1:') === 0;

if ($is_local) {
    // Konfigurasi Database Lokal (Laragon)
    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = '';
    $db_name = 'db_kas_mojosari';
} else {
    // Konfigurasi Database Online (InfinityFree)
    $db_host = 'sql101.infinityfree.com';
    $db_user = 'if0_43321488';
    $db_pass = 'Mojosari2026';
    $db_name = 'if0_43321488_kas';
}

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Koneksi ke Database Gagal: ' . $e->getMessage()
    ]);
    exit;
}
