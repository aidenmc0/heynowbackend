import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

<iframe src="https://calendar.google.com/calendar/embed?src=8f3708d0f3083726068b865e8cd60f695587c67febe274c207b57276d5a43cc2%40group.calendar.google.com&ctz=Asia%2FBangkok" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>

const ShowCalendar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useLanguage();
  
  // URL เดิมที่ปรับแต่งแล้ว
  const calendarSrc = "https://calendar.google.com/calendar/embed?src=8f3708d0f3083726068b865e8cd60f695587c67febe274c207b57276d5a43cc2%40group.calendar.google.com&ctz=Asia%2FBangkok&mode=month&showPrint=0&showTabs=0&showCalendars=0&showTz=0&wkst=1&bgcolor=%23FDFBF7&color=%233E3832&epr=1";

  return (
    <section id="booking" className="relative py-32 md:py-48 bg-[#FDFBF7] overflow-hidden">
      
      {/* Background Decoration - สร้างบรรยากาศลึกซึ้ง */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] right-[0%] w-[800px] h-[800px] bg-[#E8E0D5]/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[10%] w-[600px] h-[600px] bg-[#D4C5B0]/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
        
        {/* 1. Minimalist Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="space-y-6 mb-12"
        >
          <span className="inline-block py-1 px-3 border border-[#A89F91] rounded-full text-[#8B8173] text-[10px] font-bold tracking-[0.2em] uppercase">
            Availability
          </span>
          
          <h2 className="font-['Cormorant_Garamond',serif] text-4xl md:text-6xl text-[#3E3832] font-medium leading-tight">
            Secure Your Sanctuary
          </h2>
          
          <p className="font-['Lato',sans-serif] text-[#6B6359] text-lg md:text-xl font-light leading-relaxed">
            Step away from the noise. Begin your journey to tranquility by checking our real-time availability.
          </p>
        </motion.div>

        {/* 2. The Premium Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={() => setIsOpen(true)}
          className="
            group relative inline-flex items-center gap-4
            bg-[#3E3832] text-warm-50
            px-10 py-5 rounded-full
            overflow-hidden
            shadow-[0_10px_40px_-10px_rgba(62,56,50,0.3)]
            hover:shadow-[0_20px_50px_-10px_rgba(62,56,50,0.5)]
          "
        >
          {/* Button Hover Effect (Shine) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
          
          <Calendar size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-['Lato',sans-serif] text-sm md:text-base tracking-[0.2em] uppercase font-bold">
            Check Availability
          </span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* 3. The Luxury Overlay (Modal) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3E3832]/95 backdrop-blur-md p-2 md:p-8"
            onClick={() => setIsOpen(false)} // คลิกพื้นหลังปิด
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col border border-[#F0EBE5]"
              onClick={(e) => e.stopPropagation()} // ห้ามคลิกในโมดัลแล้วปิด
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-stone-100 bg-[#FAF8F5]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#3E3832] rounded-lg text-white">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-['Cormorant_Garamond',serif] text-2xl text-[#3E3832] font-semibold leading-none">
                      Reserve Your Stay
                    </h3>
                    <p className="font-['Lato',sans-serif] text-xs text-[#8B8173] mt-1">
                      Select dates to proceed
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="
                    p-3 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors duration-200
                  "
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body (Iframe) */}
              <div className="flex-1 bg-white relative w-full h-full">
                <iframe
                  src={calendarSrc}
                  style={{ 
                    border: '0',
                    width: '100%',
                    height: '100%',
                  }}
                  frameBorder="0"
                  scrolling="no"
                  title="Google Calendar Booking"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Add Custom Keyframes for Button Shine to global css or style tag */}
      <style jsx global>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
      `}</style>
    </section>
  );
};

export default ShowCalendar;