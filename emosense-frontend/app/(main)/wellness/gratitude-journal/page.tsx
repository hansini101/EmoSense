"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, BookOpen, Plus, Calendar, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Entry = {
  id: number
  text: string
  date: string
  mood: string
}

const moods = [
  { label: "Grateful", value: "grateful", color: "bg-primary/10 text-foreground border-primary/20" },
  { label: "Peaceful", value: "peaceful", color: "bg-accent/20 text-foreground border-accent/30" },
  { label: "Hopeful", value: "hopeful", color: "bg-secondary/10 text-foreground border-secondary/20" },
  { label: "Loved", value: "loved", color: "bg-secondary/20 text-foreground border-secondary/30" },
  { label: "Inspired", value: "inspired", color: "bg-primary/20 text-foreground border-primary/30" },
]

const sampleEntries: Entry[] = [
  { id: 1, text: "Grateful for my supportive friends who always check on me during exams.", date: "Feb 18, 2026", mood: "grateful" },
  { id: 2, text: "The sunrise this morning was beautiful. Nature reminds me to slow down.", date: "Feb 17, 2026", mood: "peaceful" },
  { id: 3, text: "Got positive feedback on my research project. Hard work is paying off!", date: "Feb 16, 2026", mood: "inspired" },
]

export default function GratitudeJournalPage() {
  const [entries, setEntries] = useState<Entry[]>(sampleEntries)
  const [newEntry, setNewEntry] = useState("")
  const [selectedMood, setSelectedMood] = useState("grateful")

  const handleAdd = () => {
    if (!newEntry.trim()) return
    const entry: Entry = {
      id: Date.now(),
      text: newEntry,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      mood: selectedMood,
    }
    setEntries([entry, ...entries])
    setNewEntry("")
    toast.success("Gratitude entry added!")
  }

  const handleDelete = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id))
    toast("Entry removed")
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
            Gratitude Journal
          </h1>
          <p className="mt-1 text-muted-foreground">Reflect on the positive things in your life</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> New Entry
          </CardTitle>
          <CardDescription>{"What are you grateful for today?"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>How are you feeling?</Label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedMood === mood.value
                        ? mood.color + " ring-2 ring-primary/30"
                        : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="entry">Your Gratitude</Label>
              <Textarea
                id="entry"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Today I am grateful for..."
                rows={3}
              />
            </div>
            <Button onClick={handleAdd} disabled={!newEntry.trim()} className="gap-2">
              <Plus className="h-4 w-4" /> Add Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-semibold text-foreground">Journal Entries</h2>
      <div className="flex flex-col gap-4">
        {entries.map((entry) => {
          const moodData = moods.find((m) => m.value === entry.mood)
          return (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {entry.date}
                      </div>
                      {moodData && (
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${moodData.color}`}>
                          {moodData.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">{entry.text}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
