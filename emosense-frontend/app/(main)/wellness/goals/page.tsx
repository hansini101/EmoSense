"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, Target, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"

type Goal = {
  id: number
  title: string
  category: string
  target: number
  current: number
  completed: boolean
}

const sampleGoals: Goal[] = [
  { id: 1, title: "Complete 7 emotion check-ins", category: "Tracking", target: 7, current: 5, completed: false },
  { id: 2, title: "Practice breathing exercises 5 times", category: "Mindfulness", target: 5, current: 3, completed: false },
  { id: 3, title: "Write 5 gratitude entries", category: "Journaling", target: 5, current: 5, completed: true },
  { id: 4, title: "30 minutes of outdoor activity", category: "Physical", target: 30, current: 20, completed: false },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(sampleGoals)
  const [newGoal, setNewGoal] = useState("")
  const [category, setCategory] = useState("Mindfulness")
  const [target, setTarget] = useState("5")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)

  const addGoal = () => {
    if (!newGoal.trim()) return
    setGoals([
      ...goals,
      {
        id: Date.now(),
        title: newGoal,
        category,
        target: parseInt(target) || 5,
        current: 0,
        completed: false,
      },
    ])
    setNewGoal("")
    toast.success("New goal added!")
  }

  const toggleGoal = (id: number) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)))
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((g) => g.id !== id))
    toast("Goal removed")
  }

  const incrementGoal = (id: number) => {
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          const newCurrent = Math.min(g.current + 1, g.target)
          return { ...g, current: newCurrent, completed: newCurrent >= g.target }
        }
        return g
      })
    )
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
            Set Goals
          </h1>
          <p className="mt-1 text-muted-foreground">Define and track your weekly wellness goals</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarIcon className="h-4 w-4 text-primary" /> This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </div>

        {/* Goals */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Add New Goal
              </CardTitle>
              <CardDescription>Set a wellness goal for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="goalTitle">Goal</Label>
                  <Input
                    id="goalTitle"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="e.g., Practice 5 breathing exercises"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="Physical">Physical</SelectItem>
                        <SelectItem value="Journaling">Journaling</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Tracking">Tracking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="target">Target</Label>
                    <Input id="target" type="number" value={target} onChange={(e) => setTarget(e.target.value)} min="1" />
                  </div>
                </div>
                <Button onClick={addGoal} disabled={!newGoal.trim()} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Goal
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="mb-4 text-lg font-semibold text-foreground">Your Goals</h2>
          <div className="flex flex-col gap-3">
            {goals.map((goal) => (
              <Card key={goal.id} className={goal.completed ? "border-accent/50 bg-accent/5" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleGoal(goal.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${goal.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {goal.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => incrementGoal(goal.id)} disabled={goal.completed}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={(goal.current / goal.target) * 100} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{goal.current}/{goal.target}</span>
                      </div>
                      <span className="mt-1 inline-block text-xs text-muted-foreground">{goal.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
