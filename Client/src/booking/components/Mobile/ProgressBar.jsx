// src/components/Mobile/ProgressBar.jsx
export default function ProgressBar({ totalSlides, activeIndex }) {
  return (
    <div className="absolute top-6 left-0 right-0 px-6 z-50 flex gap-2">
      {[...Array(totalSlides)].map((_, i) => (
        <div
          key={i}
          className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              i <= activeIndex ? 'bg-white w-full' : 'bg-transparent'
            }`}
          />
        </div>
      ))}
    </div>
  );
}