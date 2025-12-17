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

  return (
    <div className="border-b bg-muted/30">
      <div className="container">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full",
                !currentCategory && pathname === "/" && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              All
            </Button>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/?category=${category.slug}`}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap",
                  currentCategory === category.slug && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
