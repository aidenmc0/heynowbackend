import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { Utensils, Coffee, Sunset } from 'lucide-react';
import { useState,useEffect } from "react";
import { X } from "lucide-react";
// ตัวอย่างข้อมูลเมนู (คุณสามารถดึงจาก Context แทนได้ถ้ามีหลายภาษา)

const Restaurant = () => {
// ใช้ Context เพื่อดึงหัวข้อ (ถ้ามี)
const { content } = useLanguage();
const [activeImage, setActiveImage] = useState(null);
const menuImages = [
    "/assets/image/Restaurant/image2.jpg",
    "/assets/image/Restaurant/image4.jpg",
    "/assets/image/Restaurant/image5.jpg",
    "/assets/image/Restaurant/image6.jpg",
    "/assets/image/Restaurant/image7.jpg",
    "/assets/image/Restaurant/image3.jpg",
  ];
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
const iconMap = {
coffee: <Coffee size={16} />,
utensils: <Utensils size={16} />,
sunset: <Sunset size={16} />
};

useEffect(() => {
    if (isGalleryOpen) {
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
  }, [isGalleryOpen]);
  
return (
<section id="restaurant" className="relative py-10 md:py-12 bg-[#FAF8F5] overflow-hidden">

{/* Background Texture */}
<div className="absolute inset-0 opacity-[0.03] pointer-events-none"
style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
</div>

<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

{/* 1. Header Section: Cinematic Vibe */}
<motion.div
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 1 }}
className="mb-20"
>
<div className="flex flex-col md:flex-row gap-8 items-end mb-8">
<span className="text-[#A89F91] text-xs font-bold tracking-[0.3em] uppercase">
Culinary Experience
</span>
<div className="h-[1px] bg-[#D4C5B0] flex-1 opacity-50"></div>
</div>

<h2 className="font-['Cormorant_Garamond',serif] text-5xl md:text-7xl text-[#3E3832] font-medium mb-6 leading-[1.1]">
Hey Now<br/>
<span className="italic text-warm-600">Cafe & Restaurant.</span>
</h2>

<p className="font-['Lato',sans-serif] text-[#6B6359] text-lg md:text-xl font-light max-w-2xl leading-relaxed">
{content.restaurant}
</p>
</motion.div>

{/* 2. Menu Highlights: A Gallery of Taste */}
<div className="space-y-16 md:space-y-24">
{content.signatureDishes.map((dish, index) => (
<motion.div
key={dish.id}
initial={{ opacity: 0, y: 50 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ duration: 0.8, delay: index * 0.1 }}
className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
index % 2 !== 0 ? 'md:flex-row-reverse' : ''
}`}
>
{/* Image Container - Polaroid Style */}
<div className="w-full md:w-1/2 relative group">
<div className="absolute -inset-4 bg-[#E8E0D5] rounded-lg -rotate-1 transition-transform group-hover:rotate-1"></div>
<div
  className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-sm shadow-lg bg-stone-200 cursor-zoom-in"
  onClick={() => setActiveImage(dish.image)}
>{/* Placeholder for Image - ใส่รูปจริงที่ dish.image */}
<img
src={dish.image}
alt={dish.name}
className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
onError={(e) => e.target.style.backgroundColor = '#ddd'} // Fallback ถ้าไม่มีรูป
/>

{/* Price Tag Overlay */}
{/* <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-warm-900 font-serif text-lg shadow-sm">
{dish.price}
</div> */}
</div>
</div>

{/* Content */}
<div className="w-full md:w-1/2 space-y-4 md:space-y-6">
<div className="flex items-center gap-3 text-[#A89F91] mb-2">
{iconMap[dish.icon]}
<span className="text-xs font-bold tracking-widest uppercase">{dish.title}</span>
</div>

<h3 className="font-['Cormorant_Garamond',serif] text-3xl md:text-5xl text-[#3E3832] leading-tight">
{dish.name}
{/* ถ้าต้องการภาษาไทย */}
{/* <span className="block text-xl text-warm-600 mt-2 font-light">{dish.nameTh}</span> */}
</h3>

<div className="w-12 h-[1px] bg-[#3E3832]"></div>

<p className="font-['Lato',sans-serif] text-[#6B6359] leading-relaxed text-lg">
{dish.desc}
</p>

{/* ถ้าต้องการภาษาไทย */}
{/* <p className="font-serif text-[#6B6359] leading-relaxed italic">
{dish.descTh}
</p> */}
</div>
</motion.div>
))}
</div>
</div>
{activeImage && (
  <motion.div
    className="fixed inset-0 z-50 bg-[#1C1A18]/90 backdrop-blur-sm flex items-center justify-center px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setActiveImage(null)}
  >
    <motion.img
      src={activeImage}
      alt="Expanded dish"
      className="max-h-[90vh] max-w-[90vw] object-contain rounded-sm shadow-2xl"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
    />

    {/* Premium Close Button */}
    <button
      onClick={() => setActiveImage(null)}
      className="absolute top-6 right-6 pointer-events-auto p-3 rounded-full 
                 bg-white/10 hover:bg-white/20 
                 backdrop-blur-md border border-white/10 
                 transition-all duration-300 group"
    >
      <X 
        size={20} 
        className="text-white/90 group-hover:rotate-90 transition-transform duration-300" 
      />
    </button>
  </motion.div>
)}

<div className="mt-24 pt-16 border-t border-[#E8E0D5] text-center">
<motion.button
        onClick={() => {
            setCurrentIndex(0);
            setIsGalleryOpen(true);
        }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden max-w-md mx-auto bg-[#3E3832] text-[#FAF8F5] py-5 px-8 rounded-full shadow-[0_10px_30px_-10px_rgba(62,56,50,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(62,56,50,0.2)] transition-all duration-500"
              >
                <span className="relative z-10 flex items-center gap-3 text-lg font-medium tracking-widest uppercase">
                   View Full Menu
                   {/* Arrow Icon */}
                   <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                   </svg>
                </span>
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </motion.button>
          </div>
          {isGalleryOpen && (
  <motion.div
    className="fixed inset-0 z-[60] bg-[#1C1A18]/95 backdrop-blur-xl 
               flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Close */}
    <button
      onClick={() => setIsGalleryOpen(false)}
      className="absolute top-6 right-6 p-3 rounded-full 
                 bg-white/10 hover:bg-white/20 
                 backdrop-blur-md border border-white/10 
                 transition-all group"
    >
      <X size={22} className="text-white group-hover:rotate-90 transition-transform" />
    </button>

    {/* Left Arrow (Desktop) */}
    <button
      onClick={() =>
        setCurrentIndex((prev) => (prev === 0 ? menuImages.length - 1 : prev - 1))
      }
      className="hidden md:flex absolute left-6 p-4 rounded-full 
                 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white"
    >
      ❮
    </button>

    {/* Image */}
    <motion.img
      key={currentIndex}
      src={menuImages[currentIndex]}
      className="max-h-[85vh] max-w-[90vw] object-contain rounded-md shadow-2xl"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => {
        if (info.offset.x < -100) {
          setCurrentIndex((prev) => (prev + 1) % menuImages.length);
        }
        if (info.offset.x > 100) {
          setCurrentIndex((prev) =>
            prev === 0 ? menuImages.length - 1 : prev - 1
          );
        }
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />

    {/* Right Arrow (Desktop) */}
    <button
      onClick={() =>
        setCurrentIndex((prev) => (prev + 1) % menuImages.length)
      }
      className="hidden md:flex absolute right-6 p-4 rounded-full 
                 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white"
    >
      ❯
    </button>

    {/* Indicator */}
    <div className="absolute bottom-8 flex gap-2">
      {menuImages.map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${
            i === currentIndex ? "bg-white" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  </motion.div>
)}

</section>
);
};

export default Restaurant;