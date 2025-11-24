// js/display-slides.js
import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * ฟังก์ชันดึงข้อมูลสไลด์และนำไปแสดงใน Element ที่กำหนด
 * @param {string} containerId - ID ของ HTML element ที่จะให้แสดงผล
 */
export async function renderSlides(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // แสดงสถานะกำลังโหลด
    container.innerHTML = '<div class="text-center p-5">Loading slides...</div>';

    try {
        const q = query(collection(db, "slides"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = '<div class="text-center p-5">ยังไม่มีข่าวสารในขณะนี้</div>';
            return;
        }

        let html = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // ปรับแต่ง HTML ตาม Design ของเว็บคุณได้ตรงนี้
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${data.imageUrl}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-text text-muted">${data.description || ''}</p>
                            ${data.link ? `<a href="${data.link}" class="btn btn-primary btn-sm" target="_blank">อ่านเพิ่มเติม</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        // ใส่ HTML ลงใน container (สมมติว่าเป็น row)
        container.innerHTML = `<div class="row">${html}</div>`;

    } catch (error) {
        console.error("Error loading slides:", error);
        container.innerHTML = '<div class="text-danger text-center">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
    }
}