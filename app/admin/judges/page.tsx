"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddJudgeDialog } from "@/components/add-judge-dialog"
import { AssignJudgeDialog } from "@/components/assign-judge-dialog"
import { mockJudges, mockHackathons } from "@/lib/mock-data"
import { Mail, Award, Trash2 } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function JudgesPage() {
  const [judges] = useState(mockJudges)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Judges
          </h1>
          <p className="text-muted-foreground mt-2">Manage judges and their hackathon assignments</p>
        </div>
        <AddJudgeDialog />
      </motion.div>

      {/* Judges Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {judges.map((judge) => (
          <motion.div key={judge.id} variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="border-border/50 hover:border-primary/50 transition-all h-full">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarImage src={judge.avatar || "/placeholder.svg"} alt={judge.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-lg">
                      {judge.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{judge.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {judge.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Expertise:</span>
                  <span className="font-medium">{judge.expertise}</span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assigned Hackathons:</p>
                  <div className="flex flex-wrap gap-2">
                    {judge.assignedHackathons.length > 0 ? (
                      judge.assignedHackathons.map((hackathonId) => {
                        const hackathon = mockHackathons.find((h) => h.id === hackathonId)
                        return (
                          <Badge key={hackathonId} variant="outline" className="bg-primary/10 border-primary/30">
                            {hackathon?.name.split(" ")[0]}
                          </Badge>
                        )
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">No assignments</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <AssignJudgeDialog judgeId={judge.id} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-destructive/10 text-destructive bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
