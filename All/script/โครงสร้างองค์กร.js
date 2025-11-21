        // ==========================================
        // ส่วนตั้งค่า: แก้ไขชื่อไฟล์ PDF ตรงนี้ได้เลย
        // ==========================================
        const scheduleConfig = {
            // 'valueจากoption': 'path/to/ไฟล์.pdf'
            'vc1':  '../ตารางเรียน/วิชาโครงงาน.pdf',   // ตาราง ปวช. 1
            'vc2':  '../ตารางเรียน/วิชาโครงงาน.pdf',   // ตาราง ปวช. 2
            'vc3':  'schedules/vc3_schedule.pdf',   // ตาราง ปวช. 3
            'hvc1': 'schedules/hvc1_schedule.pdf',  // ตาราง ปวส. 1
            'hvc2': 'schedules/hvc2_schedule.pdf'   // ตาราง ปวส. 2
        };

        // ฟังก์ชันสำหรับเปลี่ยน PDF
        function changeSchedule() {
            const selectBox = document.getElementById('yearSelect');
            const viewer = document.getElementById('pdfViewer');
            const statusMsg = document.getElementById('fileNameDisplay');
            
            const selectedYear = selectBox.value;
            const pdfPath = scheduleConfig[selectedYear];

            if (pdfPath) {
                // เปลี่ยน src ของ iframe เป็นไฟล์ใหม่
                viewer.src = pdfPath;
                statusMsg.innerHTML = `กำลังแสดงผล: <strong>${pdfPath}</strong>`;
            } else {
                statusMsg.textContent = "ไม่พบไฟล์ตารางเรียนสำหรับชั้นปีนี้";
            }
        }