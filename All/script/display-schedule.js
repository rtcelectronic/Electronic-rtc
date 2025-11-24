// js/display-schedule.js
import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function renderSchedules(listId) {
    const listContainer = document.getElementById(listId);
    if (!listContainer) return;

    listContainer.innerHTML = '<li class="list-group-item text-center">กำลังโหลดข้อมูล...</li>';

    try {
        const q = query(collection(db, "schedules"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            listContainer.innerHTML = '<li class="list-group-item text-center">ไม่พบตารางสอน</li>';
            return;
        }

        let html = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('th-TH') : '';
            
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-file-pdf text-danger me-2"></i>
                        <span class="fw-bold">${data.title}</span>
                        <br>
                        <small class="text-muted ms-4" style="font-size: 0.8rem;">อัปโหลดเมื่อ: ${date}</small>
                    </div>
                    <a href="${data.url}" target="_blank" class="btn btn-outline-danger btn-sm rounded-pill">
                        <i class="fas fa-download"></i> ดาวน์โหลด
                    </a>
                </li>
            `;
        });

        listContainer.innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        listContainer.innerHTML = '<li class="list-group-item text-danger">โหลดข้อมูลล้มเหลว</li>';
    }
}