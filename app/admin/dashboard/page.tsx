"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, FolderKanban, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Hackathons",
    value: "12",
    change: "+2 this month",
    icon: Trophy,
    color: "from-primary to-secondary",
  },
  {
    title: "Active Judges",
    value: "48",
    change: "+8 this month",
    icon: Users,
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
    title: "Avg. Score",
    value: "8.4",
    change: "+0.3 from last",
    icon: TrendingUp,
    color: "from-primary to-accent",
  },
]

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

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your hackathons.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}
                />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Hackathons</CardTitle>
              <CardDescription>Latest hackathon activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "ChainSpark Hackathon", status: "Ongoing", date: "Jun 17 - Jul 19" },
                  { name: "Web3 Innovate Jam", status: "Upcoming", date: "May 10 - 12" },
                  { name: "DeFi Builder Sprint", status: "Completed", date: "Apr 15 - 20" },
                ].map((hackathon, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium">{hackathon.name}</p>
                      <p className="text-sm text-muted-foreground">{hackathon.date}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        hackathon.status === "Ongoing"
                          ? "bg-primary/20 text-primary"
                          : hackathon.status === "Upcoming"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {hackathon.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Top Judges</CardTitle>
              <CardDescription>Most active judges this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", projects: 24, avatar: "SC" },
                  { name: "Michael Rodriguez", projects: 21, avatar: "MR" },
                  { name: "Emily Watson", projects: 19, avatar: "EW" },
                ].map((judge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                      {judge.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{judge.name}</p>
                      <p className="text-sm text-muted-foreground">{judge.projects} projects judged</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
