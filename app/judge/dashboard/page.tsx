"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, FolderKanban, CheckCircle, Clock } from "lucide-react"
import { mockHackathons } from "@/lib/mock-data"

const stats = [
  {
    title: "Assigned Hackathons",
    value: "3",
    icon: Trophy,
    color: "from-primary to-secondary",
  },
  {
    title: "Projects to Judge",
    value: "12",
    icon: FolderKanban,
    color: "from-secondary to-accent",
  },
  {
    title: "Completed Reviews",
    value: "8",
    icon: CheckCircle,
    color: "from-accent to-primary",
  },
  {
    title: "Pending Reviews",
    value: "4",
    icon: Clock,
    color: "from-primary to-accent",
  },
]

export default function JudgeDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Judge Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Review and score hackathon projects</p>
      </motion.div>

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
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Assigned Hackathons</CardTitle>
            <CardDescription>Hackathons you're judging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHackathons.slice(0, 3).map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{hackathon.name}</p>
                    <p className="text-sm text-muted-foreground">{hackathon.totalProjects} projects</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary capitalize">
                    {hackathon.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest judging activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Scored project", project: "Init Club Pro", time: "2 hours ago" },
                { action: "Added feedback", project: "Ward Protocol", time: "5 hours ago" },
                { action: "Completed review", project: "Wiral Network", time: "1 day ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.project}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
