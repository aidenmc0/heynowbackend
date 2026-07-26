import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const Layout = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [scale, setScale] = useState(1);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    const newScale = Math.min(Math.max(scale + delta, 1), 3);

    setScale(newScale);

    if (newScale <= 1) {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  return (
    <>
      {/* ===== Section ปกติ ===== */}
      <section id="layout" className="py-6 px-6 bg-forest-600 text-warm-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)] mx-auto cursor-zoom-in"
            onClick={() => {
              setScale(1);
              animate(x, 0);
              animate(y, 0);
              setOpen(true);
            }}
          >
            <img
              src="/assets/image/Layout.jpg"
              alt="Resort Layout Overview"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="mt-4 text-center text-sm md:text-xl font-light tracking-[0.2em] uppercase"
          >
            Master Layout — Designed for Privacy & Harmony
          </motion.p>
        </div>
      </section>

      {/* ===== Fullscreen Viewer ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center select-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl z-50 p-2"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            {/* Container */}
            <div
              ref={containerRef}
              className="
                relative 
                w-full 
                h-full 
                flex items-center justify-center
                cursor-default
              "
              onWheel={handleWheel}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src="/assets/image/Layout.jpg"
                alt="Resort Layout Fullscreen"
                drag={scale > 1}
                dragElastic={false}
                dragMomentum={false}
                style={{ x, y, scale, cursor: scale > 1 ? "grab" : "default" }}
                whileTap={{ cursor: "grabbing" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="                  w-full
                  md:max-w-[1100px] 
                  max-h-[85vh]
                  object-contain
                  shadow-2xl
                  select-none
                  will-change-transform
                "
                draggable={false}
              />
            </div>

            {/* Hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 text-xs tracking-widest uppercase text-white/60 pointer-events-none text-center px-4"
            >
              <p>Scroll to Zoom · Drag to Pan</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Layout;
