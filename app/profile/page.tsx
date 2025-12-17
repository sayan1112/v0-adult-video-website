import { getSession } from "@/lib/auth";
import { logoutAction, addTokensAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getUserVideos, getWatchHistory, User } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoCardSmall } from "@/components/video-card-small";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Crown, History, Upload, User as UserIcon } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const userId = session.user.id;
  const userVideos = await getUserVideos(userId);
  const watchHistory = await getWatchHistory(userId);
  
  // Create a mock user object with latest DB data if needed, or rely on session
  // But session data is static JWT. For live tokens, we should fetch user fresh.
  // We don't have a direct getUserById exported for client, but we added it to db.ts
  const { getUserById } = await import("@/lib/db");
  const freshUser = await getUserById(userId) || session.user as User;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Dashboard</h1>
            <p className="text-muted-foreground">Manage your account and content</p>
          </div>
          <div className="flex items-center gap-4">
             <form action={logoutAction}>
                <Button variant="ghost">Sign Out</Button>
             </form>
          </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
          {/* User Info Card */}
          <Card className="md:col-span-1 bg-card/40 backdrop-blur-xl border-white/5">
              <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center mb-2">
                      <UserIcon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle>{freshUser.name}</CardTitle>
                  <CardDescription className="capitalize">{freshUser.role}</CardDescription>
                  <div className="mt-2">
                     <Badge variant={freshUser.subscription === 'free' ? "secondary" : "default"}>
                        {freshUser.subscription?.toUpperCase() || 'FREE'} Plan
                     </Badge>
                  </div>
              </CardHeader>
          </Card>

          {/* Stats Cards */}
           <Card className="bg-card/40 backdrop-blur-xl border-white/5">
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tokens Balance</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                      <Coins className="text-yellow-500" />
                      {freshUser.tokens || 0}
                  </div>
                  <form action={async () => {
                      'use server'
                      await addTokensAction(100);
                  }}>
                    <Button variant="outline" size="sm" className="w-full mt-4">Buy Tokens</Button>
                  </form>
              </CardContent>
          </Card>

           <Card className="bg-card/40 backdrop-blur-xl border-white/5">
              <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Videos Uploaded</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                      <Upload className="text-blue-500" />
                      {userVideos.length}
                  </div>
                  <Button variant="ghost" size="sm" asChild className="w-full mt-4">
                      <a href="/upload">Upload New</a>
                  </Button>
              </CardContent>
          </Card>

           <Card className="bg-card/40 backdrop-blur-xl border-white/5">
              <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Watch History</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                      <History className="text-purple-500" />
                      {watchHistory.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Last 20 videos</p>
              </CardContent>
          </Card>
      </div>
      
      {/* Main Tabs */}
      <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-muted/50 p-1 mb-6">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> My Videos
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" /> Watch History
              </TabsTrigger>
               <TabsTrigger value="subscription" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" /> Subscription
              </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
               <div className="grid gap-4">
                   {userVideos.length > 0 ? (
                       userVideos.map(video => (
                           <Card key={video.id} className="bg-card/40 border-white/5 overflow-hidden p-4">
                               <VideoCardSmall video={video} />
                           </Card>
                       ))
                   ) : (
                       <div className="text-center py-12 text-muted-foreground">
                           <p>You haven't uploaded any videos yet.</p>
                           <Button className="mt-4" asChild><a href="/upload">Upload a Video</a></Button>
                       </div>
                   )}
               </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
               <div className="grid gap-4">
                   {watchHistory.length > 0 ? (
                       watchHistory.map(video => (
                           <Card key={video.id} className="bg-card/40 border-white/5 overflow-hidden p-4">
                               <VideoCardSmall video={video} />
                           </Card>
                       ))
                   ) : (
                       <div className="text-center py-12 text-muted-foreground">
                           <p>No watch history found.</p>
                           <Button variant="link" asChild><a href="/">Start Watching</a></Button>
                       </div>
                   )}
               </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
               <div className="grid md:grid-cols-3 gap-6">
                   {/* Free Plan */}
                   <Card className={`relative bg-card/40 border-white/5 ${freshUser.subscription === 'free' ? 'border-primary ring-1 ring-primary' : ''}`}>
                       <CardHeader>
                           <CardTitle>Free</CardTitle>
                           <CardDescription>Basic access</CardDescription>
                       </CardHeader>
                       <CardContent>
                           <p className="text-3xl font-bold">SD</p>
                           <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                               <li>• SD Quality Streaming</li>
                               <li>• Standard Ads</li>
                               <li>• Daily Token Bonus: 0</li>
                           </ul>
                           <Button className="w-full mt-6" variant="outline" disabled={freshUser.subscription === 'free'}>
                               {freshUser.subscription === 'free' ? 'Current Plan' : 'Downgrade'}
                           </Button>
                       </CardContent>
                   </Card>

                    {/* Premium Plan */}
                   <Card className={`relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-white/10 ${freshUser.subscription === 'premium' ? 'border-primary ring-1 ring-primary' : ''}`}>
                       {freshUser.subscription === 'premium' && <div className="absolute top-2 right-2 text-xs bg-primary px-2 py-1 rounded">Active</div>}
                       <CardHeader>
                           <CardTitle className="flex items-center gap-2"><Crown className="w-4 h-4 text-yellow-400" /> Premium</CardTitle>
                           <CardDescription>Better experience</CardDescription>
                       </CardHeader>
                       <CardContent>
                           <p className="text-3xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                           <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                               <li className="text-foreground">• HD Quality Streaming</li>
                               <li className="text-foreground">• No Ads</li>
                               <li className="text-foreground">• 100 Monthly Tokens</li>
                           </ul>
                           <Button className="w-full mt-6" disabled={freshUser.subscription === 'premium'}>
                                {freshUser.subscription === 'premium' ? 'Current Plan' : 'Upgrade'}
                           </Button>
                       </CardContent>
                   </Card>

                   {/* Pro Plan */}
                   <Card className={`relative bg-gradient-to-br from-yellow-900/10 to-orange-900/10 border-white/10 ${freshUser.subscription === 'pro' ? 'border-primary ring-1 ring-primary' : ''}`}>
                       <CardHeader>
                           <CardTitle className="flex items-center gap-2"><Crown className="w-4 h-4 text-orange-400" /> Pro</CardTitle>
                           <CardDescription>Ultimate access</CardDescription>
                       </CardHeader>
                       <CardContent>
                           <p className="text-3xl font-bold">$19.99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                           <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                               <li className="text-foreground">• 4K HDR Streaming</li>
                               <li className="text-foreground">• No Ads</li>
                               <li className="text-foreground">• 500 Monthly Tokens</li>
                               <li className="text-foreground">• Exclusive Content</li>
                           </ul>
                           <Button className="w-full mt-6" disabled={freshUser.subscription === 'pro'}>
                                {freshUser.subscription === 'pro' ? 'Current Plan' : 'Upgrade'}
                           </Button>
                       </CardContent>
                   </Card>
               </div>
          </TabsContent>
      </Tabs>
    </div>
  )
}
