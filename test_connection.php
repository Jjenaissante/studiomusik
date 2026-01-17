<?php
/**
 * StudioMusik - Database Connection Test
 * Updated: Jan 06, 2026
 */

require_once 'config.php';

echo "<!DOCTYPE html>";
echo "<html lang='id'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>Test Koneksi Database - StudioMusik</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }";
echo ".container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }";
echo "h1 { color: #4f46e5; text-align: center; margin-bottom: 30px; }";
echo ".test-result { margin: 20px 0; padding: 15px; border-radius: 5px; }";
echo ".success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }";
echo ".error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }";
echo ".info { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }";
echo "table { width: 100%; border-collapse: collapse; margin-top: 20px; }";
echo "th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }";
echo "th { background: #f9fafb; font-weight: 600; }";
echo "</style>";
echo "</head>";
echo "<body>";
echo "<div class='container'>";
echo "<h1><i class='fas fa-database'></i> Test Koneksi Database</h1>";

// Test database connection
echo "<div class='test-result info'>";
echo "<h3>Testing Database Connection...</h3>";

if ($conn && $conn->ping()) {
    echo "<div class='test-result success'>";
    echo "<h4><i class='fas fa-check-circle'></i> Koneksi Berhasil!</h4>";
    echo "<p>Server: {$db_config['host']}:{$db_config['port']}</p>";
    echo "<p>Database: {$db_config['db_name']}</p>";
    echo "<p>Charset: {$db_config['charset']}</p>";
    echo "</div>";
    
    // Test query
echo "<div class='test-result info'>";
    echo "<h3>Testing Database Queries...</h3>";
    
    try {
        // Test 1: Count users
        $result = $conn->query("SELECT COUNT(*) as total FROM user");
        $userCount = $result->fetch_assoc()['total'];
        echo "<div class='test-result success'>";
        echo "<h4><i class='fas fa-check-circle'></i> Query Test 1 - Users: OK</h4>";
        echo "<p>Total users: {$userCount}</p>";
        echo "</div>";
        
        // Test 2: Count studios
        $result = $conn->query("SELECT COUNT(*) as total FROM studio");
        $studioCount = $result->fetch_assoc()['total'];
        echo "<div class='test-result success'>";
        echo "<h4><i class='fas fa-check-circle'></i> Query Test 2 - Studios: OK</h4>";
        echo "<p>Total studios: {$studioCount}</p>";
        echo "</div>";
        
        // Test 3: Count bookings
        $result = $conn->query("SELECT COUNT(*) as total FROM booking");
        $bookingCount = $result->fetch_assoc()['total'];
        echo "<div class='test-result success'>";
        echo "<h4><i class='fas fa-check-circle'></i> Query Test 3 - Bookings: OK</h4>";
        echo "<p>Total bookings: {$bookingCount}</p>";
        echo "</div>";
        
        // Show database structure
echo "<div class='test-result info'>";
        echo "<h3>Database Structure</h3>";
        echo "<table>";
        echo "<thead><tr><th>Table</th><th>Records</th><th>Status</th></tr></thead>";
        echo "<tbody>";
        
        $tables = ['user', 'admin', 'studio', 'ruangan', 'booking', 'detail_booking', 'jadwal_ketersediaan', 'ulasan'];
        foreach ($tables as $table) {
            $result = $conn->query("SELECT COUNT(*) as total FROM {$table}");
            $count = $result->fetch_assoc()['total'];
            echo "<tr>";
            echo "<td>{$table}</td>";
            echo "<td>{$count}</td>";
            echo "<td><i class='fas fa-check-circle' style='color: #10b981;'></i> OK</td>";
            echo "</tr>";
        }
        
        echo "</tbody>";
        echo "</table>";
        echo "</div>";
        
        // Show connection info
echo "<div class='test-result info'>";
        echo "<h3>Connection Statistics</h3>";
        echo "<p>Server version: " . $conn->server_info . "</p>";
        echo "<p>Client info: " . $conn->client_info . "</p>";
        echo "<p>Host info: " . $conn->host_info . "</p>";
        echo "</div>";
        
        echo "<div class='test-result success'>";
        echo "<h3><i class='fas fa-check-circle'></i> Semua test berhasil!</h3>";
        echo "<p>Sistem siap digunakan.</p>";
        echo "</div>";
        
    } catch (Exception $e) {
        echo "<div class='test-result error'>";
        echo "<h4><i class='fas fa-times-circle'></i> Query Error</h4>";
        echo "<p>Error: " . $e->getMessage() . "</p>";
        echo "</div>";
    }
    
} else {
    echo "<div class='test-result error'>";
    echo "<h4><i class='fas fa-times-circle'></i> Koneksi Gagal!</h4>";
    echo "<p>Error: " . $conn->connect_error . "</p>";
    echo "<p>Server: {$db_config['host']}:{$db_config['port']}</p>";
    echo "<p>Database: {$db_config['db_name']}</p>";
    echo "</div>";
}

echo "</div>";
echo "</div>";
echo "</body>";
echo "</html>";
?>