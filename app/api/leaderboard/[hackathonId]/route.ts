import { NextRequest, NextResponse } from 'next/server'
import { eq, and, desc, avg, sql } from 'drizzle-orm'
import { db, projects, hackathons, projectScores } from '@/lib/db'
import { getUserFromRequest, isJudge } from '@/lib/auth-utils'

// GET /api/leaderboard/[hackathonId] - Get leaderboard for a hackathon
export async function GET(
  request: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!isJudge(user)) {
      return NextResponse.json(
        { error: 'Judge or admin access required' },
        { status: 403 }
      )
    }

    const hackathonId = params.hackathonId

    // Check if hackathon exists
    const hackathon = await db.query.hackathons.findFirst({
      where: eq(hackathons.id, hackathonId),
    })

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    // Fetch all projects for the hackathon with their scores
    const projectsList = await db.query.projects.findMany({
      where: and(
        eq(projects.hackathonId, hackathonId),
        eq(projects.isActive, true)
      ),
      with: {
        scores: {
          with: {
            judge: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [desc(projects.submittedAt)],
    })

    // Calculate rankings and statistics
    const leaderboard = projectsList.map(project => {
      const scores = project.scores
      const totalScores = scores.length
      
      let averageScore = 0
      let averageInnovation = 0
      let averageDesign = 0
      let averageFunctionality = 0
      let averagePresentation = 0
      let totalPossibleScore = 0

      if (totalScores > 0) {
        const sumScores = scores.reduce((sum, score) => sum + score.totalScore, 0)
        const sumInnovation = scores.reduce((sum, score) => sum + score.innovation, 0)
        const sumDesign = scores.reduce((sum, score) => sum + score.design, 0)
        const sumFunctionality = scores.reduce((sum, score) => sum + score.functionality, 0)
        const sumPresentation = scores.reduce((sum, score) => sum + score.presentation, 0)

        averageScore = Math.round((sumScores / totalScores) * 100) / 100
        averageInnovation = Math.round((sumInnovation / totalScores) * 100) / 100
        averageDesign = Math.round((sumDesign / totalScores) * 100) / 100
        averageFunctionality = Math.round((sumFunctionality / totalScores) * 100) / 100
        averagePresentation = Math.round((sumPresentation / totalScores) * 100) / 100
        totalPossibleScore = totalScores * 40 // Max score per judge is 40 (10+10+10+10)
      }

      return {
        id: project.id,
        teamName: project.teamName,
        description: project.description,
        githubLink: project.githubLink,
        demoLink: project.demoLink,
        teamSize: project.teamSize,
        technologies: project.technologies,
        submittedAt: project.submittedAt,
        averageScore,
        averageInnovation,
        averageDesign,
        averageFunctionality,
        averagePresentation,
        totalScores,
        totalPossibleScore,
        scorePercentage: totalPossibleScore > 0 ? Math.round((averageScore * totalScores / totalPossibleScore) * 10000) / 100 : 0,
        judges: scores.map(score => ({
          judge: score.judge,
          innovation: score.innovation,
          design: score.design,
          functionality: score.functionality,
          presentation: score.presentation,
          totalScore: score.totalScore,
          comments: score.comments,
          scoredAt: score.scoredAt,
        })),
      }
    })

    // Sort by average score (descending) and then by total scores (descending)
    leaderboard.sort((a, b) => {
      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore
      }
      return b.totalScores - a.totalScores
    })

    // Add ranking positions
    const rankedLeaderboard = leaderboard.map((project, index) => ({
      ...project,
      rank: index + 1,
    }))

    // Calculate hackathon statistics
    const totalProjects = rankedLeaderboard.length
    const totalSubmissions = rankedLeaderboard.reduce((sum, project) => sum + project.totalScores, 0)
    const averageScoreOverall = totalSubmissions > 0 
      ? Math.round((rankedLeaderboard.reduce((sum, project) => sum + (project.averageScore * project.totalScores), 0) / totalSubmissions) * 100) / 100
      : 0

    const statistics = {
      totalProjects,
      totalSubmissions,
      averageScoreOverall,
      highestScore: rankedLeaderboard.length > 0 ? rankedLeaderboard[0].averageScore : 0,
      lowestScore: rankedLeaderboard.length > 0 ? rankedLeaderboard[rankedLeaderboard.length - 1].averageScore : 0,
    }

    return NextResponse.json({
      hackathon: {
        id: hackathon.id,
        name: hackathon.name,
        status: hackathon.status,
        startDate: hackathon.startDate,
        endDate: hackathon.endDate,
      },
      leaderboard: rankedLeaderboard,
      statistics,
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}