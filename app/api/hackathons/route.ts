import { NextRequest, NextResponse } from 'next/server'
import { desc, eq, and, gte, lte } from 'drizzle-orm'
import { db, hackathons, prizes, judgeAssignments, users } from '@/lib/db'
import { getUserFromRequest, isAdmin } from '@/lib/auth-utils'

// GET /api/hackathons - List all hackathons with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where conditions
    const whereConditions = []
    if (status) {
      whereConditions.push(eq(hackathons.status, status))
    }

    // Fetch hackathons with related data
    const hackathonsList = await db.query.hackathons.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
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
          columns: {
            id: true,
          },
        },
      },
      orderBy: [desc(hackathons.createdAt)],
      limit,
      offset,
    })

    // Transform data to match frontend expectations
    const transformedHackathons = hackathonsList.map(hackathon => ({
      ...hackathon,
      assignedJudges: hackathon.judgeAssignments.map(assignment => assignment.judge),
      totalProjects: hackathon.projects.length,
    }))

    return NextResponse.json({
      hackathons: transformedHackathons,
      total: hackathonsList.length,
    })
  } catch (error) {
    console.error('Get hackathons error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/hackathons - Create a new hackathon
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const {
      name,
      description,
      startDate,
      endDate,
      rules,
      banner,
      teamSizeLimit = 5,
      prizes: prizesData = [],
    } = await request.json()

    // Validate required fields
    if (!name || !description || !startDate || !endDate || !rules) {
      return NextResponse.json(
        { error: 'Name, description, start date, end date, and rules are required' },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Determine status based on dates
    const now = new Date()
    let status = 'upcoming'
    if (now >= start && now <= end) {
      status = 'ongoing'
    } else if (now > end) {
      status = 'completed'
    }

    // Create hackathon
    const [newHackathon] = await db.insert(hackathons).values({
      name,
      description,
      startDate: start,
      endDate: end,
      rules,
      banner: banner || null,
      teamSizeLimit,
      status,
      createdBy: user.userId,
    }).returning()

    // Create prizes if provided
    if (prizesData.length > 0) {
      const prizesToInsert = prizesData.map((prize: any, index: number) => ({
        hackathonId: newHackathon.id,
        title: prize.title,
        amount: prize.amount.toString(),
        currency: prize.currency || 'USD',
        winners: prize.winners || 1,
        position: index + 1,
      }))

      await db.insert(prizes).values(prizesToInsert)
    }

    // Fetch the created hackathon with related data
    const createdHackathon = await db.query.hackathons.findFirst({
      where: eq(hackathons.id, newHackathon.id),
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
        ...createdHackathon,
        assignedJudges: createdHackathon?.judgeAssignments.map(assignment => assignment.judge) || [],
      },
      message: 'Hackathon created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create hackathon error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}