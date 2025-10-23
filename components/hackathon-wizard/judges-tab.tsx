"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Copy, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Judge {
  id: string
  email: string
  status: "accepted" | "pending"
}

interface JudgesTabProps {
  formData: any
  setFormData: (data: any) => void
}

export function JudgesTab({ formData, setFormData }: JudgesTabProps) {
  const [judges, setJudges] = useState<Judge[]>([])
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const inviteLink = "https://hackx.com/invite/aoiudn...123!nf"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Link copied",
      description: "Invite link has been copied to clipboard.",
    })
  }

  const handleSendInvite = () => {
    if (email) {
      setJudges([...judges, { id: Date.now().toString(), email, status: "pending" }])
      setEmail("")
      toast({
        title: "Invite sent",
        description: `Invitation sent to ${email}`,
      })
    }
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Judges List */}
      <div className="col-span-2">
        {judges.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No judges invited yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {judges.map((judge) => (
              <Card key={judge.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{judge.email[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm">{judge.email}</span>
                </div>
                <Badge variant={judge.status === "accepted" ? "default" : "secondary"}>
                  {judge.status === "accepted" ? "Judge" : "Invite pending"}
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Invite Panel */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Invite to judge hackathon</h3>
          <p className="text-sm text-muted-foreground">Invite judges via invite link or email</p>
        </div>

        {/* Invite Link */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">{inviteLink}</span>
          </div>
          <Button variant="link" onClick={handleCopyLink} className="text-primary p-0 h-auto">
            Copy Link
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">or</div>

        {/* Email Invite */}
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-muted/50"
          />
          <Button onClick={handleSendInvite} className="w-full bg-primary hover:bg-primary/90">
            <Mail className="w-4 h-4 mr-2" />
            Send Invite
          </Button>
        </div>
      </div>
    </div>
  )
}
