"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { mockHackathons, mockJudges } from "@/lib/mock-data"
import { UserCog } from "lucide-react"

interface AssignJudgeDialogProps {
  judgeId: string
}

export function AssignJudgeDialog({ judgeId }: AssignJudgeDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedHackathons, setSelectedHackathons] = useState<string[]>([])
  const { toast } = useToast()

  const judge = mockJudges.find((j) => j.id === judgeId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Assignments updated",
      description: `${judge?.name} has been assigned to ${selectedHackathons.length} hackathon(s).`,
    })

    setIsLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-primary/10 bg-transparent">
          <UserCog className="w-4 h-4 mr-2" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Assign Hackathons
          </DialogTitle>
          <DialogDescription>Select hackathons to assign to {judge?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-3">
            <Label>Available Hackathons</Label>
            {mockHackathons.map((hackathon) => (
              <div key={hackathon.id} className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id={hackathon.id}
                  checked={selectedHackathons.includes(hackathon.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedHackathons([...selectedHackathons, hackathon.id])
                    } else {
                      setSelectedHackathons(selectedHackathons.filter((id) => id !== hackathon.id))
                    }
                  }}
                />
                <label htmlFor={hackathon.id} className="flex-1 cursor-pointer">
                  <p className="font-medium">{hackathon.name}</p>
                  <p className="text-sm text-muted-foreground">{hackathon.status}</p>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isLoading ? "Saving..." : "Save Assignments"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
