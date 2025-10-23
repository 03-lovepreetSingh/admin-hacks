import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db, projects, projectScores, judgeAssignments } from '@/lib/db'
import { getUserFromRequest, isJudge } from '@/lib/auth-utils'

// GET /api/projects/[id]/scores - Get all scores for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!isJudge(user)) {
      return NextResponse.json(
        { error: 'Judge or admin access required' },
        { status: 403 }
      )
    }

    const projectId = params.id

    // Check if project exists
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.isActive, true)),
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Fetch all scores for the project
    const scores = await db.query.projectScores.findMany({
      where: eq(projectScores.projectId, projectId),
      with: {
        judge: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: (scores, { desc }) => [desc(scores.scoredAt)],
    })

    return NextResponse.json({
      scores,
    })
  } catch (error) {
    console.error('Get project scores error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/scores - Submit a score for a project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!isJudge(user)) {
      return NextResponse.json(
        { error: 'Judge or admin access required' },
        { status: 403 }
      )
    }

    const projectId = params.id
    const {
      innovation,
      design,
      functionality,
      presentation,
      comments,
    } = await request.json()

    // Validate required fields
    if (innovation === undefined || design === undefined || 
        functionality === undefined || presentation === undefined) {
      return NextResponse.json(
        { error: 'All score categories (innovation, design, functionality, presentation) are required' },
        { status: 400 }
      )
    }

    // Validate score ranges (1-10)
    const scores = [innovation, design, functionality, presentation]
    for (const score of scores) {
      if (!Number.isInteger(score) || score < 1 || score > 10) {
        return NextResponse.json(
          { error: 'All scores must be integers between 1 and 10' },
          { status: 400 }
        )
      }
    }

    // Check if project exists and is active
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.isActive, true)),
      with: {
        hackathon: {
          columns: {
            id: true,
            status: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if hackathon is still ongoing or completed (judges can score during and after)
    if (project.hackathon.status === 'upcoming') {
      return NextResponse.json(
        { error: 'Cannot score projects for upcoming hackathons' },
        { status: 400 }
      )
    }

    // Check if judge is assigned to this hackathon
    const assignment = await db.query.judgeAssignments.findFirst({
      where: and(
        eq(judgeAssignments.judgeId, user.userId),
        eq(judgeAssignments.hackathonId, project.hackathon.id)
      ),
    })

    if (!assignment && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You are not assigned to judge this hackathon' },
        { status: 403 }
      )
    }

    // Check if judge has already scored this project
    const existingScore = await db.query.projectScores.findFirst({
      where: and(
        eq(projectScores.projectId, projectId),
        eq(projectScores.judgeId, user.userId)
      ),
    })

    const totalScore = innovation + design + functionality + presentation

    if (existingScore) {
      // Update existing score
      const [updatedScore] = await db
        .update(projectScores)
        .set({
          innovation,
          design,
          functionality,
          presentation,
          totalScore,
          comments: comments || null,
          updatedAt: new Date(),
        })
        .where(eq(projectScores.id, existingScore.id))
        .returning()

      // Fetch updated score with judge info
      const scoreWithJudge = await db.query.projectScores.findFirst({
        where: eq(projectScores.id, updatedScore.id),
        with: {
          judge: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json({
        score: scoreWithJudge,
        message: 'Score updated successfully',
      })
    } else {
      // Create new score
      const [newScore] = await db.insert(projectScores).values({
        projectId,
        judgeId: user.userId,
        innovation,
        design,
        functionality,
        presentation,
        totalScore,
        comments: comments || null,
      }).returning()

      // Fetch created score with judge info
      const scoreWithJudge = await db.query.projectScores.findFirst({
        where: eq(projectScores.id, newScore.id),
        with: {
          judge: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json({
        score: scoreWithJudge,
        message: 'Score submitted successfully',
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Submit project score error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/scores - Update a score (alternative endpoint)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Reuse the POST logic for updating scores
  return POST(request, { params })
}