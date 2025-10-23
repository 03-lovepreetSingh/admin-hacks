"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminNavbar } from "@/components/admin-navbar"
import { getCurrentUser } from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      <div className="md:pl-64 transition-all duration-300">
        <AdminNavbar />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
