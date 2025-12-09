import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Cấu hình Firebase lấy từ biến môi trường
 * Sử dụng import.meta.env theo chuẩn Vite
 * Tất cả biến môi trường phải có prefix VITE_ để Vite expose chúng
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Kiểm tra các biến môi trường bắt buộc
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is missing. Please check your .env file."
  );
}

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Export các dịch vụ Firebase để sử dụng trong ứng dụng
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Scope drive.file: chỉ truy cập file do app tạo ra (ít sensitive hơn, dễ được Google verify)
// Thay vì spreadsheets (truy cập TẤT CẢ Google Sheets của user)
googleProvider.addScope("https://www.googleapis.com/auth/drive.file");
export const db = getFirestore(app);

export default app;
