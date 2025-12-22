"use client"

import { motion } from "framer-motion"
import { Play, Sparkles } from "lucide-react"
import { Button } from "./ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 perspective-1000">
       {/* 3D Background Elements */}
       <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Animated Blobs */}
          <motion.div 
            animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 90, 0],
               opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
               scale: [1, 1.1, 1],
               rotate: [0, -45, 0],
               x: [0, 50, 0],
               opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" 
          />
       </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 30, rotateX: 20 }}
           animate={{ opacity: 1, y: 0, rotateX: 0 }}
           transition={{ duration: 0.8, type: "spring" }}
           className="perspective-1000"
        >
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground backdrop-blur-md mb-6 bg-background/30 shadow-2xl ring-1 ring-white/10">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Experience the next generation of streaming</span>
          </div>
        
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-2xl mb-6">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/20 to-white/50 bg-[length:200%_auto] animate-shimmer">
               Premium Content 
            </span>
             For Digital Connoisseurs
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-2xl text-lg text-gray-300/80 drop-shadow-md font-medium"
        >
          Discover a world of high-quality entertainment. Curated collections, 
          stunning visuals, and an immersive viewing experience await you.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex gap-4"
        >
          <Button size="lg" className="relative group overflow-hidden rounded-full px-8 text-lg h-12 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-10px_rgba(var(--primary),0.6)] transition-all transform hover:-translate-y-1">
             <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shine" />
            Start Watching
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-12 backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all">
            <Play className="mr-2 size-4" />
            Live Demo
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
