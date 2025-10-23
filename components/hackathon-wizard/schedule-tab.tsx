"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronRight, Upload } from "lucide-react"

interface TimeSlot {
  id: string
  date: string
  expanded: boolean
  name: string
  description: string
  includeSpeaker: boolean
  speaker: {
    picture: string
    xName: string
    xLink: string
    realName: string
    position: string
  }
}

interface ScheduleTabProps {
  formData: any
  setFormData: (data: any) => void
}

export function ScheduleTab({ formData, setFormData }: ScheduleTabProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: "June 21, 2025 16:00",
      expanded: true,
      name: "",
      description: "",
      includeSpeaker: false,
      speaker: {
        picture: "",
        xName: "",
        xLink: "",
        realName: "",
        position: "",
      },
    },
  ])

  const toggleSlot = (id: string) => {
    setTimeSlots(timeSlots.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s)))
  }

  const toggleSpeaker = (id: string) => {
    setTimeSlots(timeSlots.map((s) => (s.id === id ? { ...s, includeSpeaker: !s.includeSpeaker } : s)))
  }

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      {
        id: Date.now().toString(),
        date: "Select date and time",
        expanded: true,
        name: "",
        description: "",
        includeSpeaker: false,
        speaker: {
          picture: "",
          xName: "",
          xLink: "",
          realName: "",
          position: "",
        },
      },
    ])
  }

  return (
    <div className="space-y-6">
      {/* Date Range Display */}
      <div className="text-lg font-medium">Jun 17, 2025 19:00 - Jul 19, 2025 19:00</div>

      {/* Time Slots */}
      {timeSlots.map((slot) => (
        <div key={slot.id} className="border border-border rounded-lg overflow-hidden bg-card">
          {/* Slot Header */}
          <button
            onClick={() => toggleSlot(slot.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {slot.expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              <span className="text-lg">{slot.date}</span>
            </div>
            {!slot.expanded && (
              <Button variant="link" className="text-primary p-0 h-auto">
                details
              </Button>
            )}
          </button>

          {/* Slot Content */}
          <AnimatePresence>
            {slot.expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-6">
                  {/* Hackathon Name */}
                  <div className="space-y-2">
                    <Label>Hackathon Name</Label>
                    <Input placeholder="Enter hackathon name" className="bg-muted/50" />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Textarea
                      placeholder="Short description that goes under key visual"
                      rows={6}
                      className="bg-muted/50 resize-none"
                    />
                  </div>

                  {/* Include Speaker */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`speaker-${slot.id}`}
                      checked={slot.includeSpeaker}
                      onCheckedChange={() => toggleSpeaker(slot.id)}
                    />
                    <label
                      htmlFor={`speaker-${slot.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include Speaker
                    </label>
                  </div>

                  {/* Speaker Details */}
                  {slot.includeSpeaker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-border"
                    >
                      {/* Speaker Picture */}
                      <div className="space-y-2">
                        <Label>Speaker Picture</Label>
                        <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                          <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                          <p className="text-xs text-muted-foreground text-center px-2">
                            Drag/Drop project logo here or
                          </p>
                          <Button variant="link" className="text-primary p-0 h-auto text-xs">
                            Click to Browse
                          </Button>
                        </div>
                      </div>

                      {/* Speaker Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Speaker x.com name</Label>
                          <Input placeholder="Enter speaker x.com name" className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Speaker x.com link</Label>
                          <Input placeholder="Enter speaker x.com link" className="bg-muted/50" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Speaker real name</Label>
                          <Input placeholder="Enter speaker real name" className="bg-muted/50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Speaker work place & position</Label>
                          <Input placeholder="Enter speaker details" className="bg-muted/50" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <Button variant="link" onClick={addTimeSlot} className="text-primary p-0 h-auto">
        + add another time slot
      </Button>
    </div>
  )
}
