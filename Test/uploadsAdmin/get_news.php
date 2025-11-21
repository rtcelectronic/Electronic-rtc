<?php
header('Content-Type: application/json');
include 'db.php';

// ดึงข้อมูล เรียงจากล่าสุดไปเก่าสุด
$sql = "SELECT * FROM news ORDER BY id DESC";
$result = $conn->query($sql);

$news_list = array();

while($row = $result->fetch_assoc()) {
    $news_list[] = $row;
}

echo json_encode($news_list);
$conn->close();
?>
