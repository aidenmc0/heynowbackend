import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { X } from 'lucide-react'; 
import { useState, useEffect } from "react";

const Rooms = () => {
  const { content } = useLanguage();
  
  // --- 1. State สำหรับจัดการ Overlay ---
  const [overlay, setOverlay] = useState({
    isOpen: false,
    room: null
  });

  // --- 2. Effect สำหรับ Lock Scroll ---
  useEffect(() => {
    if (overlay.isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [overlay.isOpen]);

  const openOverlay = (e, room) => {
    e.preventDefault(); 
    e.stopPropagation();
    setOverlay({ isOpen: true, room });
  };

  const closeOverlay = () => {
    setOverlay({ isOpen: false, room: null });
  };

  return (
    <section id="rooms" className="py-16 px-6 max-w-7xl mx-auto bg-warm-50">
      <div className="text-center mb-20">
        <h2 className="font-serif text-5xl text-warm-900 mb-4 tracking-tight">
          {content.roomsTitle}
        </h2>
        <p className="text-warm-700 font-light max-w-2xl mx-auto text-lg md:text-xl">
          {content.roomsDesc}
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center -mx-6">
        {content.rooms.map((room) => (
          <Link
            key={room.id}
            to={`/rooms/${room.id}`} 
            // 1. เพิ่ม flex flex-col ที่ Link เพื่อให้กล่องยืดตามเนื้อหา
            className="w-full px-6 md:w-[calc(33.333%-32px)] group cursor-pointer mb-12 flex flex-col"
          >
            {/* Card Image Wrapper */}
            <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-transparent group-hover:border-forest-600 transition-all duration-700">
              <img
                src={room.mainImage}
                alt={room.name}
                className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="bg-white/90 text-warm-900 px-6 py-2 rounded-full text-sm uppercase tracking-widest backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {content.viewDetails}
                </span>
              </div>
            </div>

            {/* 2. Info Section: เพิ่ม flex-1 flex flex-col เพื่อจัดแถวให้ดันปุ่มลงล่าง */}
            <div className="mt-6 text-center flex-1 flex flex-col">
              <h3 className="font-serif text-2xl md:text-3xl text-warm-900 group-hover:text-forest-600 transition-colors mb-3">
                {room.name}
              </h3>
              
              {/* 3. ปรับคำอธิบาย: ใช้ line-clamp-3 เพื่อตัดข้อความให้เท่ากันหมดทุกบัตร */}
              <p className="text-warm-700 font-light leading-relaxed text-sm md:text-base line-clamp-4 mb-6">
                {room.desc}
              </p>

              {/* --- ปุ่ม Action: ใส่ mt-auto เพื่อดันตัวเองลงไปชิดล่างสุดของกล่อง --- */}
              {/* mt-auto คือ Key ที่ทำให้ปุ่มเรียงตรงกันครับ */}
              <div className="hidden md:flex flex-col items-center justify-center gap-4 w-full mt-auto">
                
                <div className="flex justify-center items-center gap-4">
                  {/* ปุ่ม Detail */}
                  <span className="px-8 py-2.5 rounded-full border border-warm-900/30 text-warm-900 text-xs uppercase tracking-[0.15em] pointer-events-none">
                    Detail
                  </span>

                  {/* ปุ่ม Price */}
                  <button 
                    onClick={(e) => openOverlay(e, room)}
                    className="px-8 py-2.5 rounded-full bg-forest-600 text-white text-xs uppercase tracking-[0.15em] shadow-md hover:bg-forest-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Price
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- Overlay Component --- */}
      {overlay.isOpen && overlay.room && (
        <motion.div
          className="fixed inset-0 z-[60] bg-[#1C1A18]/95 backdrop-blur-xl 
                     flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOverlay} 
        >
          <button
            onClick={closeOverlay}
            className="absolute top-6 right-6 p-3 rounded-full 
                       bg-white/10 hover:bg-white/20 
                       backdrop-blur-md border border-white/10 
                       transition-all group z-50"
          >
            <X size={22} className="text-white group-hover:rotate-90 transition-transform" />
          </button>

          <motion.img
            src={overlay.room.mainImage}
            alt={overlay.room.name}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-md shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} 
          />
          
        </motion.div>
      )}

    </section>
  );
};

export default Rooms;