<?php
// =========================================================================
// KONEKSI DATABASE LARAGON (MySQL)
// SIM-KAS PP. MOJOSARI KOMPLEK TUBAN (RUMAH WAKAF)
// =========================================================================

$db_host = 'localhost';
$db_user = 'root';
$db_pass = ''; // Default password root Laragon adalah kosong
$db_name = 'db_kas_mojosari';

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
        'message' => 'Koneksi ke MySQL Laragon Gagal: ' . $e->getMessage()
    ]);
    exit;
}
