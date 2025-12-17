import { getSession } from "@/lib/auth";
import { getVideos, deleteVideo } from "@/lib/db";
import { redirect } from "next/navigation";
import { deleteVideoAction, logoutAction } from "@/app/actions";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'admin') redirect('/login');

  const videos = await getVideos();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        <form action={logoutAction}>
            <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="p-6 rounded-xl border bg-card/60 backdrop-blur-xl">
              <h3 className="text-sm font-medium text-muted-foreground">Total Videos</h3>
              <p className="text-3xl font-bold mt-2">{videos.length}</p>
          </div>
          <div className="p-6 rounded-xl border bg-card/60 backdrop-blur-xl">
               <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
               <p className="text-3xl font-bold mt-2">{videos.reduce((acc, v) => acc + v.views, 0).toLocaleString()}</p>
          </div>
          <div className="p-6 rounded-xl border bg-card/60 backdrop-blur-xl">
               <h3 className="text-sm font-medium text-muted-foreground">Average Rating</h3>
               <p className="text-3xl font-bold mt-2">
                   {(videos.reduce((acc, v) => acc + (v.rating || 0), 0) / (videos.length || 1)).toFixed(1)}
               </p>
          </div>
      </div>

      <div className="rounded-xl border bg-card/60 backdrop-blur-xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold">Video Management</h2>
          </div>
          <AdminDashboard videos={videos} />
      </div>
    </div>
  )
}
