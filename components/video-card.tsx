"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, Play } from "lucide-react"
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

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video.id}`} className="group/card block w-full space-y-2">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-border/50 group-hover/card:ring-primary/50 transition-all">
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

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-md px-1.5 h-5 text-[10px] font-bold text-white border-0 rounded-sm">
                HD
            </Badge>
        </div>

        {/* Duration */}
        {video.duration && (
           <div className="absolute bottom-1.5 right-1.5 bg-black/80 rounded px-1.5 py-0.5 text-[10px] font-bold text-white">
             {formatDuration(video.duration)}
           </div>
        )}

        {/* Hover Progress Bar (Simulated) */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity">
           <div className="h-full w-2/3 bg-primary" />
        </div>
        
        {/* Play Overlay (Subtle) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/20">
            <div className="rounded-full bg-black/50 p-3 backdrop-blur-sm">
                 <Play className="size-5 fill-white text-white" />
            </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1 px-0.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground group-hover/card:text-primary transition-colors">
          {video.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground/80">
           <span>{Intl.NumberFormat('en-US', { notation: "compact" }).format(video.views)} views</span>
           <span className="text-[10px]">•</span>
           <span>2 days ago</span> {/* Mock time for now, or use video.created_at */}
        </div>

        {video.category && (
            <div className="text-xs text-muted-foreground hover:text-foreground transition-colors">
               {video.category}
            </div>
        )}
      </div>
    </Link>
  )
}

