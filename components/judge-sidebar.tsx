"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Trophy, FolderKanban, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/judge/dashboard", icon: LayoutDashboard },
  { title: "My Hackathons", href: "/judge/hackathons", icon: Trophy },
  { title: "Projects to Judge", href: "/judge/projects", icon: FolderKanban },
  { title: "Leaderboard", href: "/judge/leaderboard", icon: Award },
]

export function JudgeSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-card border-r border-border z-50"
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Image
                  src="/neoweave-logo-white.png"
                  alt="Neoweave"
                  width={140}
                  height={35}
                  className="object-contain"
                />
              </motion.div>
            )}
            {isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-auto"
              >
                <Image src="/neoweave-logo-icon.png" alt="Neoweave" width={32} height={32} className="object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-primary/10"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeJudgeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn("w-5 h-5 relative z-10", isActive && "text-primary-foreground")} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "font-medium relative z-10 whitespace-nowrap",
                          isActive && "text-primary-foreground",
                        )}
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>
    </motion.aside>
  )
}
