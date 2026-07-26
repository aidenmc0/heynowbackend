import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DesktopArrows({ onPrev, onNext, currentIndex, total }) {
  return (
    // hidden md:flex -> ซ่อนบนมือถือ แสดงบนคอม
    <div className="hidden md:flex fixed top-0 left-0 w-full h-full z-40 pointer-events-none">
      {/* พื้นที่ซ้ายสุด (ใช้สำหรับกดย้อนกลับ) */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className={`pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 ${
          currentIndex === 0
            ? 'opacity-20 cursor-not-allowed'
            : 'hover:bg-white/20 hover:scale-110 hover:border-white'
        }`}
      >
        <ChevronLeft size={24} />
      </button>

      {/* พื้นที่ขวาสุด (ใช้สำหรับกดไปข้างหน้า) */}
      <button
        onClick={onNext}
        disabled={currentIndex === total - 1}
        className={`pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 ${
          currentIndex === total - 1
            ? 'opacity-20 cursor-not-allowed'
            : 'hover:bg-white/20 hover:scale-110 hover:border-white'
        }`}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
