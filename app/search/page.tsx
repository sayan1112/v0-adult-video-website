import { createClient } from "@/lib/supabase/server"
import { VideoGrid } from "@/components/video-grid"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"
import { Play } from "lucide-react"

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q || ""
  const supabase = await createClient()

  // Search videos by title or description
  let videosQuery = supabase.from("videos").select("*").order("created_at", { ascending: false })

  if (query) {
    videosQuery = videosQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  const { data: videos } = await videosQuery

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
              <Play className="size-6 fill-primary-foreground text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">VideoHub</span>
          </Link>
          <SearchBar />
        </div>
      </header>

      {/* Search Results */}
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{query ? `Search results for "${query}"` : "All Videos"}</h1>
          <p className="text-muted-foreground">{videos?.length || 0} videos found</p>
        </div>
        <VideoGrid videos={videos || []} />
      </main>
    </div>
  )
}
