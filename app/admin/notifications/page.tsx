"use client"

import { motion } from "framer-motion"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck, Trash2, Clock } from "lucide-react"

const notifications = [
  {
    id: 1,
    title: "New project submitted",
    description: "Team Alpha submitted their project for ChainSpark Hackathon",
    time: "2 hours ago",
    read: false,
    type: "project",
  },
  {
    id: 2,
    title: "Hackathon deadline approaching",
    description: "Web3 Innovate Jam ends in 24 hours",
    time: "5 hours ago",
    read: false,
    type: "deadline",
  },
  {
    id: 3,
    title: "New judge assigned",
    description: "Sarah Chen has been assigned to DeFi Builder Sprint",
    time: "1 day ago",
    read: true,
    type: "judge",
  },
  {
    id: 4,
    title: "Project scored",
    description: "Michael Rodriguez completed scoring for Init Club Pro",
    time: "2 days ago",
    read: true,
    type: "score",
  },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-2">Stay updated with your hackathon activities</p>
        </div>
        <Button variant="outline" className="hover:bg-primary/10 bg-transparent">
          <CheckCheck className="w-4 h-4 mr-2" />
          Mark all as read
        </Button>
      </motion.div>

      <div className="grid gap-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`border-border/50 hover:border-primary/50 transition-all ${!notification.read ? "bg-primary/5" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${!notification.read ? "bg-gradient-to-br from-primary to-secondary" : "bg-muted"}`}
                    >
                      <Bell className={`w-4 h-4 ${!notification.read ? "text-primary-foreground" : ""}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        {!notification.read && <Badge variant="default">New</Badge>}
                      </div>
                      <CardDescription className="mt-1">{notification.description}</CardDescription>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-destructive/10 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
