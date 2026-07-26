import { motion } from 'framer-motion';

const Gallery = () => {
  const images = [
    '/assets/image/Gallery/image1.jpg',
    '/assets/image/Gallery/image2.jpg',
    '/assets/image/Gallery/image3.jpg',
    '/assets/image/Gallery/image4.jpg',
    '/assets/image/Gallery/image5.jpg',
    '/assets/image/Gallery/image6.jpg',
    '/assets/image/Gallery/image7.jpg',

  ];

  return (
    <section id="gallery" className="py-12 bg-warm-50">
      <div className="flex flex-col space-y-1">
        {images.map((src, idx) => (
          <motion.div
            key={idx}
            className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '50px' }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={src}
              alt={`Gallery ${idx}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
