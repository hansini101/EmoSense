"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Smile, Heart, Send, Star } from "lucide-react"
import { toast } from "sonner"

type Post = {
  id: number
  author: string
  text: string
  likes: number
  liked: boolean
  time: string
}

const communityPosts: Post[] = [
  { id: 1, author: "Anon Student", text: "Passed my midterm exam today! Feeling so relieved and happy.", likes: 12, liked: false, time: "2 hours ago" },
  { id: 2, author: "Wellness Fan", text: "Had an amazing walk by the lake this morning. Nature heals.", likes: 8, liked: false, time: "5 hours ago" },
  { id: 3, author: "Grateful One", text: "My friend surprised me with coffee. Small acts of kindness matter so much.", likes: 15, liked: false, time: "Yesterday" },
  { id: 4, author: "Mindful Mind", text: "Finally finished my project ahead of deadline. Hard work pays off!", likes: 20, liked: false, time: "Yesterday" },
]

export default function ShareJoyPage() {
  const [posts, setPosts] = useState<Post[]>(communityPosts)
  const [newPost, setNewPost] = useState("")
  const [name, setName] = useState("")

  const handleShare = () => {
    if (!newPost.trim()) return
    setPosts([
      { id: Date.now(), author: name || "Anonymous", text: newPost, likes: 0, liked: false, time: "Just now" },
      ...posts,
    ])
    setNewPost("")
    setName("")
    toast.success("Your joy has been shared!")
  }

  const toggleLike = (id: number) => {
    setPosts(posts.map((p) =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/wellness">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Share Your Joy
          </h1>
          <p className="mt-1 text-muted-foreground">Celebrate your happy moments with the community</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-yellow-500" /> {"What's making you smile?"}
          </CardTitle>
          <CardDescription>Share a moment of joy, no matter how small</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Display Name (optional)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Anonymous" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="post">Your Joyful Moment</Label>
              <Textarea
                id="post"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Today I felt happy because..."
                rows={3}
              />
            </div>
            <Button onClick={handleShare} disabled={!newPost.trim()} className="gap-2">
              <Send className="h-4 w-4" /> Share Joy
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-semibold text-foreground">Community Joy Board</h2>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-500/10">
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{post.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(post.id)}
                  className={`shrink-0 gap-1 transition-colors ${post.liked ? "text-secondary" : "text-muted-foreground"}`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-secondary" : ""}`} /> {post.likes}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
