import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion"; // เพิ่ม import นี้
import { useState, useEffect } from "react";

// Animation Variants สำหรับการค่อยๆ ขึ้นของแต่ละส่วน
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: "easeOut" } 
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3 // เวลาหน่วงระหว่างแต่ละองค์ประกอบ
    }
  }
};

const Hero = () => {
  const { content, lang, changeLanguage } = useLanguage();
  const [openStory, setOpenStory] = useState(false);

  useEffect(() => {
    document.body.style.overflow = openStory ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [openStory]);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("heyNowVisited");
  
    if (!hasVisited) {
      setOpenStory(true);
      sessionStorage.setItem("heyNowVisited", "true");
    }
  }, []);
  
  return (
    <header className="relative h-screen w-full overflow-hidden flex items-end">
      <div className="absolute inset-0 z-0">
        <picture>
          {/* PC / Tablet */}
          <source
            srcSet="/assets/image/Overview/PC/14.jpg"
            media="(min-width: 768px)"
          />
          {/* Mobile */}
          <img
            src="/assets/image/Overview/Phone/6.jpg"
            alt="Chiang Dao Mist"
            className="w-full h-full object-cover brightness-[0.65] scale-105"
          />
        </picture>
        {/* เพิ่ม Gradient ด้านล่างให้ทึบขึ้นเพื่อให้อ่าน Text ง่าย */}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-50/90 via-transparent to-transparent opacity-90"></div>
      </div>

      <div className="relative z-10 w-full pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-2xl"
        >
          {/* Backdrop Glass */}
          <div className="absolute -inset-6 md:-inset-8 rounded-md bg-black/35 backdrop-blur-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] pointer-events-none" />

          {/* Content */}
          <div className="relative flex flex-col gap-6">
            <motion.h1 variants={textVariants} className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05]">
              Hey Now <br />
              <i className="text-5xl md:text-6xl lg:text-7xl">
                Chiang Dao Stay
              </i>
            </motion.h1>

            <motion.p variants={textVariants} className="text-warm-50 text-lg md:text-xl font-light border-l border-white/40 pl-4 max-w-md">
              {content.hero.subtitle}
            </motion.p>

            <motion.div variants={textVariants} className="flex flex-wrap gap-4">
            <a
              href="https://www.facebook.com/share/17qkwE3XuF/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-forest-600/90 backdrop-blur-sm text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase border border-white/20 hover:bg-forest-700 transition-all"
            >
              {content.hero.book}
            </a>
             <button
                onClick={() => setOpenStory(true)}
                className="bg-white/5 text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase 
                          border border-white/30 backdrop-blur-sm 
                          hover:bg-white/10 transition-all"
              >
                {content.hero.ourstory}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {openStory && (
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpenStory(false)}
      >
        {/* Modal Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="
            relative w-full max-w-md md:max-w-lg
            bg-[#FAF8F5] rounded-2xl
            px-6 py-12
            md:px-12 md:py-14
            max-h-[85vh] overflow-y-auto
            shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]
          "
        >
          {/* Language Switcher */}
          <div className="absolute top-4 left-4 flex gap-1 z-10">
            {[
              { code: "th", label: "TH" },
              { code: "en", label: "EN" },
              { code: "cn", label: "中文" }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className={`px-3 py-1 rounded-full text-xs tracking-wide transition
                  ${
                    lang === l.code
                      ? "bg-[#3E3832] text-white"
                      : "bg-white text-[#3E3832] border border-[#D8D2C8] hover:bg-[#EFEAE3]"
                  }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Close */}
          <button
            onClick={() => setOpenStory(false)}
            className="absolute top-4 right-4 text-[#3E3832]/50 hover:text-[#3E3832] transition"
          >
            ✕
          </button>

          {/* Content */}
          <div className="space-y-6 text-[#3E3832]">
            <h3 className="font-serif text-2xl md:text-3xl leading-snug whitespace-pre-line">
              {content.hero.modal.title}
            </h3>

          <p className="font-light leading-relaxed text-[#6B6359]">
            {content.hero.modal.intro}
          </p>

            <div className="space-y-4 text-sm leading-relaxed text-[#5D4C5B]">
              <p className="font-medium tracking-wide uppercase text-[#3E3832]">
                {content.hero.modal.stepTitle}
              </p>

              <ol className="space-y-3 list-decimal list-inside">
                {content.hero.modal.steps.map((step, i) => (
                  <li key={i} className="whitespace-pre-line">
                    {step}
                  </li>
                ))}
              </ol>

              <p className="pt-4 text-[#6B6359] italic">
                {content.hero.modal.footer}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}

    </header>
  );
};

export default Hero;