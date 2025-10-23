"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockHackathons } from "@/lib/mock-data"
import { Calendar, Users, FolderKanban, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function JudgeHackathonsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          My Hackathons
        </h1>
        <p className="text-muted-foreground mt-2">Hackathons you're assigned to judge</p>
      </motion.div>

      <div className="grid gap-6">
        {mockHackathons.slice(0, 3).map((hackathon, index) => (
          <motion.div
            key={hackathon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{hackathon.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          hackathon.status === "ongoing"
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-secondary/20 text-secondary border-secondary/30"
                        }
                      >
                        {hackathon.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{format(new Date(hackathon.startDate), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="text-muted-foreground">Participants</p>
                      <p className="font-medium">{hackathon.totalParticipants}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FolderKanban className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-muted-foreground">Projects</p>
                      <p className="font-medium">{hackathon.totalProjects}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/judge/hackathons/${hackathon.id}/projects`)}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Projects
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
