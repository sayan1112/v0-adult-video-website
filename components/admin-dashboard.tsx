"use client"

import { Button } from "@/components/ui/button"
import { deleteVideoAction } from "@/app/actions"
import { Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"

export function AdminDashboard({ videos }: { videos: any[] }) {
    
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;
        await deleteVideoAction(id);
    }

  return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Views</th>
                    <th className="px-6 py-3">Rating</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {videos.map((video) => (
                    <tr key={video.id} className="border-b border-white/5 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                            {video.thumbnail_url && (
                                <img src={video.thumbnail_url} className="w-10 h-6 object-cover rounded" />
                            )}
                            {video.title}
                        </td>
                        <td className="px-6 py-4">{video.views}</td>
                        <td className="px-6 py-4">{video.rating?.toFixed(1) || '-'}</td>
                        <td className="px-6 py-4">{new Date(video.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            <Link href={`/video/${video.id}`} target="_blank">
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button 
                                size="icon" 
                                variant="destructive" 
                                className="h-8 w-8"
                                onClick={() => handleDelete(video.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
  )
}
