"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockProjects, mockHackathons } from "@/lib/mock-data"
import { ExternalLink, Github, Users, Calendar } from "lucide-react"
import { format } from "date-fns"

export default function JudgeProjectsPage() {
  const router = useRouter()
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null)

  // Get unique hackathons from projects
  const hackathonsWithProjects = mockHackathons.filter((h) => mockProjects.some((p) => p.hackathonId === h.id))

  const filteredProjects = selectedHackathon
    ? mockProjects.filter((p) => p.hackathonId === selectedHackathon)
    : mockProjects

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Projects to Judge
        </h1>
        <p className="text-muted-foreground mt-2">Review and score submitted projects across all hackathons</p>
      </motion.div>

      {/* Hackathon Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Hackathon</CardTitle>
          <CardDescription>Select a hackathon to view its projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedHackathon === null ? "default" : "outline"}
              onClick={() => setSelectedHackathon(null)}
              className={selectedHackathon === null ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              All Projects
            </Button>
            {hackathonsWithProjects.map((hackathon) => (
              <Button
                key={hackathon.id}
                variant={selectedHackathon === hackathon.id ? "default" : "outline"}
                onClick={() => setSelectedHackathon(hackathon.id)}
                className={selectedHackathon === hackathon.id ? "bg-gradient-to-r from-primary to-secondary" : ""}
              >
                {hackathon.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => {
          const hackathon = mockHackathons.find((h) => h.id === project.hackathonId)
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:border-primary/50 transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.teamName}
                    </CardTitle>
                    {project.averageScore && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {project.averageScore}/10
                      </Badge>
                    )}
                  </div>
                  {hackathon && (
                    <Badge variant="secondary" className="w-fit mb-2">
                      {hackathon.name}
                    </Badge>
                  )}
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{project.teamSize} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(project.submittedAt), "MMM dd, yyyy")}</span>
                    </div>
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
                    onClick={() => router.push(`/judge/hackathons/${project.hackathonId}/projects/${project.id}`)}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Judge Project
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No projects found for the selected hackathon.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
