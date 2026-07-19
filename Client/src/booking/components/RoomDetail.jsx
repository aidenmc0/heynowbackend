import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// --- Import Components & Data ---
import { useLanguage } from "../contexts/LanguageContext"; 
import StoryCard from "./Mobile/StoryCard";
import GodRay from "./Background/GodRay";
// Import DesktopArrows ที่คุณสร้างไว้ (เช็ค path ให้ถูกต้องนะครับ)
import DesktopArrows from "./Mobile/DesktopArrows"; 

const RoomDetail = () => {
  const { id } = useParams();
  const containerRef = useRef(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const navigate = useNavigate(); 

  // --- 1. Data & State Management ---
  const { content } = useLanguage();
  const rooms = content.rooms || [];
  
  const currentIndex = rooms.findIndex((r) => r.id === parseInt(id));
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const room = rooms[safeIndex];

  // --- 2. Logic สร้าง Slides ---
  const createSlides = (room) => {
    const slides = [];
    if (room && room.gallery) {
        room.gallery.forEach((item, index) => {
            slides.push({
                image: item.image,
                title: item.title || room.name,
                desc: item.desc || room.desc,
                subtitle: item.subtitle || `View ${index + 1}`,
                action: index === room.gallery.length - 1 ? content.bookNow : content.slideAction,
            });
        });
    }
    return slides;
  };

  const slides = createSlides(room);

  // --- 3. RESET EFFECT ---
  useEffect(() => {
    setActiveSlideIndex(0);
    if (containerRef.current) {
        containerRef.current.scrollLeft = 0;
    }
  }, [id]);

  // --- 4. Intersection Observer ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            if (!isNaN(index)) setActiveSlideIndex(index);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    Array.from(container.children).forEach((child) => {
      if (child.classList.contains('story-slide-wrapper')) {
        observer.observe(child);
      }
    });

    return () => observer.disconnect();
  }, [room]);

  // --- 5. Navigation Functions สำหรับ DesktopArrows ---
  const handlePrev = () => {
    if (activeSlideIndex > 0) {
      const target = containerRef.current?.children[activeSlideIndex - 1];
      target?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  const handleNext = () => {
    if (activeSlideIndex < slides.length - 1) {
      const target = containerRef.current?.children[activeSlideIndex + 1];
      target?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  const handleClose = () => {
    navigate('/');
    setTimeout(() => {
      const roomSection = document.getElementById('rooms');
      if (roomSection) {
        roomSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="relative bg-stone-900 text-white h-[100dvh] w-screen overflow-hidden font-serif selection:bg-white/20 flex flex-col">
      
      {/* Background 3D */}
      <div className="fixed inset-0 z-[-1] opacity-30 pointer-events-none">
        <GodRay />
      </div>

      {/* ================= TOP LAYER: Info & Close ================= */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start p-4 md:p-6 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="pointer-events-auto p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/10 transition-all duration-300 group"
        >
          <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Room Title Badge + Progress */}
        <div className="pointer-events-auto flex flex-col items-center gap-1">            
            <span className="text-lg md:text-xl font-medium tracking-wide bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10">
              {room?.name}
            </span>

            {/* Progress Dots */}
            <div className="flex flex-col items-center gap-0.5">
                 <div className="flex gap-1.5 mb-1">
                    {slides.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`
                                h-[2px] rounded-full transition-all duration-300
                                ${idx <= activeSlideIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}
                            `}
                        />
                    ))}
                 </div>
                 <span className="text-[10px] font-sans text-white/80 tracking-widest">
                    {activeSlideIndex + 1} / {slides.length}
                 </span>
            </div>
        </div>

        {/* Right Spacer */}
        <div className="w-10 md:w-12"></div>
      </div>


      {/* ================= CENTER LAYER: The Story (Photo Viewer) ================= */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={containerRef}
          className="h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar flex flex-row"
        >
          {slides.map((slide, sIndex) => (
            <div
              key={sIndex}
              data-index={sIndex}
              className="story-slide-wrapper h-full w-screen flex-shrink-0 snap-start relative"
            >
              <StoryCard
                slide={slide}
                isActive={activeSlideIndex === sIndex}
                isBookingSlide={sIndex === slides.length - 1}
                bookingLink="/#contact"
              />
            </div>
          ))}
        </div>
      </div>


      {/* ================= BOTTOM LAYER: The Glass Dock (Room Selector) ================= */}
      <div className="
        absolute bottom-4 left-0 right-0 z-40 pointer-events-none
        pb-safe md:pb-8 pt-6
        bg-gradient-to-t from-black/80 via-black/40 to-transparent
      ">
        <div className="
          container mx-auto px-4 md:px-6 pointer-events-auto flex justify-center
        ">
          
          {/* The Dock Container */}
          <div className="
            flex gap-2 md:gap-3 p-2 md:p-3
            bg-black/40 backdrop-blur-xl border border-white/10 
            rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]
            overflow-x-auto no-scrollbar w-full max-w-full
          ">
            {rooms.map((r, idx) => (
              <Link
                key={r.id}
                to={`/rooms/${r.id}`}
                className={`
                  relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden 
                  border-2 transition-all duration-300 group cursor-pointer
                  ${idx === safeIndex 
                    ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                    : 'border-transparent opacity-40 hover:opacity-80 hover:border-white/30 scale-100'
                  }
                `}
                title={r.name}
              >
                <img 
                  src={r.mainImage} 
                  alt={r.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {idx === safeIndex && (
                  <motion.div 
                    layoutId="activeRoom"
                    className="absolute inset-0 ring-2 ring-white/30 rounded-xl"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================= INSERTED: DesktopArrows ================= */}
      {/* วางไว้ที่นี่ ด้านล่างสุดของ Main Container */}
      {/* ส่ง Props: ฟังก์ชันเลื่อน, index ปัจจุบัน, และจำนวนสไลด์ทั้งหมด */}
      <DesktopArrows
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={activeSlideIndex}
        total={slides.length}
      />

    </div>
  );
};

export default RoomDetail;