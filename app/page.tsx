import { createClient } from "@/lib/supabase/server"
import { VideoGrid } from "@/components/video-grid"
import { CategoryNav } from "@/components/category-nav"
import { SearchBar } from "@/components/search-bar"
import { Play } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch latest videos
  const { data: videos } = await supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(20)

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

      {/* Category Navigation */}
      <CategoryNav categories={categories || []} />

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Latest Videos</h2>
          <p className="text-muted-foreground">Check out our newest content</p>
        </div>
        <VideoGrid videos={videos || []} />
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 VideoHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
