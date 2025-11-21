<?php
$servername = "localhost";
$username = "root";     // ชื่อผู้ใช้ปกติของ XAMPP
$password = "";         // รหัสผ่านปกติจะว่างไว้
$dbname = "my_website"; // ชื่อฐานข้อมูลที่สร้างไว้

// สร้างการเชื่อมต่อ
$conn = new mysqli($servername, $username, $password, $dbname);

// เช็ค error
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ตั้งค่าให้อ่านภาษาไทยออก
$conn->set_charset("utf8");
?>
