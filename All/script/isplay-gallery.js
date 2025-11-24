// js/display-gallery.js
import { db } from './firebase-config.js';
import { collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function renderGallery(galleryId) {
    const container = document.getElementById(galleryId);
    if (!container) return;

    try {
        const q = query(collection(db, "gallery_images"), orderBy("uploadedAt", "desc"));
        const querySnapshot = await getDocs(q);

        let html = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-6 col-md-3 mb-3">
                    <a href="${data.url}" target="_blank">
                        <img src="${data.url}" class="img-fluid rounded shadow-sm" style="width: 100%; height: 150px; object-fit: cover; transition: transform 0.2s;">
                    </a>
                </div>
            `;
        });
        
        container.innerHTML = `<div class="row g-3">${html}</div>`;
    } catch (error) {
        console.error("Gallery Error:", error);
    }
}