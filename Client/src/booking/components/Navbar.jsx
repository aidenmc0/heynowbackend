import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

// --- ตรวจสอบตรงนี้ให้แน่ใจว่ามีครบทุกภาษา ---
const navLinks = [
  "Story",
  "Highlights",
  "Rooms",
  "Restaurant",
  "Layout",
  "Location",
  "Contact",
];

const languages = [
  { code: "th", label: "TH" },
  { code: "en", label: "EN" },
  { code: "cn", label: "CN" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 1. ดึงค่า Context
  const { lang, changeLanguage, content } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={` fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-warm-50/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto pl-4 pr-6 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <div
          className={`font-serif text-xl md:text-2xl tracking-widest cursor-pointer transition-colors duration-300 ${
            scrolled ? "text-warm-900" : "text-white"
          }`}
        >
         Hey Now Chiang Dao Stay
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {/* Nav Links */}
          <div className="flex space-x-8 text-sm tracking-widest uppercase font-light">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`transition-colors duration-300 ${
                  scrolled
                    ? "text-warm-800 hover:text-forest-600"
                    : "text-white hover:text-warm-200"
                }`}
              >
                {content.nav?.[item.toLowerCase()] || item}
              </a>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex bg-black/5 backdrop-blur-md rounded-full p-1 border border-black/10">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => changeLanguage(l.code)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  lang === l.code
                    ? "bg-warm-900 text-white shadow-md"
                    : "text-warm-600 hover:bg-warm-200"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 transition-colors duration-300 ${
            scrolled ? "text-warm-900" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <line x1="18" y1="6" x2="6" y2="18"></line>
            ) : (
              <line x1="3" y1="12" x2="21" y2="12"></line>
            )}
            {!menuOpen && <line x1="3" y1="6" x2="21" y2="6"></line>}
            {!menuOpen && <line x1="3" y1="18" x2="21" y2="18"></line>}
            {menuOpen && <line x1="6" y1="6" x2="18" y2="18"></line>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-warm-50 flex flex-col items-center justify-center space-y-8 overflow-hidden"
          >
            {/* Language Switcher (Mobile) */}
            <div className="flex gap-4 mb-8">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    changeLanguage(l.code);
                    setMenuOpen(false);
                  }}
                  className={`px-6 py-2 rounded-full text-lg font-medium transition-all ${
                    lang === l.code ? "bg-warm-900 text-white" : "text-warm-600"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Mobile Links (ใช้ content.nav) */}
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-serif text-2xl text-warm-900 hover:text-forest-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {content.nav?.[item.toLowerCase()] || item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
