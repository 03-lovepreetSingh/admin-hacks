"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, Trophy, FolderKanban, Award, Calendar, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { mockHackathons } from "@/lib/mock-data"

const participantData = [
  { month: "Jan", participants: 120 },
  { month: "Feb", participants: 180 },
  { month: "Mar", participants: 240 },
  { month: "Apr", participants: 189 },
  { month: "May", participants: 280 },
  { month: "Jun", participants: 234 },
]

const projectData = [
  { hackathon: "ChainSpark", projects: 45 },
  { hackathon: "Web3 Jam", projects: 32 },
  { hackathon: "DeFi Sprint", projects: 38 },
  { hackathon: "Crypto Hack", projects: 28 },
]

const scoreDistribution = [
  { range: "0-2", count: 5 },
  { range: "3-4", count: 12 },
  { range: "5-6", count: 28 },
  { range: "7-8", count: 45 },
  { range: "9-10", count: 22 },
]

const statusData = [
  { name: "Ongoing", value: 3, color: "hsl(var(--primary))" },
  { name: "Upcoming", value: 5, color: "hsl(var(--secondary))" },
  { name: "Completed", value: 4, color: "hsl(var(--muted-foreground))" },
]

const stats = [
  {
    title: "Total Participants",
    value: "1,243",
    change: "+12.5%",
    icon: Users,
    color: "from-primary to-secondary",
  },
  {
    title: "Active Hackathons",
    value: "12",
    change: "+2 this month",
    icon: Trophy,
    color: "from-secondary to-accent",
  },
  {
    title: "Total Projects",
    value: "156",
    change: "+24 this week",
    icon: FolderKanban,
    color: "from-accent to-primary",
  },
  {
    title: "Avg. Project Score",
    value: "8.4",
    change: "+0.3 from last",
    icon: Award,
    color: "from-primary to-accent",
  },
]

export default function AnalyticsPage() {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-primary/10 text-primary border-primary/20"
      case "upcoming":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "completed":
        return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20"
      default:
        return "bg-muted"
    }
  }

  const totalStats = {
    totalHackathons: mockHackathons.length,
    totalParticipants: mockHackathons.reduce((sum, h) => sum + h.totalParticipants, 0),
    totalProjects: mockHackathons.reduce((sum, h) => sum + h.totalProjects, 0),
    activeHackathons: mockHackathons.filter((h) => h.status === "ongoing").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Hackathon Analytics
        </h1>
        <p className="text-muted-foreground mt-2">View detailed analytics for each hackathon</p>
      </motion.div>

      {/* Overall Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Hackathons",
            value: totalStats.totalHackathons,
            icon: Trophy,
            color: "from-primary to-secondary",
          },
          {
            title: "Active Hackathons",
            value: totalStats.activeHackathons,
            icon: Calendar,
            color: "from-secondary to-accent",
          },
          {
            title: "Total Participants",
            value: totalStats.totalParticipants,
            icon: Users,
            color: "from-accent to-primary",
          },
          {
            title: "Total Projects",
            value: totalStats.totalProjects,
            icon: FolderKanban,
            color: "from-primary to-accent",
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Hackathon List with Click Navigation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Hackathons</CardTitle>
            <CardDescription>Click on a hackathon to view detailed analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHackathons.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => router.push(`/admin/analytics/${hackathon.id}`)}
                  className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all cursor-pointer border border-transparent hover:border-primary/50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-xl overflow-hidden">
                      {hackathon.banner ? (
                        <img
                          src={hackathon.banner || "/placeholder.svg"}
                          alt={hackathon.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        hackathon.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-lg">{hackathon.name}</p>
                        <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{hackathon.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{hackathon.totalParticipants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FolderKanban className="w-3 h-3" />
                          <span>{hackathon.totalProjects} projects</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          <span>
                            ${hackathon.prizes.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} in prizes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participant Growth */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Participant Growth</CardTitle>
              <CardDescription>Monthly participant registration trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  participants: {
                    label: "Participants",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={participantData}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="participants"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects by Hackathon */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Projects by Hackathon</CardTitle>
              <CardDescription>Number of submitted projects per event</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  projects: {
                    label: "Projects",
                    color: "hsl(var(--secondary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData}>
                    <XAxis dataKey="hackathon" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="projects" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Distribution */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Project scores across all hackathons</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Projects",
                    color: "hsl(var(--accent))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hackathon Status */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle>Hackathon Status</CardTitle>
              <CardDescription>Distribution of hackathon states</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  ongoing: {
                    label: "Ongoing",
                    color: "hsl(var(--primary))",
                  },
                  upcoming: {
                    label: "Upcoming",
                    color: "hsl(var(--secondary))",
                  },
                  completed: {
                    label: "Completed",
                    color: "hsl(var(--muted-foreground))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Performers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Projects</CardTitle>
            <CardDescription>Highest scored projects across all hackathons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Init Club Pro", score: 9.2, hackathon: "ChainSpark", team: "Team Alpha" },
                { name: "Ward Protocol", score: 8.9, hackathon: "Web3 Jam", team: "Ward Builders" },
                { name: "Wiral Network", score: 8.7, hackathon: "ChainSpark", team: "Wiral Team" },
                { name: "DeFi Bridge", score: 8.5, hackathon: "DeFi Sprint", team: "Bridge Crew" },
              ].map((project, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.team} • {project.hackathon}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {project.score}
                    </p>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
