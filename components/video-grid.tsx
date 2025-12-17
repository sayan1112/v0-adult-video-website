"use client"

import { VideoCard } from "./video-card"
import { motion } from "framer-motion"

interface Video {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration: number | null
  views: number
  category: string | null
  created_at: string
}

interface VideoGridProps {
  videos: Video[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">No videos found</p>
        <p className="text-sm text-muted-foreground">Check back later for new content</p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="tube-grid"
    >
      {videos.map((video) => (
        <motion.div key={video.id} variants={item}>
          <VideoCard video={video} />
        </motion.div>
      ))}
    </motion.div>
  )
}
