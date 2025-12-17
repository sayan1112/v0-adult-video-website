"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { uploadVideoAction } from "@/app/actions" // Import server action
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, UploadCloud } from "lucide-react"
import { toast } from "sonner" // Assuming sonner or we can just alert

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  video_url: z.string().optional(), 
  thumbnail_url: z.string().optional().or(z.literal("")),
})

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [uploadMode, setUploadMode] = React.useState<"url" | "file">("url")
  const [videoFile, setVideoFile] = React.useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      video_url: "",
      thumbnail_url: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Manual Validation based on mode
    if (uploadMode === "url" && (!values.video_url || values.video_url.length < 5)) {
        form.setError("video_url", { message: "Please enter a valid video URL" });
        return;
    }
    if (uploadMode === "file" && !videoFile) {
        alert("Please select a video file to upload.");
        return;
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", values.title)
      if (values.description) formData.append("description", values.description)
      formData.append("category", values.category)
      
      if (uploadMode === "url") {
          formData.append("video_url", values.video_url!)
      } else if (videoFile) {
          formData.append("video_file", videoFile)
          // We don't send video_url, the server will generate it
      }

      if (values.thumbnail_url) formData.append("thumbnail_url", values.thumbnail_url)
      
      const result = await uploadVideoAction(formData)
      
      if (result?.success) {
         router.push("/")
         router.refresh()
      } else {
         console.error("Server Error:", result);
         alert(result?.error || "Something went wrong on the server.")
      }
      
    } catch (error) {
      console.error("Error uploading video:", error)
      alert("Failed to upload video. Please try again.") 
    } finally {
       setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Upload Video</h1>
        <p className="text-muted-foreground mt-2">Share your content with the world</p>
      </div>

      <div className="rounded-xl border bg-card/60 backdrop-blur-xl p-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Video title" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your video..." 
                      className="resize-none bg-background/50 min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="action">Action</SelectItem>
                         <SelectItem value="drama">Drama</SelectItem>
                         <SelectItem value="comedy">Comedy</SelectItem>
                         <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                         <SelectItem value="animation">Animation</SelectItem>
                         <SelectItem value="documentary">Documentary</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Video Source Selection */}
            <div className="space-y-3">
                <FormLabel>Video Source</FormLabel>
                <div className="flex p-1 bg-muted/50 rounded-lg w-fit">
                    <button
                        type="button"
                        onClick={() => setUploadMode("url")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${uploadMode === 'url' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Video URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadMode("file")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${uploadMode === 'file' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        File Upload
                    </button>
                </div>
            </div>

            {uploadMode === 'url' ? (
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video or Website URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <UploadCloud className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="https://..." {...field} className="pl-9 bg-background/50" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Direct link to a video file (MP4) or a full Website URL to embed directly.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            ) : (
                <FormItem>
                    <FormLabel>Upload Video File</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="video/*" 
                            className="bg-background/50 file:text-primary file:font-medium hover:file:bg-primary/10"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setVideoFile(file);
                                if (file) {
                                    // Auto-generate thumbnail from file
                                    const url = URL.createObjectURL(file);
                                    form.setValue("video_url", url); // Temporarily set URL for generator usage or just internal logic
                                }
                            }}
                        />
                    </FormControl>
                    <FormDescription>
                        Select a video file from your computer (MP4, WebM).
                    </FormDescription>
                </FormItem>
            )}
            
             <FormField
              control={form.control}
              name="thumbnail_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL (Optional)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <div className="relative flex-1">
                          <UploadCloud className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="https://..." {...field} className="pl-9 bg-background/50" />
                        </div>
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={() => {
                           let videoUrl = form.getValues("video_url");
                           
                           // If file mode and we have a file, creates a blob URL
                           if (uploadMode === 'file' && videoFile) {
                               videoUrl = URL.createObjectURL(videoFile);
                           }

                           if (!videoUrl) return alert("Please enter a video URL or select a file first");

                           // Basic check for video file extension (skip for Blob URLs)
                           if (!videoUrl.startsWith('blob:') && !/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(videoUrl)) {
                               const proceed = confirm("This URL doesn't look like a direct video file. Auto-generation might fail. Try anyway?");
                               if (!proceed) return;
                           }
                           
                           const video = document.createElement("video");
                           video.crossOrigin = "anonymous";
                           video.src = videoUrl;
                           video.currentTime = 5; 
                           video.muted = true;
                           video.preload = "auto";

                           const toastId = toast.loading("Generating thumbnail...");
                           
                           const timeout = setTimeout(() => {
                               video.remove();
                               toast.dismiss(toastId);
                               toast.error("Timeout: Video took too long to load.");
                           }, 8000);

                           video.onloadeddata = () => {};

                           video.onseeked = () => {
                              clearTimeout(timeout);
                              try {
                                const canvas = document.createElement("canvas");
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                const ctx = canvas.getContext("2d");
                                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                                
                                if (dataUrl.length < 1000) throw new Error("Empty image");

                                form.setValue("thumbnail_url", dataUrl);
                                toast.dismiss(toastId);
                                toast.success("Thumbnail generated!");
                              } catch (e) {
                                console.error(e);
                                toast.dismiss(toastId);
                                toast.error("Failed to capture frame.");
                              } finally {
                                video.remove();
                              }
                           };
                           
                           video.onerror = (e) => {
                             clearTimeout(timeout);
                             video.remove();
                             toast.dismiss(toastId);
                             console.error(e);
                             alert("Error loading video.");
                           };
                        }}
                      >
                        Auto-Generate
                      </Button>
                    </div>
                  <FormMessage />
                  {field.value && field.value.startsWith("data:") && (
                    <div className="mt-2 relative w-32 aspect-video rounded-md overflow-hidden border">
                      <img src={field.value} alt="Preview" className="object-cover w-full h-full"/>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-11 text-lg shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Video"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
