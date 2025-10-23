"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

interface PrizeCohort {
  id: string
  name: string
  expanded: boolean
  winners: string
  amount: string
  description: string
  criteria: Array<{ name: string; points: string; description: string }>
  judgingMode: string
  votingMode: string
  maxVote: string
}

interface PrizesTabProps {
  formData: any
  setFormData: (data: any) => void
}

export function PrizesTab({ formData, setFormData }: PrizesTabProps) {
  const [cohorts, setCohorts] = useState<PrizeCohort[]>([
    {
      id: "1",
      name: "",
      expanded: true,
      winners: "",
      amount: "",
      description: "",
      criteria: [{ name: "", points: "", description: "" }],
      judgingMode: "judges-only",
      votingMode: "project-scoring",
      maxVote: "",
    },
  ])

  const toggleCohort = (id: string) => {
    setCohorts(cohorts.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c)))
  }

  const addCohort = () => {
    setCohorts([
      ...cohorts,
      {
        id: Date.now().toString(),
        name: "",
        expanded: true,
        winners: "",
        amount: "",
        description: "",
        criteria: [{ name: "", points: "", description: "" }],
        judgingMode: "judges-only",
        votingMode: "project-scoring",
        maxVote: "",
      },
    ])
  }

  const addCriteria = (cohortId: string) => {
    setCohorts(
      cohorts.map((c) =>
        c.id === cohortId ? { ...c, criteria: [...c.criteria, { name: "", points: "", description: "" }] } : c,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {cohorts.map((cohort) => (
        <div key={cohort.id} className="border border-border rounded-lg overflow-hidden bg-card">
          {/* Cohort Header */}
          <button
            onClick={() => toggleCohort(cohort.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {cohort.expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              <span className="text-lg text-muted-foreground">{cohort.name || "Enter Prize Cohort Name"}</span>
            </div>
            {!cohort.expanded && (
              <Button variant="link" className="text-primary p-0 h-auto">
                details
              </Button>
            )}
          </button>

          {/* Cohort Content */}
          <AnimatePresence>
            {cohort.expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Number of winners</Label>
                      <Input placeholder="Number of winners" className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Prize amount for each winner</Label>
                      <Input placeholder="USD/tokens per winner" className="bg-muted/50" />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Prize cohort description</Label>
                    <Textarea placeholder="Prize cohort description" rows={6} className="bg-muted/50 resize-none" />
                  </div>

                  {/* Evaluation Criteria */}
                  <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/20">
                    {cohort.criteria.map((criterion, index) => (
                      <div key={index} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Evaluation criteria name</Label>
                            <Input placeholder="Enter evaluation criteria name" className="bg-background" />
                          </div>
                          <div className="space-y-2">
                            <Label>Number of points</Label>
                            <Input placeholder="Enter evaluation criteria name" className="bg-background" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Evaluation criteria description</Label>
                          <Textarea
                            placeholder="Enter evaluation criteria description"
                            rows={4}
                            className="bg-background resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="link" onClick={() => addCriteria(cohort.id)} className="text-primary p-0 h-auto">
                      + add evaluation criteria
                    </Button>
                  </div>

                  {/* Judging Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Judging mode</Label>
                      <Select defaultValue="judges-only">
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="judges-only">Judges Only</SelectItem>
                          <SelectItem value="community">Community Voting</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Voting Mode</Label>
                      <Select defaultValue="project-scoring">
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project-scoring">Project Scoring</SelectItem>
                          <SelectItem value="ranked-choice">Ranked Choice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Max vote per judge</Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Enter points" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 points</SelectItem>
                        <SelectItem value="50">50 points</SelectItem>
                        <SelectItem value="10">10 points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <Button variant="link" onClick={addCohort} className="text-primary p-0 h-auto">
        + add another prize cohort
      </Button>
    </div>
  )
}
