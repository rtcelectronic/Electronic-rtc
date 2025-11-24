document.addEventListener('DOMContentLoaded', function() { // <<<< ห่อหุ้มโค้ดทั้งหมด

    // --- ส่วนข้อมูล (แก้ไขตรงนี้เพื่อเปลี่ยนรูป/ข้อความ) ---
    const newsData = [
        {
            date: "19 พ.ย. 2568",
            title: "เปิดรับสมัคร นักเรียนใหม่",
            excerpt: "เปิดรับสมัครทีมตัวแทนแผนก เพื่อเข้าร่วมการแข่งขันหุ่นยนต์อาชีวศึกษา...",
            imageUrl: "/Test/All/images/ สไลด์ข่าวสาร/สมัคร.jpg",
            altText: "การแข่งขันหุ่นยนต์",
            readMoreUrl: "#"
        },
        {
            date: "21 พ.ย. 2568",
            title: "การแข่งขันทักษะ",
            excerpt: "ขอเชิญนักศึกษาชั้น ปวส.1 เข้าร่วมอบรมการใช้งาน NodeMCU และเซ็นเซอร์ต่างๆ...",
            imageUrl: "/Test/All/images/ สไลด์ข่าวสาร/ผอ.jpg",
            altText: "อบรม IoT",
            readMoreUrl: "#"
        }, 
        {
            date: "18 พ.ย. 2568",
            title: "แจ้งกำหนดการสอบปลายภาคเรียนที่ 2/2568",
            excerpt: "ให้นักศึกษาแผนกอิเล็กทรอนิกส์ทุกคน ตรวจสอบตารางสอบและเตรียมตัวให้พร้อม...",
            imageUrl: "news/photo/S__11526175.jpg",
            altText: "ตารางสอบ",
            readMoreUrl: "#"
        },
        
        
        // --- ตัวอย่างการเพิ่มข่าวใหม่ ---
        // ,{
        //     date: "19 พ.ย. 2568",
        //     title: "ข่าวใหม่ล่าสุด",
        //     excerpt: "เนื้อหาย่อของข่าวใหม่...",
        //     imageUrl: "https://placehold.co/600x400/9b59b6/FFFFFF?text=New+Post",
        //     altText: "ข่าวใหม่",
        //     readMoreUrl: "#"
        // }
        
    ];


    // --- Logic (ส่วนสร้าง HTML) ---
    // ฟังก์ชันนี้จะอ่านข้อมูลจาก newsData และสร้าง HTML cards
    function renderNews() {
        const newsGrid = document.getElementById('news-grid-container');
        
        // ตรวจสอบว่าหา 'news-grid-container' เจหรือไม่
        if (!newsGrid) {
            // console.error("News grid container not found!"); // เปิดใช้งานถ้าต้องการเห็น error
            return; 
        }

        // Clear any placeholder content
        newsGrid.innerHTML = ''; 

        newsData.forEach(news => {
            // Create the HTML structure for each news card
            // using template literals (backticks)
            const cardHtml = `
            <article class="news-card">
                <div class="news-image-container">
                    <img src="${news.imageUrl}" alt="${news.altText}" loading="lazy" onerror="this.src='https://placehold.co/600x400/cccccc/FFFFFF?text=Image+Error'; this.alt='Image failed to load';">
                </div>
                <div class="news-content">
                    <span class="news-date">${news.date}</span>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-excerpt">${news.excerpt}</p>
                    <a href="${news.readMoreUrl}" class="read-more">อ่านรายละเอียด</a>
                </div>
            </article>
            `;
            
            // Add the new card HTML to the grid
            newsGrid.insertAdjacentHTML('beforeend', cardHtml);
        });
    }

    // Run the function when the page (DOM) is fully loaded
    renderNews();

}); // <<<< ปิดฟังก์ชันห่อหุ้ม