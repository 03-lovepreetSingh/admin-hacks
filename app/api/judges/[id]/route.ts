import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db, users, judgeAssignments } from '@/lib/db'
import { getUserFromRequest, isAdmin, hashPassword } from '@/lib/auth-utils'

// GET /api/judges/[id] - Get a specific judge
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const judgeId = params.id

    const judge = await db.query.users.findFirst({
      where: and(eq(users.id, judgeId), eq(users.role, 'judge')),
      columns: {
        password: false, // Exclude password from results
      },
      with: {
        judgeAssignments: {
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
          },
        },
        projectScores: {
          with: {
            project: {
              columns: {
                id: true,
                teamName: true,
              },
              with: {
                hackathon: {
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

    if (!judge) {
      return NextResponse.json(
        { error: 'Judge not found' },
        { status: 404 }
      )
    }

    // Transform data to include statistics
    const transformedJudge = {
      ...judge,
      totalAssignments: judge.judgeAssignments.length,
      activeAssignments: judge.judgeAssignments.filter(
        assignment => assignment.hackathon.status === 'ongoing'
      ).length,
      totalScores: judge.projectScores.length,
      hackathons: judge.judgeAssignments.map(assignment => assignment.hackathon),
      recentScores: judge.projectScores.slice(0, 5), // Last 5 scores
    }

    return NextResponse.json({
      judge: transformedJudge,
    })
  } catch (error) {
    console.error('Get judge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/judges/[id] - Update a judge
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

    const judgeId = params.id
    const {
      name,
      email,
      password,
      expertise,
      avatar,
      isActive,
    } = await request.json()

    // Check if judge exists
    const existingJudge = await db.query.users.findFirst({
      where: and(eq(users.id, judgeId), eq(users.role, 'judge')),
    })

    if (!existingJudge) {
      return NextResponse.json(
        { error: 'Judge not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== existingJudge.email) {
      const emailExists = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 409 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email.toLowerCase()
    if (expertise !== undefined) updateData.expertise = expertise
    if (avatar !== undefined) updateData.avatar = avatar
    if (isActive !== undefined) updateData.isActive = isActive

    // Hash new password if provided
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        )
      }
      updateData.password = await hashPassword(password)
    }

    // Update judge
    const [updatedJudge] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, judgeId))
      .returning()

    // Fetch updated judge with related data
    const judge = await db.query.users.findFirst({
      where: eq(users.id, judgeId),
      columns: {
        password: false,
      },
      with: {
        judgeAssignments: {
          with: {
            hackathon: {
              columns: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      judge: {
        ...judge,
        totalAssignments: judge?.judgeAssignments.length || 0,
        activeAssignments: judge?.judgeAssignments.filter(
          assignment => assignment.hackathon.status === 'ongoing'
        ).length || 0,
        hackathons: judge?.judgeAssignments.map(assignment => assignment.hackathon) || [],
      },
      message: 'Judge updated successfully',
    })
  } catch (error) {
    console.error('Update judge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/judges/[id] - Delete a judge
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

    const judgeId = params.id

    // Check if judge exists
    const existingJudge = await db.query.users.findFirst({
      where: and(eq(users.id, judgeId), eq(users.role, 'judge')),
    })

    if (!existingJudge) {
      return NextResponse.json(
        { error: 'Judge not found' },
        { status: 404 }
      )
    }

    // Check if judge has active assignments
    const activeAssignments = await db.query.judgeAssignments.findMany({
      where: eq(judgeAssignments.judgeId, judgeId),
      with: {
        hackathon: {
          columns: {
            status: true,
          },
        },
      },
    })

    const hasActiveAssignments = activeAssignments.some(
      assignment => assignment.hackathon.status === 'ongoing'
    )

    if (hasActiveAssignments) {
      return NextResponse.json(
        { error: 'Cannot delete judge with active hackathon assignments' },
        { status: 400 }
      )
    }

    // Soft delete by deactivating the judge instead of hard delete
    // This preserves historical data and scores
    await db
      .update(users)
      .set({ 
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, judgeId))

    return NextResponse.json({
      message: 'Judge deactivated successfully',
    })
  } catch (error) {
    console.error('Delete judge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}