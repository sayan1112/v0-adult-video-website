"use client"

interface VideoPlayerProps {
  videoUrl: string
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  // Simple heuristic to determine if it's a direct video file or an embed/website
  // We assume if it doesn't have a video extension, it's likely a website/embed URL
  const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg|mov|m4v)$/i)

  if (isDirectVideo) {
    return (
      <div className="relative w-full overflow-hidden rounded-t-lg bg-black" style={{ maxHeight: '500px' }}>
        <video controls className="w-full h-auto" style={{ maxHeight: '500px' }} controlsList="nodownload" preload="metadata">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  // Fallback for websites / generic embeds
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-black">
      <iframe 
        src={videoUrl} 
        className="size-full border-0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
