import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock } from "lucide-react"
import Image from "next/image"

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

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video.id}`}>
      <Card className="group overflow-hidden transition-all hover:ring-2 hover:ring-primary">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {video.thumbnail_url ? (
            <Image
              src={video.thumbnail_url || "/placeholder.svg"}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-6xl">🎬</span>
            </div>
          )}
          {video.duration && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-xs text-white">
              <Clock className="size-3" />
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-semibold text-balance group-hover:text-primary">{video.title}</h3>
          {video.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>}
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            {video.category && (
              <Badge variant="secondary" className="capitalize">
                {video.category}
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatViews(video.views)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
