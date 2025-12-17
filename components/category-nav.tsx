"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  // Mock robust categories if few exist, to demonstrate the 'tube' look
  const displayCategories = categories.length > 3 ? categories : [
      ...categories,
      { id: '101', name: 'Popular', slug: 'popular', description: null },
      { id: '102', name: 'Newest', slug: 'newest', description: null },
      { id: '103', name: 'Top Rated', slug: 'top-rated', description: null },
      { id: '104', name: 'Trending', slug: 'trending', description: null },
      { id: '105', name: 'Amateur', slug: 'amateur', description: null },
      { id: '106', name: 'Professional', slug: 'professional', description: null },
  ]

  return (
    <div className="border-b border-white/5 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 relative z-40">
      <div className="container-tube py-3">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
          <Link href="/">
             <div className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border cursor-pointer select-none",
                !currentCategory && pathname === "/" 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                  : "bg-muted/50 hover:bg-muted border-transparent text-muted-foreground hover:text-foreground"
             )}>
                ALL
             </div>
          </Link>
          
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/?category=${category.slug}`}>
               <div className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border cursor-pointer select-none uppercase tracking-wide",
                  currentCategory === category.slug 
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                    : "bg-muted/50 hover:bg-muted border-transparent text-muted-foreground hover:text-foreground"
               )}>
                  {category.name}
               </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
