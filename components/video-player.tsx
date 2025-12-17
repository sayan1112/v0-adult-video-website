"use client"

interface VideoPlayerProps {
  videoUrl: string
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-black">
      <video controls className="size-full" controlsList="nodownload" preload="metadata">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
