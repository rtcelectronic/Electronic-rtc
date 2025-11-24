document.addEventListener('DOMContentLoaded', function() { // <<<< ห่อหุ้มโค้ดทั้งหมด

    // 1. ประกาศฟังก์ชันให้เป็น Global เพื่อให้ HTML เรียกใช้จาก onchange ได้
    window.displaySchedule = function() {
        // 1. รับค่าที่เลือกจาก dropdown
        const selectedYear = document.getElementById('year-select').value;
        const pdfContainer = document.getElementById('pdf-container');
        
        // ตรวจสอบความพร้อมของ Element
        const yearSelect = document.getElementById('year-select');
        if (!yearSelect || !pdfContainer) {
             // console.error("Required elements (year-select or pdf-container) not found.");
             return;
        }

        // 2. ล้างเนื้อหาเดิม
        pdfContainer.innerHTML = '';

        if (selectedYear) {
            // 3. กำหนดชื่อไฟล์ PDF ตามชั้นปีที่เลือก
            const pdfFileName = `schedules/year_${selectedYear}_schedule.pdf`;

            // 4. สร้าง iframe สำหรับแสดง PDF
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', pdfFileName);
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '800px'); // กำหนดความสูงตามที่ต้องการ
            iframe.setAttribute('title', `ตารางสอนชั้นปีที่ ${selectedYear}`);
            
            // 5. นำ iframe ไปใส่ใน div
            pdfContainer.appendChild(iframe);
            
            // 6. ข้อความสำรองหากเบราว์เซอร์ไม่รองรับ iframe หรือการแสดง PDF
            const fallbackLink = document.createElement('p');
            fallbackLink.innerHTML = `หากตารางสอนไม่แสดงผล, <a href="${pdfFileName}" target="_blank">คลิกที่นี่เพื่อดาวน์โหลดตารางสอนชั้นปีที่ ${selectedYear}</a>.`;
            pdfContainer.appendChild(fallbackLink);
            
        } else {
            // แสดงข้อความเริ่มต้นเมื่อไม่มีการเลือกชั้นปี
            pdfContainer.innerHTML = '<p>เลือกชั้นปีเพื่อดูตารางสอน</p>';
        }
    }

    // เรียกฟังก์ชันครั้งแรกเพื่อโหลดข้อความเริ่มต้น
    window.displaySchedule(); 

}); // <<<< ปิดฟังก์ชันห่อหุ้ม