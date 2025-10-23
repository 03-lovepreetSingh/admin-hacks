import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db, hackathons, prizes, judgeAssignments } from '@/lib/db'
import { getUserFromRequest, isAdmin } from '@/lib/auth-utils'

// GET /api/hackathons/[id] - Get a specific hackathon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hackathonId = params.id

    const hackathon = await db.query.hackathons.findFirst({
      where: eq(hackathons.id, hackathonId),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        prizes: true,
        judgeAssignments: {
          with: {
            judge: {
              columns: {
                id: true,
                name: true,
                email: true,
                expertise: true,
              },
            },
          },
        },
        projects: {
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
        },
      },
    })

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    // Transform data to match frontend expectations
    const transformedHackathon = {
      ...hackathon,
      assignedJudges: hackathon.judgeAssignments.map(assignment => assignment.judge),
      totalProjects: hackathon.projects.length,
    }

    return NextResponse.json({
      hackathon: transformedHackathon,
    })
  } catch (error) {
    console.error('Get hackathon error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/hackathons/[id] - Update a hackathon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const hackathonId = params.id
    const {
      name,
      description,
      startDate,
      endDate,
      rules,
      banner,
      teamSizeLimit,
      status,
      prizes: prizesData,
    } = await request.json()

    // Check if hackathon exists
    const existingHackathon = await db.query.hackathons.findFirst({
      where: eq(hackathons.id, hackathonId),
    })

    if (!existingHackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start >= end) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    // Update hackathon
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = new Date(endDate)
    if (rules !== undefined) updateData.rules = rules
    if (banner !== undefined) updateData.banner = banner
    if (teamSizeLimit !== undefined) updateData.teamSizeLimit = teamSizeLimit
    if (status !== undefined) updateData.status = status

    const [updatedHackathon] = await db
      .update(hackathons)
      .set(updateData)
      .where(eq(hackathons.id, hackathonId))
      .returning()

    // Update prizes if provided
    if (prizesData) {
      // Delete existing prizes
      await db.delete(prizes).where(eq(prizes.hackathonId, hackathonId))

      // Insert new prizes
      if (prizesData.length > 0) {
        const prizesToInsert = prizesData.map((prize: any, index: number) => ({
          hackathonId: hackathonId,
          title: prize.title,
          amount: prize.amount.toString(),
          currency: prize.currency || 'USD',
          winners: prize.winners || 1,
          position: index + 1,
        }))

        await db.insert(prizes).values(prizesToInsert)
      }
    }

    // Fetch updated hackathon with related data
    const hackathon = await db.query.hackathons.findFirst({
      where: eq(hackathons.id, hackathonId),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        prizes: true,
        judgeAssignments: {
          with: {
            judge: {
              columns: {
                id: true,
                name: true,
                email: true,
                expertise: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      hackathon: {
        ...hackathon,
        assignedJudges: hackathon?.judgeAssignments.map(assignment => assignment.judge) || [],
      },
      message: 'Hackathon updated successfully',
    })
  } catch (error) {
    console.error('Update hackathon error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/hackathons/[id] - Delete a hackathon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const hackathonId = params.id

    // Check if hackathon exists
    const existingHackathon = await db.query.hackathons.findFirst({
      where: eq(hackathons.id, hackathonId),
    })

    if (!existingHackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    // Delete hackathon (cascade will handle related records)
    await db.delete(hackathons).where(eq(hackathons.id, hackathonId))

    return NextResponse.json({
      message: 'Hackathon deleted successfully',
    })
  } catch (error) {
    console.error('Delete hackathon error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}