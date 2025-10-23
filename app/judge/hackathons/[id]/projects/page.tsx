"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockHackathons, mockProjects } from "@/lib/mock-data"
import { Search, ExternalLink, Github, Users, Calendar, ArrowLeft } from "lucide-react"
import { format } from "date-fns"

export default function JudgeHackathonProjectsPage() {
  const params = useParams()
  const router = useRouter()
  const hackathonId = params.id as string
  const [searchQuery, setSearchQuery] = useState("")

  const hackathon = mockHackathons.find((h) => h.id === hackathonId)
  const projects = mockProjects.filter((p) => p.hackathonId === hackathonId)

  const filteredProjects = projects.filter(
    (project) =>
      project.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPrizePool = hackathon?.prizes.reduce((sum, prize) => sum + prize.amount, 0) || 0

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Hackathon Not Found</CardTitle>
            <CardDescription>The hackathon you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/judge/hackathons")} className="w-full">
              Back to Hackathons
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => router.push("/judge/hackathons")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hackathons
        </Button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {hackathon.name}
        </h1>
        <p className="text-muted-foreground mt-2">Review and judge submitted projects</p>
      </motion.div>

      {/* Hackathon Info Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-semibold">{format(new Date(hackathon.startDate), "MMM dd, yyyy")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="font-semibold">{hackathon.totalParticipants}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="font-semibold">{projects.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">$</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prize Pool</p>
                <p className="font-semibold">${totalPrizePool.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full hover:border-primary/50 transition-all group">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.teamName}
                  </CardTitle>
                  {project.averageScore && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {project.averageScore}/10
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{project.teamSize || 1} members</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  {project.demoLink && (
                    <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>

                <Button
                  onClick={() => router.push(`/judge/hackathons/${hackathonId}/projects/${project.id}`)}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Judge Project
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No projects found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
