import Link from "next/link"
import { Play } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeroSection } from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import { CategoryNav } from "@/components/category-nav"
import { SearchBar } from "@/components/search-bar"
import { VideoGrid } from "@/components/video-grid"
import { getVideos } from "@/lib/db"
import { getSession } from "@/lib/auth"
import Image from "next/image"

interface PageProps {
  searchParams: Promise<{
    category?: string
    error?: string
  }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const session = await getSession();
  const { category } = await searchParams
  
  // Fetch videos from local DB
  const videos = await getVideos()
  
  // Filter client-side since our JSON DB is simple
  const filteredVideos = category 
    ? videos.filter(v => v.category?.toLowerCase() === category.toLowerCase())
    : videos

  // Extract unique categories and format for nav
  const uniqueCategories = Array.from(new Set(videos.map((v) => v.category).filter(Boolean))) as string[]
  const categories = uniqueCategories.map(cat => ({ 
    id: cat, 
    name: cat, 
    slug: cat.toLowerCase(), // slug is usually the lowercased version 
    description: null 
  }))

  return (
    <div className="min-h-screen bg-transparent">


      {/* Category Navigation */}
      <div className="z-40 w-full">
         <CategoryNav categories={categories || []} />
      </div>

      {/* Main Content */}
      <main className="container-tube py-8">
        <HeroSection />

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full block"></span>
              Featured Videos
            </h2>
            <Link href="/" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View All
            </Link>
          </div>
          <VideoGrid videos={filteredVideos} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 mt-20 bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
             <div className="relative size-8 rounded-lg overflow-hidden">
                <Image src="/icon.png" alt="Logo" fill className="object-cover" />
             </div>
            <span className="font-semibold text-foreground">BoysHub</span>
          </div>
          <p>© 2025 BoysHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
