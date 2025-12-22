import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { getSession } from "@/lib/auth"
import Image from "next/image"

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <div className="relative size-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
             <Image src="/icon.png" alt="Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight">BoysHub</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4 md:flex-initial">
            <Link href="/upload">
              <Button variant="ghost" size="icon" className="sm:hidden">
                <span className="text-xl">+</span>
              </Button>
              <Button variant="ghost" className="hidden sm:flex">Upload</Button>
            </Link>
            <SearchBar />
            
            {session ? (
                <Link href={session.user.role === 'admin' ? '/admin' : '/profile'}>
                  <Button variant="outline" size="sm">
                      {session.user.role === 'admin' ? 'Admin' : 'Profile'}
                  </Button>
                </Link>
            ) : (
                <div className="flex gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="default" size="sm" className="hidden sm:flex">Sign Up</Button>
                    </Link>
                </div>
            )}
            <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
