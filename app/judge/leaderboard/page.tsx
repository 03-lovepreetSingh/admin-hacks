"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockHackathons, mockProjects } from "@/lib/mock-data"

const getLeaderboardByHackathon = (hackathonId: string) => {
  const hackathonProjects = mockProjects
    .filter((project) => project.hackathonId === hackathonId && project.averageScore > 0)
    .sort((a, b) => b.averageScore - a.averageScore)
    .map((project, index) => ({
      rank: index + 1,
      teamName: project.teamName,
      score: project.averageScore,
      projectId: project.id,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${project.teamName}`,
      technologies: project.technologies || [],
      judgeCount: project.scores?.length || 0,
    }))

  return hackathonProjects
}

export default function LeaderboardPage() {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>(mockHackathons[0]?.id || "1")
  const leaderboard = getLeaderboardByHackathon(selectedHackathonId)
  const selectedHackathon = mockHackathons.find((h) => h.id === selectedHackathonId)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">Top performing projects by hackathon</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Select Hackathon</CardTitle>
          <CardDescription>View rankings for a specific hackathon</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedHackathonId} onValueChange={setSelectedHackathonId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a hackathon" />
            </SelectTrigger>
            <SelectContent>
              {mockHackathons.map((hackathon) => (
                <SelectItem key={hackathon.id} value={hackathon.id}>
                  <div className="flex items-center gap-2">
                    <span>{hackathon.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {hackathon.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Rankings - {selectedHackathon?.name}</CardTitle>
          <CardDescription>Based on aggregated judge scores • {leaderboard.length} projects ranked</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">No scored projects yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Projects will appear here once judges submit their scores
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.projectId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    entry.rank <= 3
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <div className="w-12 flex items-center justify-center">{getRankIcon(entry.rank)}</div>

                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.teamName} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {entry.teamName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-semibold text-lg">{entry.teamName}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {entry.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {entry.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Judged by {entry.judgeCount} judges</p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {entry.score.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
