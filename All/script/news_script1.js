// --- ส่วนข้อมูล (แก้ไขตรงนี้เพื่อเปลี่ยนรูป/ข้อความ) ---
const slidesData = [
    {
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        title: 'Web Development',
        text: 'การเขียนโปรแกรมเว็บไซต์ด้วย HTML, CSS และ JS'
    },
    {
        image: 'https://images.unsplash.com/photo-1550009158-9ebf6905e9e0?w=800&q=80',
        title: 'Microcontroller',
        text: 'การเชื่อมต่อวงจรและเขียนโปรแกรมควบคุม ESP32'
    },
    {
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        title: 'Cyber Security',
        text: 'ความปลอดภัยของระบบเครือข่ายและข้อมูล'
    }
];

let currentIndex = 0; // ตัวแปรเก็บลำดับภาพปัจจุบัน

// ดึง Element จาก HTML มาเตรียมไว้
const imgEl = document.getElementById('myImage');
const titleEl = document.getElementById('myTitle');
const descEl = document.getElementById('myDesc');

// ฟังก์ชันแสดงผล Slide
function showSlide(index) {
    // ตรวจสอบขอบเขตของ Index (ถ้าเกินให้วนกลับ)
    if (index >= slidesData.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = slidesData.length - 1;
    } else {
        currentIndex = index;
    }

    // ดึงข้อมูลจาก Array ตามตำแหน่งปัจจุบัน
    const currentSlide = slidesData[currentIndex];

    // อัปเดตหน้าเว็บ
    imgEl.src = currentSlide.image;
    titleEl.textContent = currentSlide.title;
    descEl.textContent = currentSlide.text;
}

// ฟังก์ชันสำหรับปุ่มกด (รับค่า +1 หรือ -1)
function changeSlide(n) {
    showSlide(currentIndex + n);
}

// เริ่มต้นทำงาน: แสดง Slide แรกทันทีที่โหลดเสร็จ
showSlide(0);

// (Option) ถ้าอยากให้เลื่อนอัตโนมัติทุก 5 วินาที ให้เอา Comment บรรทัดล่างออก
// setInterval(() => changeSlide(1), 5000);