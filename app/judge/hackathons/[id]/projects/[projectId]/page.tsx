"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { mockProjects, mockHackathons } from "@/lib/mock-data"
import { ExternalLink, Github, Send, ArrowLeft, Users, Calendar, Award } from "lucide-react"
import { format } from "date-fns"

export default function JudgeProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const hackathonId = params.id as string
  const projectId = params.projectId as string

  const project = mockProjects.find((p) => p.id === projectId)
  const hackathon = mockHackathons.find((h) => h.id === hackathonId)

  const [scores, setScores] = useState({
    innovation: 7,
    design: 7,
    functionality: 7,
    presentation: 7,
  })
  const [feedback, setFeedback] = useState("")

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const averageScore = (totalScore / 4).toFixed(1)

  const handleSubmit = () => {
    toast({
      title: "Review Submitted",
      description: `Your review for ${project?.teamName} has been submitted successfully.`,
    })
    setTimeout(() => {
      router.push(`/judge/hackathons/${hackathonId}/projects`)
    }, 1500)
  }

  if (!project || !hackathon) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>The project you're looking for doesn't exist.</CardDescription>
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => router.push(`/judge/hackathons/${hackathonId}/projects`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {project.teamName}
            </h1>
            <p className="text-muted-foreground mt-2">{hackathon.name}</p>
          </div>
          {project.averageScore && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-lg px-4 py-2">
              Current: {project.averageScore}/10
            </Badge>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-semibold">{project.teamSize} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-semibold">{format(new Date(project.submittedAt), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    View GitHub
                  </a>
                </Button>
                {project.demoLink && (
                  <Button variant="outline" asChild className="flex-1 bg-transparent">
                    <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Previous Reviews */}
          {project.reviews && project.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Reviews</CardTitle>
                <CardDescription>Feedback from other judges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.reviews.map((review, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{review.judgeName}</p>
                      <Badge variant="outline">{review.score}/10</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.feedback}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(review.date), "MMM dd, yyyy")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Judging Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Judge Project</CardTitle>
              <CardDescription>Provide your scores and feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scoring Criteria */}
              <div className="space-y-4">
                {Object.entries(scores).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize text-sm font-medium">{key}</Label>
                      <span className="text-sm font-bold text-primary">{value}/10</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => setScores({ ...scores, [key]: newValue })}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total Score Display */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total Score</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {totalScore}/40
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average</span>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-lg font-bold text-primary">{averageScore}/10</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Detailed Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide constructive feedback for the team..."
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                disabled={!feedback.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
