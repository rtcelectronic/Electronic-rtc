document.addEventListener('DOMContentLoaded', function() { // <<<< เริ่มต้น: ห่อหุ้มโค้ดทั้งหมด 

    // ใช้ localStorage สำหรับการจำลองการจัดเก็บเอกสาร
    // *** ข้อควรทราบ: สำหรับแอปพลิเคชันจริง ควรใช้ Firebase Firestore หรือ Backend Storage เพื่อความเสถียรและความปลอดภัย ***
    const STORAGE_KEY = 'All/เอกสาร';
    
    // DOM Elements
    // ประกาศตัวแปร DOM ทั้งหมดภายใน DOMContentLoaded 
    const documentView = document.getElementById('document-view');
    const adminView = document.getElementById('admin-view');
    const toggleViewBtn = document.getElementById('toggle-view-btn');
    const backToDocBtn = document.getElementById('back-to-doc-btn');
    const documentGrid = document.getElementById('document-grid');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadedFilesList = document.getElementById('uploaded-files-list');
    const uploadAllBtn = document.getElementById('upload-all-btn');
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const closeAlertBtn = document.getElementById('close-alert-btn');

    // State
    let filesToUpload = [];

    // --- Utility Functions ---
    
    // ฟังก์ชันแสดง Alert แทน window.alert()
    function showAlert(message) {
        if (alertMessage && customAlert) { // ป้องกัน Error หาก Element Alert หายไป
            alertMessage.textContent = message;
            customAlert.classList.remove('hidden');
        }
    }

    // ฟังก์ชันปิด Alert
    if (closeAlertBtn) {
        closeAlertBtn.addEventListener('click', () => {
            customAlert.classList.add('hidden');
        });
    }

    // ฟังก์ชันสำหรับสร้างวันที่/เวลาปัจจุบันในรูปแบบที่กำหนด
    function getCurrentFormattedDate() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleDateString('th-TH', { month: 'short' });
        const year = now.getFullYear() + 543; // พ.ศ.
        const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        return `${day} ${month}. ${year} ${time}`;
    }
    
    // --- Document Rendering Functions ---

    // ฟังก์ชันดึงข้อมูลเอกสารจาก localStorage
    function getDocuments() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // ฟังก์ชันบันทึกข้อมูลเอกสารไปยัง localStorage
    function saveDocuments(documents) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    }

    // ฟังก์ชันสร้าง Card เอกสาร
    function createDocumentCard(doc) {
        const isPDF = doc.mimeType === 'application/pdf';
        const fileIcon = isPDF ? 'fa-file-pdf' : 'fa-file-word';
        const pdfDownloadLink = doc.pdfUrl || '#'; 
        const wordDownloadLink = doc.wordUrl || '#';
        
        return `
            <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">
                <div class="bg-gray-100 h-32 flex flex-col items-center justify-center p-4">
                    <div class="doc-icon-placeholder">
                        <i class="fas ${fileIcon}"></i>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">คลิกเพื่อดาวน์โหลดไฟล์ ${isPDF ? 'PDF' : 'Word'}</p>
                </div>
                
                <div class="p-4 flex-grow">
                    <div class="text-base font-semibold text-gray-800 truncate">${doc.name}</div>
                    <div class="text-xs text-gray-500 mt-1">อัปโหลด: ${doc.date}</div>
                </div>

                <div class="p-4 pt-0 flex justify-between gap-2">
                    <a href="${pdfDownloadLink}" download="${doc.name}.pdf" 
                        class="flex-1 flex items-center justify-center bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-150 text-sm">
                        <i class="fas fa-file-pdf mr-2"></i> PDF ดาวน์โหลด
                    </a>
                    <a href="${wordDownloadLink}" download="${doc.name}.docx"
                        class="flex-1 flex items-center justify-center bg-gray-500 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition duration-150 text-sm">
                        <i class="fas fa-file-word mr-2"></i> Word
                    </a>
                </div>
            </div>
        `;
    }

    // ฟังก์ชันแสดงเอกสารทั้งหมดใน Grid
    function renderDocumentGrid() {
        if (!documentGrid) return; // ออกหากไม่พบ Grid

        const documents = getDocuments();
        if (documents.length === 0) {
            documentGrid.innerHTML = '<p class="text-gray-500 text-center col-span-full">ยังไม่มีเอกสารในระบบ</p>';
            return;
        }
        documentGrid.innerHTML = documents.map(createDocumentCard).join('');
    }

    // --- View Switching Logic ---

    if (toggleViewBtn && documentView && adminView) {
        toggleViewBtn.addEventListener('click', () => {
            documentView.classList.add('hidden');
            adminView.classList.remove('hidden');
            toggleViewBtn.classList.add('hidden');
        });
    }

    if (backToDocBtn && documentView && adminView && toggleViewBtn) {
        backToDocBtn.addEventListener('click', () => {
            // โหลดเอกสารล่าสุดก่อนกลับหน้าหลัก
            renderDocumentGrid(); 
            adminView.classList.add('hidden');
            documentView.classList.remove('hidden');
            toggleViewBtn.classList.remove('hidden');
            
            // ล้างสถานะไฟล์ใน Admin View
            filesToUpload = [];
            // ตรวจสอบ uploadedFilesList ก่อนเรียกใช้
            if(uploadedFilesList) renderFilesToUploadList(); 
            if(uploadAllBtn) uploadAllBtn.disabled = true;
        });
    }

    // --- Drag & Drop / Upload Logic ---

    if (dropZone && fileInput) { // ตรวจสอบ Element 
        // 1. เปิดใช้งาน input file เมื่อคลิกที่ Drop Zone
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // 2. ป้องกันพฤติกรรมเริ่มต้นของเบราว์เซอร์
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // 3. จัดการ Visual Feedback
        dropZone.addEventListener('dragenter', highlight, false);
        dropZone.addEventListener('dragover', highlight, false);
        dropZone.addEventListener('dragleave', unhighlight, false);
        dropZone.addEventListener('drop', unhighlight, false);

        function highlight() {
            dropZone.classList.add('dragover');
        }

        function unhighlight() {
            dropZone.classList.remove('dragover');
        }

        // 4. จัดการไฟล์ที่ถูก Drop หรือเลือกจาก Input
        dropZone.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files), false); 

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            const newFiles = Array.from(files).filter(file => {
                const mimeType = file.type;
                const extension = file.name.split('.').pop().toLowerCase();
                // อนุญาตเฉพาะ PDF และ DOCX
                return mimeType === 'application/pdf' || 
                        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                        extension === 'pdf' || extension === 'docx';
            });

            if (newFiles.length > 0) {
                // เพิ่มไฟล์ใหม่เข้าในรายการ (รองรับการลากไฟล์เดิมซ้ำได้)
                filesToUpload = [...filesToUpload, ...newFiles];
                renderFilesToUploadList();
                if(uploadAllBtn) uploadAllBtn.disabled = false;
            } else {
                showAlert('กรุณาเลือกเฉพาะไฟล์ PDF (.pdf) หรือ Word (.docx) เท่านั้น');
            }
        }
    }


    // 5. แสดงรายชื่อไฟล์ที่ถูกเลือก
    function renderFilesToUploadList() {
        if (!uploadedFilesList) return; // ออกหากไม่พบ List

        uploadedFilesList.innerHTML = '';
        if (filesToUpload.length === 0) {
            uploadedFilesList.innerHTML = '<li class="text-gray-400">ยังไม่มีไฟล์ในรายการ...</li>';
            if(uploadAllBtn) uploadAllBtn.disabled = true;
            return;
        }
        
        filesToUpload.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center border-b pb-1 last:border-b-0';
            
            const typeIcon = file.type === 'application/pdf' ? 'fa-file-pdf text-red-600' : 'fa-file-word text-blue-600';
            
            li.innerHTML = `
                <span><i class="fas ${typeIcon} mr-2"></i> ${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
                <button data-index="${index}" class="remove-file-btn text-red-500 hover:text-red-700 text-sm font-semibold">ลบ</button>
            `;
            uploadedFilesList.appendChild(li);
        });
        
        // เพิ่ม Event Listener ให้ปุ่มลบ
        document.querySelectorAll('.remove-file-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                filesToUpload.splice(indexToRemove, 1);
                renderFilesToUploadList();
                if (filesToUpload.length === 0 && uploadAllBtn) {
                    uploadAllBtn.disabled = true;
                }
            });
        });
        
        if(uploadAllBtn) uploadAllBtn.disabled = false;
    }

    // 6. จัดการปุ่มอัปโหลดทั้งหมด (จำลองการบันทึก)
    if (uploadAllBtn) { // ตรวจสอบ Element 
        uploadAllBtn.addEventListener('click', () => {
            if (filesToUpload.length === 0) {
                showAlert('ไม่มีไฟล์ที่ต้องอัปโหลด');
                return;
            }

            // *** ขั้นตอนนี้คือการจำลองการอัปโหลดไฟล์ไปยัง Server ***
            const currentDocuments = getDocuments();
            let newId = currentDocuments.reduce((max, doc) => Math.max(max, doc.id), 0) + 1;

            filesToUpload.forEach(file => {
                const mimeType = file.type;
                
                // จำลองการสร้างลิงก์สำหรับดาวน์โหลด (ใช้ Blob/ObjectURL เพื่อให้ดาวน์โหลดได้จริง)
                const fileUrl = URL.createObjectURL(file);
                
                const newDoc = {
                    id: newId++,
                    name: file.name.substring(0, file.name.lastIndexOf('.')) || file.name, // ตัดนามสกุล
                    date: getCurrentFormattedDate(),
                    mimeType: mimeType,
                    pdfUrl: mimeType === 'application/pdf' ? fileUrl : '#',
                    wordUrl: mimeType !== 'application/pdf' ? fileUrl : '#',
                };
                currentDocuments.push(newDoc);
            });
            
            saveDocuments(currentDocuments); // บันทึกข้อมูลใหม่
            
            // แสดงข้อความสำเร็จ
            showAlert(`อัปโหลดไฟล์ ${filesToUpload.length} รายการสำเร็จ!`);

            // ล้างสถานะ
            filesToUpload = [];
            renderFilesToUploadList();
            uploadAllBtn.disabled = true;
            
            // กลับไปหน้าหลักโดยอัตโนมัติ
            // backToDocBtn.click(); // หากต้องการให้กลับทันทีโดยอัตโนมัติ ให้เปิดใช้งานโค้ดนี้
        });
    }

    // --- Initialization ---

    // กำหนดข้อมูลเริ่มต้นหากยังไม่มีใน localStorage
    if (getDocuments().length === 0) {
        const initialData = [
            { id: 1, name: "คู่มือการใช้งานระบบ", date: "21 พ.ย. 2568 16:37", mimeType: "application/pdf", pdfUrl: "#", wordUrl: "#" },
            { id: 2, name: "รายงานประจำเดือน (Word)", date: "21 พ.ย. 2568 16:37", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", pdfUrl: "#", wordUrl: "#" }
        ];
        saveDocuments(initialData);
    }

    // เริ่มต้นการแสดงผลเมื่อโหลดหน้าเสร็จ
    renderDocumentGrid();
    renderFilesToUploadList(); // แสดงรายการไฟล์ที่รออัปโหลด (ซึ่งควรจะว่างเปล่าเมื่อเริ่มต้น)
}); // <<<< สิ้นสุด: ปิดฟังก์ชันห่อหุ้ม