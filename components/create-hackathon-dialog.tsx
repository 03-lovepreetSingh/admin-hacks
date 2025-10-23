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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

export function CreateHackathonDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Hackathon created",
      description: "Your hackathon has been created successfully.",
    })

    setIsLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Create Hackathon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create New Hackathon
          </DialogTitle>
          <DialogDescription>Fill in the details to create a new hackathon event.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hackathon Name</Label>
            <Input id="name" placeholder="e.g., ChainSpark Hackathon" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your hackathon..."
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="datetime-local" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Rules</Label>
            <Textarea id="rules" placeholder="Enter hackathon rules..." rows={3} required className="resize-none" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size Limit</Label>
            <Input id="teamSize" type="number" min="1" max="10" defaultValue="5" required />
          </div>

          <div className="space-y-2">
            <Label>Prize Information</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Prize title" />
              <Input type="number" placeholder="Amount" />
              <Input type="number" placeholder="Winners" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Banner URL (Optional)</Label>
            <Input id="banner" type="url" placeholder="https://example.com/banner.png" />
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
              {isLoading ? "Creating..." : "Create Hackathon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
