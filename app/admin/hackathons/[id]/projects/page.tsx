"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockHackathons, mockProjects } from "@/lib/mock-data"
import { ArrowLeft, Search, ExternalLink, Github, Eye, Award, Calendar, Users } from "lucide-react"
import { format } from "date-fns"

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

export default function HackathonProjectsPage() {
  const router = useRouter()
  const params = useParams()
  const hackathonId = params.id as string

  const hackathon = mockHackathons.find((h) => h.id === hackathonId)
  const projects = mockProjects.filter((p) => p.hackathonId === hackathonId)

  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = projects.filter((project) =>
    project.teamName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Hackathon not found</p>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-500"
    if (score >= 7) return "text-blue-500"
    if (score >= 5) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => router.push("/admin/hackathons")} className="mb-4 hover:bg-primary/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hackathons
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {hackathon.name}
            </h1>
            <p className="text-muted-foreground mt-2">Review and manage submitted projects</p>
          </div>
          <Badge
            variant="outline"
            className={
              hackathon.status === "ongoing"
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30"
            }
          >
            {hackathon.status}
          </Badge>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <p className="text-3xl font-bold">{projects.length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Judged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-secondary" />
                <p className="text-3xl font-bold">{projects.filter((p) => p.scores && p.scores.length > 0).length}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <p className="text-3xl font-bold">
                  {projects.filter((p) => !p.scores || p.scores.length === 0).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-3xl font-bold">
                  {projects.length > 0
                    ? (projects.reduce((sum, p) => sum + (p.averageScore || 0), 0) / projects.length).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by team name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No projects found</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants} whileHover={{ scale: 1.01 }}>
              <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{project.teamName}</CardTitle>
                        {project.averageScore && project.averageScore > 0 ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            Judged
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </div>
                    {project.averageScore && project.averageScore > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className={`text-3xl font-bold ${getScoreColor(project.averageScore)}`}>
                          {project.averageScore.toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted {format(new Date(project.submittedAt), "MMM dd, yyyy")}</span>
                      </div>
                      {project.scores && project.scores.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.scores.length} judge(s) reviewed</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="hover:bg-primary/10 bg-transparent">
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      {project.demoLink && (
                        <Button variant="outline" size="sm" asChild className="hover:bg-secondary/10 bg-transparent">
                          <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => router.push(`/admin/hackathons/${hackathonId}/projects/${project.id}`)}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
