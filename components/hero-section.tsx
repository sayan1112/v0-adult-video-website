"use client"

import { motion } from "framer-motion"
import { Play, Sparkles } from "lucide-react"
import { Button } from "./ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
       {/* Background Elements */}
       <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
       </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm mb-6 bg-background/50"
        >
          <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
          <span>Experience the next generation of streaming</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-white drop-shadow-2xl"
        >
          Premium Content 
          <br className="hidden sm:block" />
          For Digital Connoisseurs
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-gray-200 drop-shadow-md font-medium"
        >
          Discover a world of high-quality entertainment. Curated collections, 
          stunning visuals, and an immersive viewing experience await you.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex gap-4"
        >
          <Button size="lg" className="rounded-full px-8 text-lg h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
            Start Watching
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-12 backdrop-blur-sm bg-background/50">
            <Play className="mr-2 size-4" />
            Live Demo
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
