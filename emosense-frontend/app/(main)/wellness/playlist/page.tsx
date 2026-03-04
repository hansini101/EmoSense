"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Music, Plus, Play, Trash2, Heart } from "lucide-react"
import { toast } from "sonner"

type Song = { id: number; title: string; artist: string }

const moodPlaylists = [
  {
    mood: "Happy & Energetic",
    color: "bg-primary/10 border-primary/20",
    songs: [
      { id: 1, title: "Happy", artist: "Pharrell Williams" },
      { id: 2, title: "Walking on Sunshine", artist: "Katrina & The Waves" },
      { id: 3, title: "Good as Hell", artist: "Lizzo" },
    ],
  },
  {
    mood: "Calm & Peaceful",
    color: "bg-accent/20 border-accent/30",
    songs: [
      { id: 4, title: "Weightless", artist: "Marconi Union" },
      { id: 5, title: "Clair de Lune", artist: "Debussy" },
      { id: 6, title: "Holocene", artist: "Bon Iver" },
    ],
  },
  {
    mood: "Motivated & Focused",
    color: "bg-secondary/10 border-secondary/20",
    songs: [
      { id: 7, title: "Eye of the Tiger", artist: "Survivor" },
      { id: 8, title: "Lose Yourself", artist: "Eminem" },
      { id: 9, title: "Stronger", artist: "Kelly Clarkson" },
    ],
  },
]

export default function PlaylistPage() {
  const [customSongs, setCustomSongs] = useState<Song[]>([])
  const [songTitle, setSongTitle] = useState("")
  const [songArtist, setSongArtist] = useState("")

  const addSong = () => {
    if (!songTitle.trim()) return
    setCustomSongs([...customSongs, { id: Date.now(), title: songTitle, artist: songArtist || "Unknown" }])
    setSongTitle("")
    setSongArtist("")
    toast.success("Song added to your playlist!")
  }

  const removeSong = (id: number) => {
    setCustomSongs(customSongs.filter((s) => s.id !== id))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/wellness">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            Create a Playlist
          </h1>
          <p className="mt-1 text-muted-foreground">Curate music for every mood</p>
        </div>
      </div>

      {/* Custom Playlist Builder */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" /> Your Custom Playlist
          </CardTitle>
          <CardDescription>Add songs that make you feel good</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="songTitle">Song Title</Label>
              <Input id="songTitle" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="Enter song name" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="songArtist">Artist</Label>
              <Input id="songArtist" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} placeholder="Enter artist name" />
            </div>
            <div className="flex items-end">
              <Button onClick={addSong} disabled={!songTitle.trim()} className="gap-2">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
          {customSongs.length > 0 ? (
            <div className="flex flex-col gap-2">
              {customSongs.map((song, i) => (
                <div key={song.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{song.title}</p>
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeSong(song.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No songs added yet. Start building your wellness playlist above.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Mood Playlists */}
      <h2 className="mb-4 text-xl font-semibold text-foreground">Suggested Mood Playlists</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {moodPlaylists.map((playlist) => (
          <Card key={playlist.mood} className={`border ${playlist.color}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-primary" /> {playlist.mood}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {playlist.songs.map((song, i) => (
                  <div key={song.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                      <div>
                        <p className="font-medium text-foreground">{song.title}</p>
                        <p className="text-xs text-muted-foreground">{song.artist}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
