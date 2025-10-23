"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Bell, LogOut, User, Settings } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import type { User as UserType } from "@/lib/auth"
import { MobileNav } from "./mobile-nav"

export function AdminNavbar() {
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const role = pathname?.startsWith("/judge") ? "judge" : "admin"

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
    >
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileNav role={role} />

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search hackathons, judges, projects..."
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10">
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role || "admin"}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
