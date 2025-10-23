"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockHackathons, mockProjects } from "@/lib/mock-data"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Users, Trophy, FolderKanban, Calendar, ArrowLeft, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

export default function HackathonAnalyticsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const hackathon = mockHackathons.find((h) => h.id === params.id)

  if (!hackathon) {
    notFound()
  }

  const hackathonProjects = mockProjects.filter((p) => p.hackathonId === hackathon.id)

  // Generate mock data for this specific hackathon
  const registrationData = [
    { day: "Day 1", registrations: 12 },
    { day: "Day 2", registrations: 28 },
    { day: "Day 3", registrations: 45 },
    { day: "Day 4", registrations: 38 },
    { day: "Day 5", registrations: 52 },
    { day: "Day 6", registrations: 59 },
  ]

  const submissionData = [
    { day: "Day 1", submissions: 0 },
    { day: "Day 2", submissions: 2 },
    { day: "Day 3", submissions: 8 },
    { day: "Day 4", submissions: 15 },
    { day: "Day 5", submissions: 12 },
    { day: "Day 6", submissions: 8 },
  ]

  const teamSizeData = [
    { size: "1 member", count: 8 },
    { size: "2 members", count: 12 },
    { size: "3 members", count: 15 },
    { size: "4 members", count: 7 },
    { size: "5 members", count: 3 },
  ]

  const participantStatusData = [
    { name: "Registered", value: hackathon.totalParticipants, color: "hsl(var(--primary))" },
    { name: "Submitted", value: hackathon.totalProjects, color: "hsl(var(--secondary))" },
    {
      name: "Not Submitted",
      value: hackathon.totalParticipants - hackathon.totalProjects,
      color: "hsl(var(--muted-foreground))",
    },
  ]

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

  const submissionRate = ((hackathon.totalProjects / hackathon.totalParticipants) * 100).toFixed(1)
  const avgTeamSize = (hackathon.totalParticipants / hackathon.totalProjects).toFixed(1)

  const stats = [
    {
      title: "Total Registrations",
      value: hackathon.totalParticipants.toString(),
      change: "+12 today",
      icon: Users,
      color: "from-primary to-secondary",
    },
    {
      title: "Project Submissions",
      value: hackathon.totalProjects.toString(),
      change: `${submissionRate}% submission rate`,
      icon: FolderKanban,
      color: "from-secondary to-accent",
    },
    {
      title: "Total Prize Pool",
      value: `$${hackathon.prizes.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      change: `${hackathon.prizes.length} prize categories`,
      icon: Trophy,
      color: "from-accent to-primary",
    },
    {
      title: "Avg. Team Size",
      value: avgTeamSize,
      change: `Max ${hackathon.teamSizeLimit} members`,
      icon: UserCheck,
      color: "from-primary to-accent",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => router.push("/admin/analytics")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analytics
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {hackathon.name}
              </h1>
              <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
            </div>
            <p className="text-muted-foreground">{hackathon.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
                  {new Date(hackathon.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Registration Trend</CardTitle>
              <CardDescription>Daily registration count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  registrations: {
                    label: "Registrations",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationData}>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="registrations"
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

        {/* Submission Trend */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>Daily project submission count</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  submissions: {
                    label: "Submissions",
                    color: "hsl(var(--secondary))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={submissionData}>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="submissions" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Size Distribution */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Team Size Distribution</CardTitle>
              <CardDescription>Number of teams by size</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Teams",
                    color: "hsl(var(--accent))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamSizeData}>
                    <XAxis dataKey="size" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Participant Status */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle>Participant Status</CardTitle>
              <CardDescription>Registration vs submission breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  registered: {
                    label: "Registered",
                    color: "hsl(var(--primary))",
                  },
                  submitted: {
                    label: "Submitted",
                    color: "hsl(var(--secondary))",
                  },
                  notSubmitted: {
                    label: "Not Submitted",
                    color: "hsl(var(--muted-foreground))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participantStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {participantStatusData.map((entry, index) => (
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

      {/* Prize Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <CardTitle>Prize Distribution</CardTitle>
            <CardDescription>All prize categories for this hackathon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hackathon.prizes.map((prize, i) => (
                <div
                  key={prize.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{prize.title}</p>
                      <p className="text-sm text-muted-foreground">{prize.winners} winners</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      ${prize.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{prize.currency}</p>
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
