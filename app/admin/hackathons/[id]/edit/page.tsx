"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { X, Eye } from "lucide-react"
import { OverviewTab } from "@/components/hackathon-wizard/overview-tab"
import { PrizesTab } from "@/components/hackathon-wizard/prizes-tab"
import { JudgesTab } from "@/components/hackathon-wizard/judges-tab"
import { ScheduleTab } from "@/components/hackathon-wizard/schedule-tab"
import { mockHackathons } from "@/lib/mock-data"

const tabs = ["Overview", "Prizes", "Judges", "Schedule"]

export default function EditHackathonPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const hackathonId = params.id as string
    const hackathon = mockHackathons.find((h) => h.id === hackathonId)

    if (hackathon) {
      // Pre-fill form data with existing hackathon information
      setFormData({
        name: hackathon.name,
        description: hackathon.description,
        banner: hackathon.banner,
        startDate: hackathon.startDate,
        endDate: hackathon.endDate,
        rules: hackathon.rules,
        teamSizeLimit: hackathon.teamSizeLimit,
        prizes: hackathon.prizes,
        assignedJudges: hackathon.assignedJudges || [],
        status: hackathon.status,
      })
      setLoading(false)
    } else {
      toast({
        title: "Error",
        description: "Hackathon not found",
        variant: "destructive",
      })
      router.push("/admin/hackathons")
    }
  }, [params.id, router, toast])

  const handleSaveDraft = () => {
    toast({
      title: "Changes saved",
      description: "Your hackathon changes have been saved successfully.",
    })
  }

  const handleUpdate = () => {
    toast({
      title: "Hackathon updated",
      description: "Your hackathon has been updated successfully.",
    })
    router.push("/admin/hackathons")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading hackathon data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/hackathons")}
                className="hover:bg-muted"
              >
                <X className="w-4 h-4 mr-2" />
                Save changes & quit
              </Button>
            </div>

            <h1 className="text-xl font-semibold absolute left-1/2 -translate-x-1/2">Edit hackathon info</h1>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <Eye className="w-4 h-4 mr-2" />
                Preview changes
              </Button>
              <Button
                size="sm"
                onClick={handleUpdate}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Update Hackathon
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1 sticky top-24">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    activeTab === index
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 0 && <OverviewTab formData={formData} setFormData={setFormData} />}
                {activeTab === 1 && <PrizesTab formData={formData} setFormData={setFormData} />}
                {activeTab === 2 && <JudgesTab formData={formData} setFormData={setFormData} />}
                {activeTab === 3 && <ScheduleTab formData={formData} setFormData={setFormData} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
