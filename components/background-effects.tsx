"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const BACKGROUND_IMAGES = [
  "/backgrounds/bg-1.png",
  "/backgrounds/bg-2.png",
  "/backgrounds/bg-3.png",
  "/backgrounds/bg-4.png",
]

export function BackgroundEffects() {
  // Start with a state for mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set random initial index on mount (refresh)
    setCurrentIndex(Math.floor(Math.random() * BACKGROUND_IMAGES.length));
    setIsMounted(true);

    // Rotate every 1 minute
    const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 60000); 

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return <div className="fixed inset-0 z-[-1] bg-black" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-black">
       <AnimatePresence mode="wait">
        <motion.div 
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }} // Smooth cross-fade
            className="absolute inset-0 h-full w-full"
        >
             <Image 
                src={BACKGROUND_IMAGES[currentIndex]} 
                alt="Background" 
                fill
                className="object-cover opacity-60"
                priority
                quality={100} // High quality for larger resolutions
            />
        </motion.div>
       </AnimatePresence>
       
       {/* Overlay Gradient to fade bottom/ensure text readability */}
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
       
       {/* Subtle Overlay Pattern/Grid - Adjusted pattern for better visibility on high res */}
       <div 
         className="absolute inset-0 opacity-[0.1]"
         style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
         }}
       />
    </div>
  )
}
