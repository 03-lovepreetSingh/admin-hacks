import { NextRequest, NextResponse } from 'next/server'
import { eq, and, desc, avg, sql } from 'drizzle-orm'
import { db, projects, hackathons, projectScores } from '@/lib/db'
import { getUserFromRequest, isAdmin, isJudge } from '@/lib/auth-utils'

// GET /api/projects - List all projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!isJudge(user)) {
      return NextResponse.json(
        { error: 'Judge or admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const hackathonId = searchParams.get('hackathonId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where conditions
    const whereConditions = [eq(projects.isActive, true)]
    
    if (hackathonId) {
      whereConditions.push(eq(projects.hackathonId, hackathonId))
    }

    // Fetch projects with related data
    const projectsList = await db.query.projects.findMany({
      where: and(...whereConditions),
      with: {
        hackathon: {
          columns: {
            id: true,
            name: true,
            status: true,
          },
        },
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
      limit,
      offset,
    })

    // Calculate average scores for each project
    const transformedProjects = projectsList.map(project => {
      const scores = project.scores
      const totalScores = scores.length
      
      let averageScore = 0
      if (totalScores > 0) {
        const sumScores = scores.reduce((sum, score) => sum + score.totalScore, 0)
        averageScore = Math.round((sumScores / totalScores) * 100) / 100
      }

      return {
        ...project,
        averageScore,
        totalScores,
        judges: scores.map(score => score.judge),
      }
    })

    return NextResponse.json({
      projects: transformedProjects,
      total: projectsList.length,
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project submission
export async function POST(request: NextRequest) {
  try {
    const {
      hackathonId,
      teamName,
      description,
      githubLink,
      demoLink,
      teamSize = 1,
      technologies = [],
    } = await request.json()

    // Validate required fields
    if (!hackathonId || !teamName || !description || !githubLink) {
      return NextResponse.json(
        { error: 'Hackathon ID, team name, description, and GitHub link are required' },
        { status: 400 }
      )
    }

    // Validate GitHub link format
    const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+/
    if (!githubRegex.test(githubLink)) {
      return NextResponse.json(
        { error: 'Invalid GitHub link format' },
        { status: 400 }
      )
    }

    // Check if hackathon exists and is accepting submissions
    const hackathon = await db.query.hackathons.findFirst({
      where: eq(hackathons.id, hackathonId),
    })

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    // Check if hackathon is still accepting submissions
    const now = new Date()
    if (now > hackathon.endDate) {
      return NextResponse.json(
        { error: 'Hackathon submission deadline has passed' },
        { status: 400 }
      )
    }

    if (hackathon.status === 'completed') {
      return NextResponse.json(
        { error: 'Hackathon is already completed' },
        { status: 400 }
      )
    }

    // Validate team size
    if (teamSize > hackathon.teamSizeLimit) {
      return NextResponse.json(
        { error: `Team size cannot exceed ${hackathon.teamSizeLimit} members` },
        { status: 400 }
      )
    }

    // Create project
    const [newProject] = await db.insert(projects).values({
      hackathonId,
      teamName,
      description,
      githubLink,
      demoLink: demoLink || null,
      teamSize,
      technologies,
    }).returning()

    // Update hackathon total projects count
    await db
      .update(hackathons)
      .set({
        totalProjects: sql`${hackathons.totalProjects} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(hackathons.id, hackathonId))

    // Fetch created project with related data
    const createdProject = await db.query.projects.findFirst({
      where: eq(projects.id, newProject.id),
      with: {
        hackathon: {
          columns: {
            id: true,
            name: true,
            status: true,
          },
        },
        scores: true,
      },
    })

    return NextResponse.json({
      project: {
        ...createdProject,
        averageScore: 0,
        totalScores: 0,
        judges: [],
      },
      message: 'Project submitted successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}