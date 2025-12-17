import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, ThumbsUp, Share2, Flag } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"
import { VideoRating } from "@/components/video-rating"
import { addToHistoryAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getVideoById, getVideosByCategory, incrementVideoViews } from "@/lib/db"

interface PageProps {
  params: Promise<{ id: string }>
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params
  
  // Fetch from local DB
  const video = await getVideoById(id)

  if (!video) {
    notFound()
  }

  // Increment views
  await incrementVideoViews(id)
  
  // Track history
  await addToHistoryAction(id);

  // Fetch related videos
  const relatedVideos = video.category ? await getVideosByCategory(video.category, id) : []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main video section */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border bg-card/50 shadow-2xl backdrop-blur-sm border-white/5">
                <VideoPlayer videoUrl={video.video_url} />
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-bold text-balance text-glow tracking-tight">{video.title}</h1>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
                 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Eye className="size-4 text-primary" />
                      {video.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      {formatDate(video.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                          <ThumbsUp className="size-4" />
                          Like
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 rounded-full">
                          <Share2 className="size-4" />
                          Share
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full">
                          <Flag className="size-4" />
                      </Button>
                  </div>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-4">
                 <VideoRating videoId={video.id} initialRating={0} />
                 {video.category && (
                    <Badge variant="outline" className="capitalize px-3 py-1 text-sm bg-primary/10 border-primary/20 text-primary">
                      {video.category}
                    </Badge>
                  )}
              </div>

              {video.description && (
                <div className="mt-6 rounded-xl bg-muted/30 p-4 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{video.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar with related videos */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card/30 p-4 backdrop-blur-sm">
                 <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <span className="h-4 w-1 bg-primary rounded-full"></span>
                    Related Videos
                 </h2>
                <div className="flex flex-col gap-4">
                  {relatedVideos?.map((relatedVideo) => (
                    <Link
                      key={relatedVideo.id}
                      href={`/video/${relatedVideo.id}`}
                      className="group flex gap-3 rounded-lg p-2 transition-all hover:bg-muted/50 hover:scale-[1.02]"
                    >
                      <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-muted border border-white/5">
                        {relatedVideo.thumbnail_url ? (
                          <Image
                            src={relatedVideo.thumbnail_url || "/placeholder.svg"}
                            alt={relatedVideo.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <span className="text-xl">🎬</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary transition-colors leading-tight">
                            {relatedVideo.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">{relatedVideo.views.toLocaleString()} views</p>
                      </div>
                    </Link>
                  ))}
                  {(!relatedVideos || relatedVideos.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">No related videos found.</p>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
