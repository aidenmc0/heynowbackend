import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext'; // Import Context

const Footer = () => {
  const { content } = useLanguage(); // ดึง Content ทั้งก้อน

  return (
    <footer id="contact" className="bg-warm-900 text-warm-100 pt-12 pb-10 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ===== Invitation ===== */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
            {content.footerTitle} {/* ใช้ Content จาก JS */}
          </h2>
          <p className="text-warm-200 font-light text-lg md:text-xl opacity-75 leading-relaxed">
            {content.footerDesc}
          </p>
          <p className="text-warm-200 font-light text-lg md:text-xl opacity-75 leading-relaxed">
            {content.footerDesc2}
          </p>
        </div>

        {/* ===== Contact Actions ===== */}
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a
            href="tel:0931388234"
            className="
            bg-white/10 backdrop-blur-sm text-white
              px-10 py-4 rounded-full
              font-medium tracking-wide
              border-2 border-white/30
              hover:bg-white hover:text-warm-900
              transition-all duration-300
              text-center
            "
          >
            {content.contactPhone} {/* ข้อความจาก Context */}
          </a>

          <a
              href="https://www.facebook.com/share/17qkwE3XuF/"
              target="_blank"
              rel="noopener noreferrer"
            className="
              bg-white/10 backdrop-blur-sm text-white
              px-10 py-4 rounded-full
              font-medium tracking-wide
              border-2 border-white/30
              hover:bg-white hover:text-warm-900
              transition-all duration-300
              text-center
            "
          >
            {content.contactLine}
          </a>
        </div>

        {/* ===== Divider ===== */}
        <div className="border-t border-warm-800" />

        {/* ===== Bottom Info ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-warm-300">
          {/* Right */}
          <div className="flex gap-8 tracking-wide">
            <a
              href="https://www.instagram.com/heynow_chiangdao_stay?igsh=MXZ4bzA1djNveHVnaA=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/17qkwE3XuF/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              className="hover:text-white transition-colors"
            >
              +66 93 138 8234
            </a>
          </div>

          {/* Left */}
          <p className="opacity-60">
            {content.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;