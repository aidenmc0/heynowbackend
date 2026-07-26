import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function StoryCard({ slide, isActive, isBookingSlide, bookingLink }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-full flex-shrink-0 snap-start overflow-hidden flex items-end justify-center bg-[#050505]">
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.style.backgroundColor = '#050505';
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full px-6 pb-28 md:pb-44 text-white pointer-events-none"
      >
        <h2 className="serif text-5xl mb-3 leading-tight">{slide.title}</h2>
        <p className="text-white/90 text-sm font-light leading-relaxed mb-6 max-w-md text-shadow-soft">
          {slide.desc}
        </p>

        {isBookingSlide && bookingLink && (
          <button
            onClick={() => navigate(bookingLink)}
            className="pointer-events-auto flex items-center gap-3 text-xs uppercase tracking-[0.2em] bg-white text-black px-5 py-3 rounded-full font-bold hover:bg-stone-200 transition-colors"
          >
            {slide.action || "Book Now"}
          </button>
        )}
      </motion.div>
    </div>
  );
}
