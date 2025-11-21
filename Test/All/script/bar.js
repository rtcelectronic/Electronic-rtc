document.addEventListener('DOMContentLoaded', function() { 
    // 1. กำหนดรูปภาพ
    const images = [
        "../images/สไลด์ข่าวสาร/ผอ.jpg",
        "All/images/สไลด์ข่าวสาร/ผลงาน.jpg",
        "news/photo/สมัคร.jpg", 
        
        
    ];

    let currentIndex = 0;
    let autoSlideInterval; // ตัวแปรสำหรับเก็บตัวจับเวลา
    const imgElement = document.getElementById('slider-image');

    if (!imgElement) {
        console.error("ไม่พบ Element ID: slider-image");
        return; 
    }

    function showImage(index) {
        if (index < 0) currentIndex = images.length - 1;
        else if (index >= images.length) currentIndex = 0;
        else currentIndex = index;
        
        imgElement.src = images[currentIndex];
    }

    // ฟังก์ชันเริ่มนับเวลาใหม่
    function startAutoSlide() {
        // ล้างตัวจับเวลาเก่าออกก่อน (กันซ้อน)
        clearInterval(autoSlideInterval);
        // ตั้งเวลาใหม่ 3000ms = 3 วินาที
        autoSlideInterval = setInterval(function() {
            window.nextSlide();
        }, 3000);
    }

    // 2. ประกาศฟังก์ชันให้เป็น Global
    window.nextSlide = function() { 
        showImage(currentIndex + 1);
        startAutoSlide(); // รีเซ็ตเวลานับถอยหลังใหม่เมื่อกดปุ่ม
    };

    window.prevSlide = function() { 
        showImage(currentIndex - 1);
        startAutoSlide(); // รีเซ็ตเวลานับถอยหลังใหม่เมื่อกดปุ่ม
    };

    // 3. เริ่มการทำงาน
    showImage(0);      // แสดงภาพแรก
    startAutoSlide();  // เริ่มจับเวลาอัตโนมัติ

});