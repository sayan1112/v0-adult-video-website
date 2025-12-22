"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, Play, Star } from "lucide-react"
import Image from "next/image"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MouseEvent, useRef } from "react"
import { VideoRating } from "./video-rating"

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
  rating?: number
}

interface VideoCardProps {
  video: Video
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const past = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }
  
  return 'Just now'
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

export function VideoCard({ video }: VideoCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set(clientX - left - width / 2)
    y.set(clientY - top - height / 2)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])
  const brightness = useTransform(mouseY, [-100, 100], [1.1, 0.9])

  return (
    <Link href={`/video/${video.id}`} className="block w-full focus:outline-none">
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          perspective: 1000,
        }}
        className="group/card relative w-full"
      >
        <motion.div
           style={{
             rotateX,
             rotateY,
             transformStyle: "preserve-3d",
           }}
           className="relative transition-all duration-200 ease-linear"
        >
          {/* Content Container - The actual "Card" */}
          <div className="space-y-2 rounded-xl p-2 transition-colors group-hover/card:bg-muted/20"> 
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-border/50 group-hover/card:ring-primary/50 transition-all">
              <motion.div 
                 style={{ filter: useMotionTemplate`brightness(${brightness})` }}
                 className="relative w-full h-full"
              >
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 will-change-transform group-hover/card:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <Play className="size-8 text-muted-foreground/50" />
                  </div>
                )}
              </motion.div>

              {/* Badges */}
              <div className="absolute top-1.5 left-1.5 flex gap-1 z-10">
                  <Badge variant="secondary" className="bg-black/60 backdrop-blur-md px-1 h-4 text-[9px] font-bold text-white border-0 rounded-sm">
                      HD
                  </Badge>
              </div>

              {/* Duration */}
              {video.duration && (
                 <div className="absolute bottom-1.5 right-1.5 bg-black/80 z-10 rounded px-1 min-w-[30px] text-center py-0.5 text-[10px] font-bold text-white">
                   {formatDuration(video.duration)}
                 </div>
              )}

              {/* Hover Progress Bar (Simulated) */}
              <div className="absolute bottom-0 left-0 h-0.5 w-full z-10 bg-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity">
                 <div className="h-full w-2/3 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-0.5 px-0.5">
              <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground group-hover/card:text-primary transition-colors transform-gpu" style={{ transform: "translateZ(8px)" }}>
                {video.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground transform-gpu" style={{ transform: "translateZ(4px)" }}>
                 <span className="">
                   {getTimeAgo(video.created_at)}
                 </span>
                 <span className="flex items-center gap-1">
                   <Eye className="size-3" />
                   {formatViews(video.views)}
                 </span>
                 <span className="flex items-center gap-1 font-mono text-primary/80">
                    {video.duration ? formatDuration(video.duration) : ""}
                 </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}

