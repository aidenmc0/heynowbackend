import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const Story = () => {
  const { content } = useLanguage();

  return (
    <section id="story" className="py-20 md:py-32 px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center space-y-8 md:space-y-10"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block"
        >
          <span className="text-forest-600 uppercase tracking-[0.25em] text-xs font-bold border-b border-forest-200 pb-2">
            {content.nav?.story || "Our Philosophy"} 
          </span>
        </motion.div>
        
        <h2 className="font-['Cormorant_Garamond',serif] text-2xl lg:text-4xl text-warm-900 leading-[1.2]">
          {content.story.title}
        </h2>
        
        <div className="space-y-8 md:space-y-10 text-lg md:text-xl text-warm-800 font-light leading-relaxed tracking-wide max-w-2xl mx-auto">
          <p className="opacity-90">
            {content.story.text1}
          </p>
          <p className="opacity-80">
            {content.story.text2}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Story;