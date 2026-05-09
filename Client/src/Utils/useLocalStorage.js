import { useState, useEffect } from "react";

/**
 * Custom Hook: useLocalStorage
 * ทำหน้าที่เก็บค่าลง localStorage และอ่านค่าออกมาได้ทันที โดยไม่เกิด Flickering
 * 
 * @param {string} key - ชื่อ Key ใน localStorage
 * @param {*} initialValue - ค่าเริ่มต้นถ้ายังไม่มีข้อมูลใน Storage
 */
export function useLocalStorage(key, initialValue) {
  // 1. อ่านค่าจาก localStorage ทันทีตอน State Initialize (ไม่ต้องรับ Flickering)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. เมื่อ State เปลี่ยน ให้บันทึกลง localStorage ทันที
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}