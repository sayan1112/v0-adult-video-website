import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"

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
  const supabase = await createClient()

  // Fetch video details
  const { data: video } = await supabase.from("videos").select("*").eq("id", id).single()

  if (!video) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("videos")
    .update({ views: video.views + 1 })
    .eq("id", id)

  // Fetch related videos from same category
  const { data: relatedVideos } = await supabase
    .from("videos")
    .select("*")
    .eq("category", video.category)
    .neq("id", id)
    .limit(8)

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main video section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <VideoPlayer videoUrl={video.video_url} />
              </CardContent>
            </Card>

            <div className="mt-6">
              <h1 className="text-3xl font-bold text-balance">{video.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Eye className="size-4" />
                  {video.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {formatDate(video.created_at)}
                </div>
                {video.category && (
                  <Badge variant="secondary" className="capitalize">
                    {video.category}
                  </Badge>
                )}
              </div>

              {video.description && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{video.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar with related videos */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Related Videos</h2>
            <div className="flex flex-col gap-4">
              {relatedVideos?.map((relatedVideo) => (
                <a
                  key={relatedVideo.id}
                  href={`/video/${relatedVideo.id}`}
                  className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded bg-muted">
                    {relatedVideo.thumbnail_url ? (
                      <img
                        src={relatedVideo.thumbnail_url || "/placeholder.svg"}
                        alt={relatedVideo.title}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <span className="text-2xl">🎬</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium group-hover:text-primary">{relatedVideo.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{relatedVideo.views.toLocaleString()} views</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
