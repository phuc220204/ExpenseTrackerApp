import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Service layer cho Challenges (Thử thách Tiết kiệm)
 * Xử lý CRUD operations với Firestore
 */

const COLLECTION_NAME = "challenges";

/**
 * Lấy collection reference cho challenges của user
 */
const getChallengesCollection = (userId) => {
  return collection(db, "users", userId, COLLECTION_NAME);
};

/**
 * Lấy tất cả challenges của user
 */
export const getChallenges = async (userId) => {
  const ref = getChallengesCollection(userId);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Tạo challenge mới
 */
export const createChallenge = async (userId, challengeData) => {
  const ref = getChallengesCollection(userId);

  const newChallenge = {
    ...challengeData,
    currentAmount: 0,
    streakDays: 0,
    status: "active",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(ref, newChallenge);
  return docRef.id;
};

/**
 * Cập nhật challenge
 */
export const updateChallenge = async (userId, challengeId, updates) => {
  const docRef = doc(db, "users", userId, COLLECTION_NAME, challengeId);
  await updateDoc(docRef, updates);
};

/**
 * Xóa challenge
 */
export const deleteChallenge = async (userId, challengeId) => {
  const docRef = doc(db, "users", userId, COLLECTION_NAME, challengeId);
  await deleteDoc(docRef);
};
