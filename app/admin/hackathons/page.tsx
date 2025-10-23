"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockHackathons } from "@/lib/mock-data"
import { Calendar, Users, FolderKanban, Edit, Trash2, Eye, Plus } from "lucide-react"
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

export default function HackathonsPage() {
  const [hackathons] = useState(mockHackathons)
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-primary/20 text-primary border-primary/30"
      case "upcoming":
        return "bg-secondary/20 text-secondary border-secondary/30"
      case "completed":
        return "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30"
      default:
        return "bg-muted"
    }
  }

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
            Hackathons
          </h1>
          <p className="text-muted-foreground mt-2">Manage and organize your hackathon events</p>
        </div>
        <Button
          onClick={() => router.push("/admin/hackathons/create")}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Hackathon
        </Button>
      </motion.div>

      {/* Hackathons Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6">
        {hackathons.map((hackathon) => (
          <motion.div key={hackathon.id} variants={itemVariants} whileHover={{ scale: 1.01 }}>
            <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-all">
              <div className="flex flex-col md:flex-row">
                {/* Banner */}
                {hackathon.banner && (
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img
                      src={hackathon.banner || "/placeholder.svg"}
                      alt={hackathon.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-2xl">{hackathon.name}</CardTitle>
                          <Badge variant="outline" className={getStatusColor(hackathon.status)}>
                            {hackathon.status}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 text-primary">$</div>
                        <div>
                          <p className="text-muted-foreground">Total Prize</p>
                          <p className="font-medium">
                            ${hackathon.prizes.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/hackathons/${hackathon.id}/projects`)}
                        className="hover:bg-primary/10 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Projects
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/hackathons/${hackathon.id}/edit`)}
                        className="hover:bg-secondary/10 bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10 text-destructive bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
