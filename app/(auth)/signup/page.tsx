"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { registerAction } from "@/app/actions" // We need to create this
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const result = await registerAction(values)
    setLoading(false)
    if (result.success) {
        alert("Account created! Please login.")
        router.push("/login")
    } else {
        alert(result.error)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Join our community</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField control={form.control} name="name" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Name</FormLabel>
                   <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                   <FormMessage />
                 </FormItem>
               )} />
               <FormField control={form.control} name="email" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Email</FormLabel>
                   <FormControl><Input placeholder="m@example.com" {...field} /></FormControl>
                   <FormMessage />
                 </FormItem>
               )} />
               <FormField control={form.control} name="password" render={({ field }) => (
                 <FormItem>
                   <FormLabel>Password</FormLabel>
                   <FormControl><Input type="password" {...field} /></FormControl>
                   <FormMessage />
                 </FormItem>
               )} />
               <Button type="submit" className="w-full" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign Up
               </Button>
             </form>
           </Form>
        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}
