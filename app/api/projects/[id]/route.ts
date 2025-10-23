import { NextRequest, NextResponse } from 'next/server'
import { eq, and, sql } from 'drizzle-orm'
import { db, projects, hackathons } from '@/lib/db'
import { getUserFromRequest, isAdmin, isJudge } from '@/lib/auth-utils'

// GET /api/projects/[id] - Get a specific project
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

    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.isActive, true)),
      with: {
        hackathon: {
          columns: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
        scores: {
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
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Calculate average score
    const scores = project.scores
    const totalScores = scores.length
    
    let averageScore = 0
    let averageInnovation = 0
    let averageDesign = 0
    let averageFunctionality = 0
    let averagePresentation = 0

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
    }

    const transformedProject = {
      ...project,
      averageScore,
      averageInnovation,
      averageDesign,
      averageFunctionality,
      averagePresentation,
      totalScores,
      judges: scores.map(score => score.judge),
    }

    return NextResponse.json({
      project: transformedProject,
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Only admins can update projects
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const projectId = params.id
    const {
      teamName,
      description,
      githubLink,
      demoLink,
      teamSize,
      technologies,
      isActive,
    } = await request.json()

    // Check if project exists
    const existingProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        hackathon: true,
      },
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Validate GitHub link format if provided
    if (githubLink) {
      const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+/
      if (!githubRegex.test(githubLink)) {
        return NextResponse.json(
          { error: 'Invalid GitHub link format' },
          { status: 400 }
        )
      }
    }

    // Validate team size if provided
    if (teamSize && teamSize > existingProject.hackathon.teamSizeLimit) {
      return NextResponse.json(
        { error: `Team size cannot exceed ${existingProject.hackathon.teamSizeLimit} members` },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (teamName !== undefined) updateData.teamName = teamName
    if (description !== undefined) updateData.description = description
    if (githubLink !== undefined) updateData.githubLink = githubLink
    if (demoLink !== undefined) updateData.demoLink = demoLink
    if (teamSize !== undefined) updateData.teamSize = teamSize
    if (technologies !== undefined) updateData.technologies = technologies
    if (isActive !== undefined) updateData.isActive = isActive

    // Update project
    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning()

    // Fetch updated project with related data
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
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
    })

    // Calculate average score
    const scores = project?.scores || []
    const totalScores = scores.length
    let averageScore = 0
    
    if (totalScores > 0) {
      const sumScores = scores.reduce((sum, score) => sum + score.totalScore, 0)
      averageScore = Math.round((sumScores / totalScores) * 100) / 100
    }

    return NextResponse.json({
      project: {
        ...project,
        averageScore,
        totalScores,
        judges: scores.map(score => score.judge),
      },
      message: 'Project updated successfully',
    })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Only admins can delete projects
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const projectId = params.id

    // Check if project exists
    const existingProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await db
      .update(projects)
      .set({ 
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))

    // Update hackathon total projects count
    await db
      .update(hackathons)
      .set({
        totalProjects: sql`${hackathons.totalProjects} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(hackathons.id, existingProject.hackathonId))

    return NextResponse.json({
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}