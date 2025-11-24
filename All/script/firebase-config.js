// js/firebase-config.js
// นำเข้า Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- ใส่ค่า Config ของคุณตรงนี้ (เอามาจาก Firebase Console) ---
const firebaseConfig = {
    apiKey: "AIzaSyArDdjWYE1fMAD67Ct8PiyjBbBLyqyMARk",
    authDomain: "electronic-rtc-22f6e.firebaseapp.com",
    projectId: "electronic-rtc-22f6e",
    storageBucket: "electronic-rtc-22f6e.firebasestorage.app",
    messagingSenderId: "840878753204",
    appId: "1:840878753204:web:3d554e0bc371e7b816dee1"
};

// เริ่มต้นระบบและ Export ตัวแปร db ออกไปให้ไฟล์อื่นใช้
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };