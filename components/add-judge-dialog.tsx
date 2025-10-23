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
import { useToast } from "@/hooks/use-toast"
import { UserPlus } from "lucide-react"

export function AddJudgeDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Judge added",
      description: "The judge has been added successfully.",
    })

    setIsLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Judge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add New Judge
          </DialogTitle>
          <DialogDescription>Add a new judge to your hackathon platform.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="judgeName">Full Name</Label>
            <Input id="judgeName" placeholder="e.g., Sarah Chen" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="judgeEmail">Email</Label>
            <Input id="judgeEmail" type="email" placeholder="sarah.chen@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise Area</Label>
            <Input id="expertise" placeholder="e.g., Blockchain & Smart Contracts" required />
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
              {isLoading ? "Adding..." : "Add Judge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
