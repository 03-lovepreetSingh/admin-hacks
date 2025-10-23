"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { mockHackathons, mockProjects } from "@/lib/mock-data"
import { ArrowLeft, ExternalLink, Github, Send, Award, User, Calendar } from "lucide-react"
import { format } from "date-fns"

export default function ProjectJudgingPage() {
  const router = useRouter()
  const params = useParams()
  const hackathonId = params.id as string
  const projectId = params.projectId as string
  const { toast } = useToast()

  const hackathon = mockHackathons.find((h) => h.id === hackathonId)
  const project = mockProjects.find((p) => p.id === projectId)

  const [scores, setScores] = useState({
    innovation: 8,
    design: 7,
    functionality: 8,
    presentation: 7,
  })
  const [comments, setComments] = useState("")

  if (!hackathon || !project) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    )
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

  const handleSubmit = () => {
    toast({
      title: "Review submitted",
      description: `Your review for ${project.teamName} has been submitted successfully.`,
    })
    // In a real app, this would save to the backend
    setTimeout(() => {
      router.push(`/admin/hackathons/${hackathonId}/projects`)
    }, 1500)
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "from-green-500 to-emerald-500"
    if (score >= 7) return "from-blue-500 to-cyan-500"
    if (score >= 5) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/hackathons/${hackathonId}/projects`)}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {project.teamName}
            </h1>
            {project.averageScore && project.averageScore > 0 ? (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Already Judged
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                Pending Review
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{hackathon.name}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1 text-sm">{project.description}</p>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">{format(new Date(project.submittedAt), "MMM dd, yyyy 'at' HH:mm")}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Project Links</Label>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View GitHub Repository
                    </a>
                  </Button>
                  {project.demoLink && (
                    <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Reviews */}
          {project.scores && project.scores.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Previous Reviews</CardTitle>
                <CardDescription>{project.scores.length} judge(s) have reviewed this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.scores.map((score, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <p className="font-medium">{score.judgeName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Innovation</p>
                        <p className="font-medium">{score.innovation}/10</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Design</p>
                        <p className="font-medium">{score.design}/10</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Functionality</p>
                        <p className="font-medium">{score.functionality}/10</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Presentation</p>
                        <p className="font-medium">{score.presentation}/10</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Comments</p>
                      <p className="text-sm">{score.comments}</p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                      <span className="text-sm font-medium">Total Score</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {score.totalScore}/40
                      </span>
                    </div>
                    {index < project.scores.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Judging Interface */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Submit Your Review</CardTitle>
              <CardDescription>Evaluate the project based on the criteria below</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Scoring */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Evaluation Criteria</h3>
                </div>

                {Object.entries(scores).map(([key, value]) => (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize text-base">{key}</Label>
                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {value}/10
                      </span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => setScores({ ...scores, [key]: newValue })}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className={`p-6 rounded-lg bg-gradient-to-r ${getScoreColor(totalScore / 4)} bg-opacity-10`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Score</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {totalScore}/40
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Average</p>
                      <p className="text-2xl font-bold">{(totalScore / 4).toFixed(1)}/10</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                <Label htmlFor="comments" className="text-base">
                  Feedback & Comments
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Provide detailed feedback for the team. What did they do well? What could be improved?"
                  rows={8}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Your feedback will help the team understand their strengths and areas for improvement.
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-base"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Review
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
