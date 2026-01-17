<?php

// 1. SETTING SESSION
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(0, '/');
    session_start();
}

// 2. DATABASE CONFIG
$db_config = [
    'host'     => '127.0.0.1',
    'user'     => 'root',        
    'pass'     => '',            
    'db_name'  => 'studio_musik',
    'port'     => 3306,
    'charset'  => 'utf8mb4'
];

// Matikan error reporting default agar tidak merusak JSON
mysqli_report(MYSQLI_REPORT_OFF);

$conn = new mysqli($db_config['host'], $db_config['user'], $db_config['pass'], $db_config['db_name'], $db_config['port']);

// Cek Koneksi: Jika gagal, kirim JSON (Bukan teks biasa/die)
if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Koneksi Database Gagal: ' . $conn->connect_error
    ]);
    exit;
}

// 3. HELPER FUNCTIONS (Dibungkus function_exists agar tidak error "Redeclare")
if (!function_exists('clean_input')) {
    function clean_input($data) {
        global $conn;
        if (is_array($data)) return array_map('clean_input', $data);
        return $conn->real_escape_string(htmlspecialchars(stripslashes(trim($data))));
    }
}

if (!function_exists('generate_id')) {
    function generate_id($prefix = '', $length = 3) {
        $chars = '0123456789';
        $res = '';
        for ($i = 0; $i < $length; $i++) $res .= $chars[rand(0, strlen($chars) - 1)];
        return $prefix . $res;
    }
}
?>