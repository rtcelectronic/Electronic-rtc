<?php
include 'db.php';

// รับค่าจากฟอร์ม
$title = $_POST['title'];
$content = $_POST['content'];
$image_path = "";

// ส่วนจัดการอัพโหลดไฟล์รูปภาพ
if(isset($_FILES["news_image"]) && $_FILES["news_image"]["error"] == 0) {
    $target_dir = "uploads/";
    
    // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    // ตั้งชื่อไฟล์ใหม่เพื่อป้องกันชื่อซ้ำ (เช่น time_ชื่อไฟล์เดิม.jpg)
    $filename = time() . "_" . basename($_FILES["news_image"]["name"]);
    $target_file = $target_dir . $filename;

    // ย้ายไฟล์จาก Temp ไป folder uploads
    if (move_uploaded_file($_FILES["news_image"]["tmp_name"], $target_file)) {
        $image_path = $target_file; // เก็บ path ไว้บันทึกลง DB
    }
}

// บันทึกลงฐานข้อมูล
$sql = "INSERT INTO news (title, content, image_path) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $title, $content, $image_path);

if ($stmt->execute()) {
    echo "บันทึกข้อมูลสำเร็จ! <a href='index.html'>ไปดูหน้าเว็บ</a> หรือ <a href='admin.html'>เพิ่มอีก</a>";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
