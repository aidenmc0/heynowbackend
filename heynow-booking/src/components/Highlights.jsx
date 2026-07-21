import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext"; // Import Context

const Highlights = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // --- 1. ดึงข้อมูลจาก Context (รองรับภาษาอัตโนมัติ) ---
  const { content } = useLanguage();
  const highlights = content.highlights; // ดึง array highlights จาก content ที่ active อยู่

  // --- 2. Scroll Logic (Mobile) ---
  const handleScroll = () => {
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[0];
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 24;
      const scrollStep = cardWidth + gap;

      const index = Math.round(container.scrollLeft / scrollStep);
      if (index !== activeIndex) {
        setActiveIndex(Math.min(Math.max(index, 0), highlights.length - 1));
      }
    }
  };

  const scrollToCard = (index) => {
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[0];
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 24;
      const scrollStep = cardWidth + gap;

      container.scrollTo({
        left: index * scrollStep,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="highlights" className="py-16 overflow-hidden bg-warm-100">
      <div className="px-6 mb-10 max-w-7xl mx-auto flex justify-between items-end">
        <div>
          {/* ใช้จาก content.title หรือ text แบบ fixed ถ้ามี */}
          <h2 className="font-serif text-3xl text-warm-900">
            {content.highlightsTitle}
          </h2>
          <p className="text-warm-800 text-sm mt-2">
            {content.highlightsSubtitle}
          </p>
        </div>
        <div className="hidden md:block text-warm-400 text-xs uppercase tracking-widest">
            {content.highlightsOurstory}
        </div>
      </div>

      {/* Container: Mobile = Flex Scroll / Desktop = Grid */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="
          flex 
          overflow-x-auto 
          gap-6 
          px-6 
          pb-12 
          no-scrollbar 
          snap-x 
          snap-mandatory 
          max-w-7xl 
          mx-auto
          
          /* Desktop Grid Layout */
          md:grid 
          md:grid-cols-2 
          lg:grid-cols-3
          md:overflow-visible 
          md:px-6
        "
      >
        {highlights.map((hig, index) => (
          <motion.div
            key={hig.id}
            // Layout Classes
            className="
              min-w-[85vw] 
              md:min-w-0 
              md:col-span-1 
              snap-center 
              bg-white 
              rounded-2xl 
              overflow-hidden 
              shadow-sm 
              hover:shadow-xl 
              transition-shadow 
              duration-500 
              group
            "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-72 overflow-hidden relative">
              <img
                src={hig.img}
                alt={hig.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl text-warm-900 mb-2">
                {hig.title}
              </h3>
              <p className="text-warm-800 font-light">{hig.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Dots (แสดงเฉพาะบน Mobile) */}
      <div className="flex justify-center items-center gap-2 pb-8 px-6 md:hidden">
        {highlights.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToCard(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? "w-8 bg-warm-900"
                : "w-2 bg-warm-300 hover:bg-warm-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Highlights;
