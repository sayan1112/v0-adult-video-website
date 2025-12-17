"use client"

import Link from "next/link"
import { Eye, Clock } from "lucide-react"

export function VideoCardSmall({ video }: { video: any }) {
  return (
    <Link href={`/video/${video.id}`} className="flex gap-4 group">
      <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-muted">
        {video.thumbnail_url ? (
            <img 
                src={video.thumbnail_url} 
                alt={video.title} 
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
            />
        ) : (
             <div className="w-full h-full bg-secondary flex items-center justify-center text-xs">No Thumb</div>
        )}
      </div>
      <div className="flex-1 py-1">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{video.description || "No description"}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
             <div className="flex items-center gap-1">
                 <Eye className="w-3 h-3" />
                 {video.views}
            </div>
             <div className="flex items-center gap-1">
                 <Clock className="w-3 h-3" />
                 {new Date(video.created_at).toLocaleDateString()}
            </div>
        </div>
      </div>
    </Link>
  )
}
