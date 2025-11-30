<?php
// Database setup script for Eye Clinic Management System

$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'final_sys';

try {
    // Connect to MySQL server (without database selection)
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $pdo->exec($sql);
    
    echo "✓ Database '$database' created successfully!\n";
    echo "\nYou can now run: php artisan migrate:fresh --seed\n";
    
} catch (PDOException $e) {
    echo "✗ Error creating database: " . $e->getMessage() . "\n";
    echo "\nPlease create the database manually using:\n";
    echo "  CREATE DATABASE final_sys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n";
    exit(1);
}
