"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface OverviewTabProps {
  formData: any
  setFormData: (data: any) => void
}

export function OverviewTab({ formData, setFormData }: OverviewTabProps) {
  const [socialLinks, setSocialLinks] = useState([{ platform: "x.com", url: "" }])

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "x.com", url: "" }])
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Hackathon Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Hackathon Name</Label>
        <Input id="name" placeholder="Enter hackathon name" className="bg-muted/50" />
      </div>

      {/* Banner Upload */}
      <div className="space-y-2">
        <Label>Hackathon Banner</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">Drag/Drop a hackathon visual here or</p>
          <Button variant="link" className="text-primary p-0 h-auto">
            Click to Browse
          </Button>
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-2">
        <Label htmlFor="shortDesc">Short Description</Label>
        <Textarea
          id="shortDesc"
          placeholder="Short description that goes under key visual"
          rows={4}
          className="bg-muted/50 resize-none"
        />
      </div>

      {/* Date Ranges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Registration duration</Label>
          <Input type="text" placeholder="From — to dates" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Hackathon duration</Label>
          <Input type="text" placeholder="From — to dates" className="bg-muted/50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Voting duration</Label>
        <Input type="text" placeholder="From — to dates" className="bg-muted/50" />
      </div>

      {/* Tech Stack & Experience Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tech stack</Label>
          <Select>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Select tech stack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tech stack</SelectItem>
              <SelectItem value="web3">Web3</SelectItem>
              <SelectItem value="ai">AI/ML</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Hackathon location</Label>
        <Input id="location" placeholder="Enter hackathon location" className="bg-muted/50" />
      </div>

      {/* Social Links */}
      <div className="space-y-2">
        <Label>Social links</Label>
        {socialLinks.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Select defaultValue="x.com">
              <SelectTrigger className="w-32 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="x.com">x.com</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Enter link to x.com" className="flex-1 bg-muted/50" />
            {socialLinks.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="link" onClick={addSocialLink} className="text-primary p-0 h-auto">
          + add another link
        </Button>
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <Label>Full Description</Label>
        <div className="border border-border rounded-lg overflow-hidden bg-muted/50">
          {/* Toolbar */}
          <div className="border-b border-border bg-muted/30 p-2 flex items-center gap-1">
            <Select defaultValue="paragraph">
              <SelectTrigger className="w-40 h-8 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraph text</SelectItem>
                <SelectItem value="heading1">Heading 1</SelectItem>
                <SelectItem value="heading2">Heading 2</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-6 w-px bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="text-sm font-bold">B</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="text-sm italic">I</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="text-sm underline">U</span>
            </Button>
          </div>
          {/* Editor */}
          <Textarea
            placeholder="Write your full description here..."
            rows={12}
            className="border-0 bg-transparent resize-none focus-visible:ring-0"
          />
        </div>
      </div>
    </div>
  )
}
