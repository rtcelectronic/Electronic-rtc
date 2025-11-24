// js/chatbot-widget.js
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class Chatbot {
    constructor() {
        this.knowledgeBase = []; // เก็บข้อมูล Q&A ไว้ในตัวแปรเพื่อลดการเรียก Database บ่อยๆ
        this.init();
    }

    async init() {
        try {
            const querySnapshot = await getDocs(collection(db, "chatbot_data"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // แยก keyword ด้วย comma และลบช่องว่าง
                const keywords = data.keywords.split(',').map(k => k.trim().toLowerCase());
                this.knowledgeBase.push({
                    keywords: keywords,
                    answer: data.answer
                });
            });
            console.log("Chatbot loaded knowledge base:", this.knowledgeBase.length, "items");
        } catch (error) {
            console.error("Chatbot init error:", error);
        }
    }

    /**
     * ค้นหาคำตอบจากข้อความของผู้ใช้
     * @param {string} userMessage 
     * @returns {string} คำตอบที่ดีที่สุด หรือ Default msg
     */
    getResponse(userMessage) {
        if (!userMessage) return "";
        
        const msg = userMessage.toLowerCase();
        
        // วนลูปหา keyword ที่ตรงกับข้อความ
        for (const item of this.knowledgeBase) {
            for (const keyword of item.keywords) {
                if (msg.includes(keyword)) {
                    return item.answer;
                }
            }
        }

        return "ขออภัยครับ ผมไม่เข้าใจคำถาม ลองถามด้วยคำอื่น หรือติดต่อเจ้าหน้าที่โดยตรงครับ";
    }
}