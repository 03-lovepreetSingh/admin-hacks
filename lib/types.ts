export interface Hackathon {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  rules: string
  prizes: Prize[]
  banner?: string
  teamSizeLimit: number
  status: "upcoming" | "ongoing" | "completed"
  totalParticipants: number
  totalProjects: number
  assignedJudges: string[]
}

export interface Prize {
  id: string
  title: string
  amount: number
  currency: string
  winners: number
}

export interface Judge {
  id: string
  name: string
  email: string
  expertise: string
  avatar?: string
  assignedHackathons: string[]
}

export interface Project {
  id: string
  hackathonId: string
  teamName: string
  description: string
  githubLink: string
  demoLink?: string
  submittedAt: string
  scores?: ProjectScore[]
  averageScore?: number
  teamSize?: number
  technologies?: string[]
}

export interface ProjectScore {
  judgeId: string
  judgeName: string
  innovation: number
  design: number
  functionality: number
  presentation: number
  comments: string
  totalScore: number
}
