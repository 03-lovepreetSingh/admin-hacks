"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LayoutDashboard, Trophy, Users, BarChart3, Bell, FolderKanban, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Hackathons", href: "/admin/hackathons", icon: Trophy },
  { title: "Judges", href: "/admin/judges", icon: Users },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
]

const judgeNavItems: NavItem[] = [
  { title: "Dashboard", href: "/judge/dashboard", icon: LayoutDashboard },
  { title: "My Hackathons", href: "/judge/hackathons", icon: Trophy },
  { title: "Projects to Judge", href: "/judge/projects", icon: FolderKanban },
  { title: "Leaderboard", href: "/judge/leaderboard", icon: Award },
]

interface MobileNavProps {
  role: "admin" | "judge"
}

export function MobileNav({ role }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navItems = role === "admin" ? adminNavItems : judgeNavItems

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-4 border-b border-border">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {role === "admin" ? "HackAdmin" : "Judge Panel"}
            </span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
