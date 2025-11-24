document.addEventListener('DOMContentLoaded', function() { // <<<< ห่อหุ้มโค้ดทั้งหมด

    // ==========================================
    // ส่วนตั้งค่า: แก้ไขชื่อไฟล์ PDF ตรงนี้ได้เลย
    // ==========================================
    const scheduleConfig = {
        // 'valueจากoption': 'path/to/ไฟล์.pdf'
        'vc1':  '../ตารางเรียน/วิชาโครงงาน.pdf',   // ตาราง ปวช. 1
        'vc2':  '../ตารางเรียน/วิชาโครงงาน.pdf',   // ตาราง ปวช. 2
        'vc3':  'schedules/vc3_schedule.pdf',   // ตาราง ปวช. 3
        'hvc1': 'schedules/hvc1_schedule.pdf',  // ตาราง ปวส. 1
        'hvc2': 'schedules/hvc2_schedule.pdf'   // ตาราง ปวส. 2
    };

    // ฟังก์ชันสำหรับเปลี่ยน PDF (กำหนดเป็น Global เพื่อให้ HTML เรียกใช้ได้)
    window.changeSchedule = function() {
        const selectBox = document.getElementById('yearSelect');
        const viewer = document.getElementById('pdfViewer');
        const statusMsg = document.getElementById('fileNameDisplay');
        
        // ตรวจสอบความพร้อมของ Element สำคัญ
        if (!selectBox || !viewer || !statusMsg) {
            console.error("ไม่พบ Element ที่จำเป็นสำหรับตารางเรียน (yearSelect, pdfViewer, หรือ fileNameDisplay)");
            return;
        }

        const selectedYear = selectBox.value;
        const pdfPath = scheduleConfig[selectedYear];

        if (pdfPath) {
            // เปลี่ยน src ของ iframe เป็นไฟล์ใหม่
            viewer.src = pdfPath;
            statusMsg.innerHTML = `กำลังแสดงผล: <strong>${pdfPath}</strong>`;
        } else {
            // ล้าง iframe เมื่อไม่มีการเลือกหรือไม่มีไฟล์
            viewer.src = ""; 
            statusMsg.textContent = "กรุณาเลือกชั้นปีเพื่อดูตารางเรียน";
        }
    }

    // เรียกฟังก์ชันครั้งแรกเพื่อโหลดสถานะเริ่มต้น/ข้อความเริ่มต้น
    window.changeSchedule();

}); // <<<< ปิดฟังก์ชันห่อหุ้ม