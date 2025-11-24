      // --- 1. การจัดการ Local Storage (อ่าน/เขียน) ---
        const STORAGE_KEY = 'local_news_data';
        
        // ฟังก์ชันดึงข้อมูลจาก Local Storage
        function getNewsData() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.error("Error reading from localStorage:", e);
                return [];
            }
        }
        
        // ฟังก์ชันบันทึกข้อมูลลง Local Storage
        function saveNewsData(data) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return true;
            } catch (e) {
                console.error("Error saving to localStorage:", e);
                showCustomMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูลในเบราว์เซอร์: " + e.message, "error");
                return false;
            }
        }

        // --- 2. การจัดการข้อมูล CRUD และ Image Upload ---
        
        const imageFileInput = document.getElementById('news-imageFile');
        const imageUrlHiddenInput = document.getElementById('news-imageUrl');
        const imagePreviewContainer = document.getElementById('image-preview');
        const currentImagePreview = document.getElementById('current-image-preview');

        // Logic การแปลงไฟล์เป็น Base64 เมื่อมีการเลือกไฟล์
        imageFileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Image = e.target.result;
                    // Store Base64 data in the hidden input
                    imageUrlHiddenInput.value = base64Image;
                    
                    // Show preview
                    currentImagePreview.src = base64Image;
                    imagePreviewContainer.classList.remove('hidden');
                };
                reader.onerror = function(e) {
                    console.error("Error reading file:", e);
                    showCustomMessage("ไม่สามารถอ่านไฟล์รูปภาพได้", "error");
                    // Clear inputs on error
                    imageFileInput.value = '';
                    imageUrlHiddenInput.value = '';
                    imagePreviewContainer.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            } else {
                // ถ้าไม่มีการเลือกไฟล์ใหม่ จะคงค่าเดิมใน imageUrlHiddenInput ไว้สำหรับการแก้ไข
                if (!imageUrlHiddenInput.value) {
                    imagePreviewContainer.classList.add('hidden');
                    currentImagePreview.src = '';
                }
            }
        });


        // ฟังก์ชันบันทึก (สร้าง/แก้ไข) ข่าวสาร
        async function saveNews(newsItem) {
            
            // ตรวจสอบว่ามีรูปภาพหรือไม่ก่อนบันทึก
            if (!newsItem.imageUrl) {
                 showCustomMessage("กรุณาอัปโหลดรูปภาพข่าวสาร", "error");
                 return;
            }

            let newsData = getNewsData();
            
            if (newsItem.id) {
                // แก้ไขรายการเดิม
                const index = newsData.findIndex(n => n.id === newsItem.id);
                if (index !== -1) {
                    // Update fields and set new timestamp
                    newsData[index] = { 
                        ...newsData[index], 
                        ...newsItem, 
                        timestamp: new Date().getTime() 
                    };
                    showCustomMessage("แก้ไขข่าวสารสำเร็จ", "success");
                }
            } else {
                // สร้างรายการใหม่
                newsItem.id = crypto.randomUUID(); // สร้าง ID ใหม่
                newsItem.timestamp = new Date().getTime();
                newsData.push(newsItem);
                showCustomMessage("เพิ่มข่าวสารใหม่สำเร็จ", "success");
            }

            if (saveNewsData(newsData)) {
                // แสดงผลใหม่หลังบันทึก
                newsData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                renderNews(newsData);
                resetForm();
            }
        }

        // ฟังก์ชันสำหรับลบข่าวสาร
        window.deleteNews = async function(id) {
            if (!await showCustomConfirm("คุณต้องการลบข่าวสารนี้จริงหรือไม่?")) {
                return;
            }

            let newsData = getNewsData();
            const initialLength = newsData.length;
            
            // กรองรายการที่ไม่ต้องการลบออก
            newsData = newsData.filter(n => n.id !== id);

            if (initialLength !== newsData.length && saveNewsData(newsData)) {
                showCustomMessage("ลบข่าวสารสำเร็จ", "success");
                
                // แสดงผลใหม่หลังลบ
                newsData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                renderNews(newsData);
                resetForm();
            } else {
                showCustomMessage("ไม่พบข่าวสารที่ต้องการลบ", "error");
            }
        }

        // ฟังก์ชันสำหรับดึงข้อมูลและแสดงผล
        function loadAndRenderNews() {
            let newsData = getNewsData();
            newsData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            renderNews(newsData);
        }

        // --- 3. การจัดการ UI และ Form ---

        document.addEventListener('DOMContentLoaded', () => {
            // โหลดข้อมูลครั้งแรกเมื่อหน้าเว็บโหลดเสร็จ
            loadAndRenderNews();
        });


        const form = document.getElementById('news-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const docId = document.getElementById('news-doc-id').value;
            // ดึงค่า imageUrl จาก Hidden Input
            const imageUrlValue = imageUrlHiddenInput.value; 

            const newsItem = {
                id: docId || null, // ใช้ null ถ้าเป็นการสร้างใหม่
                title: document.getElementById('news-title').value,
                date: document.getElementById('news-date').value,
                excerpt: document.getElementById('news-excerpt').value,
                fullContent: document.getElementById('news-fullContent').value, 
                imageUrl: imageUrlValue, // ใช้ค่า Base64/URL จาก Hidden Input
                readMoreUrl: document.getElementById('news-readMoreUrl').value,
            };

            saveNews(newsItem);
        });

        // ฟังก์ชันสำหรับโหลดข้อมูลเข้าฟอร์มเมื่อต้องการแก้ไข
        window.editNews = function(newsItem) {
            document.getElementById('news-doc-id').value = newsItem.id;
            document.getElementById('news-title').value = newsItem.title;
            document.getElementById('news-date').value = newsItem.date;
            document.getElementById('news-excerpt').value = newsItem.excerpt;
            document.getElementById('news-fullContent').value = newsItem.fullContent || ''; 
            document.getElementById('news-readMoreUrl').value = newsItem.readMoreUrl;

            // --- จัดการรูปภาพเดิม ---
            imageUrlHiddenInput.value = newsItem.imageUrl || ''; // เก็บค่าเดิมไว้
            imageFileInput.value = ''; // ล้างไฟล์ Input
            
            if (newsItem.imageUrl) {
                currentImagePreview.src = newsItem.imageUrl;
                imagePreviewContainer.classList.remove('hidden');
            } else {
                currentImagePreview.src = '';
                imagePreviewContainer.classList.add('hidden');
            }
            // ------------------------

            document.getElementById('admin-form-title').textContent = "แก้ไขข่าวสาร";
            document.getElementById('submit-button-text').textContent = "บันทึกการแก้ไข";
            document.getElementById('cancel-edit-btn').classList.remove('hidden');

            // เลื่อนไปที่ฟอร์ม
            document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
        }

        // ฟังก์ชันสำหรับรีเซ็ตฟอร์มเป็นโหมด 'เพิ่มใหม่'
        window.resetForm = function() {
            form.reset();
            document.getElementById('news-doc-id').value = '';
            document.getElementById('admin-form-title').textContent = "เพิ่มข่าวสารใหม่";
            document.getElementById('submit-button-text').textContent = "บันทึกข่าวสาร";
            document.getElementById('cancel-edit-btn').classList.add('hidden');
            
            // รีเซ็ต Image fields
            imageFileInput.value = '';
            imageUrlHiddenInput.value = '';
            currentImagePreview.src = '';
            imagePreviewContainer.classList.add('hidden');
        }

        // ฟังก์ชันสร้าง Custom Message/Alert UI (แทน alert() ที่ถูกห้ามใช้)
        function showCustomMessage(message, type = 'info') {
            const container = document.body;
            const color = type === 'success' ? 'bg-green-500' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');
            
            // ลบ message เก่าออกก่อน
            const oldMsg = document.getElementById('custom-message');
            if(oldMsg) oldMsg.remove();

            const msgElement = document.createElement('div');
            msgElement.id = 'custom-message';
            msgElement.className = `fixed top-4 right-4 ${color} text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300`;
            msgElement.textContent = message;

            container.appendChild(msgElement);

            setTimeout(() => {
                msgElement.classList.add('opacity-0');
                msgElement.addEventListener('transitionend', () => msgElement.remove());
            }, 3000);
        }

        // ฟังก์ชันสร้าง Custom Confirm UI (แทน window.confirm())
        function showCustomConfirm(message) {
            return new Promise(resolve => {
                const modalHtml = `
                    <div id="confirm-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
                            <h3 class="text-lg font-bold mb-4 text-gray-800">ยืนยันการดำเนินการ</h3>
                            <p class="mb-6 text-gray-600">${message}</p>
                            <div class="flex justify-end space-x-3">
                                <button id="confirm-cancel" class="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">ยกเลิก</button>
                                <button id="confirm-ok" class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">ยืนยัน</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                const modal = document.getElementById('confirm-modal');
                
                document.getElementById('confirm-ok').onclick = () => {
                    modal.remove();
                    resolve(true);
                };
                
                document.getElementById('confirm-cancel').onclick = () => {
                    modal.remove();
                    resolve(false);
                };
            });
        }
        
        // --- 4. ฟังก์ชันจัดการ Modal แสดงเนื้อหาเต็ม (สำหรับ Preview/Edit) ---
        
        window.showFullNews = function(newsItem) {
            const modal = document.getElementById('news-detail-modal');
            const contentArea = document.getElementById('modal-content-area');
            
            // สร้าง HTML สำหรับแสดงเนื้อหาฉบับเต็ม
            contentArea.innerHTML = `
                <img src="${newsItem.imageUrl}" 
                     alt="${newsItem.title}" 
                     class="w-full h-80 object-cover rounded-lg mb-6"
                     onerror="this.src='https://placehold.co/900x400/cccccc/FFFFFF?text=ไม่พบรูปภาพ';"
                >
                <h1 class="text-3xl font-extrabold text-gray-900 mb-2">${newsItem.title}</h1>
                <p class="text-sm text-gray-500 mb-6 border-b pb-4">เผยแพร่เมื่อ: <span class="font-semibold text-green-600">${newsItem.date}</span></p>
                <!-- ใช้ whitespace-pre-wrap เพื่อให้แสดงผลการขึ้นบรรทัดใหม่จาก textarea ถูกต้อง -->
                <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    ${newsItem.fullContent}
                </div>
            `;

            // แสดง Modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // ป้องกันการเลื่อนหน้าหลัก
        }

        window.closeFullNews = function(event) {
            // ปิด Modal
            if (event && event.currentTarget.id === 'news-detail-modal' || !event) {
                document.getElementById('news-detail-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }


        // --- 5. Logic การแสดงผล ---

        function renderNews(newsData) {
            const newsGrid = document.getElementById('news-grid-container');
            const loadingMessage = document.getElementById('loading-message');
            
            // ซ่อนข้อความโหลด
            if(loadingMessage) { loadingMessage.remove(); }

            // Clear any old content
            newsGrid.innerHTML = ''; 

            if (newsData.length === 0) {
                 newsGrid.innerHTML = '<p class="text-center col-span-full text-gray-500 p-12">ไม่พบข่าวสารในระบบ</p>';
                 return;
            }

            newsData.forEach(news => {
                // สร้าง JSON string ที่ปลอดภัยเพื่อส่งผ่านไปยังฟังก์ชัน JS
                const newsJson = JSON.stringify(news).replace(/'/g, "\\'"); 
                
                const cardHtml = `
                <article class="news-card">
                    <div class="admin-controls flex space-x-2">
                        <button onclick='editNews(${newsJson})' class="bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-600 transition-colors shadow-md" title="แก้ไข">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onclick='deleteNews("${news.id}")' class="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md" title="ลบ">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    <div class="news-image-container">
                        <!-- ใช้ news.imageUrl ที่เป็น Base64 หรือ URL ธรรมดาได้ -->
                        <img src="${news.imageUrl}" 
                             alt="${news.altText || news.title}" 
                             loading="lazy" 
                             onerror="this.src='https://placehold.co/600x400/cccccc/FFFFFF?text=ไม่พบรูปภาพ'; this.alt='รูปภาพโหลดไม่สำเร็จ';"
                        >
                    </div>
                    <div class="news-content">
                        <span class="news-date">${news.date}</span>
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-excerpt">${news.excerpt}</p>
                        <!-- เรียกฟังก์ชัน JS เพื่อเปิด Modal แสดงเนื้อหาเต็ม -->
                        <button onclick='showFullNews(${newsJson})' class="read-more">อ่านรายละเอียด</button>
                    </div>
                </article>
                `;
                
                // Add the new card HTML to the grid
                newsGrid.insertAdjacentHTML('beforeend', cardHtml);
            });
        }