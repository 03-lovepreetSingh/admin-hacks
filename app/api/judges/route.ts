import { NextRequest, NextResponse } from 'next/server'
import { eq, and, ilike, desc } from 'drizzle-orm'
import { db, users, judgeAssignments } from '@/lib/db'
import { getUserFromRequest, isAdmin, hashPassword } from '@/lib/auth-utils'

// GET /api/judges - List all judges with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where conditions
    const whereConditions = [eq(users.role, 'judge')]
    
    if (search) {
      whereConditions.push(ilike(users.name, `%${search}%`))
    }
    
    if (isActive !== null) {
      whereConditions.push(eq(users.isActive, isActive === 'true'))
    }

    // Fetch judges with their assignment counts
    const judgesList = await db.query.users.findMany({
      where: and(...whereConditions),
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
              },
            },
          },
        },
      },
      orderBy: [desc(users.createdAt)],
      limit,
      offset,
    })

    // Transform data to include assignment counts
    const transformedJudges = judgesList.map(judge => ({
      ...judge,
      totalAssignments: judge.judgeAssignments.length,
      activeAssignments: judge.judgeAssignments.filter(
        assignment => assignment.hackathon.status === 'ongoing'
      ).length,
      hackathons: judge.judgeAssignments.map(assignment => assignment.hackathon),
    }))

    return NextResponse.json({
      judges: transformedJudges,
      total: judgesList.length,
    })
  } catch (error) {
    console.error('Get judges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/judges - Create a new judge
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
      email,
      password,
      name,
      expertise,
      avatar,
    } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create judge
    const [newJudge] = await db.insert(users).values({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'judge',
      expertise: expertise || null,
      avatar: avatar || null,
    }).returning()

    // Return judge data without password
    const { password: _, ...judgeWithoutPassword } = newJudge

    return NextResponse.json({
      judge: {
        ...judgeWithoutPassword,
        totalAssignments: 0,
        activeAssignments: 0,
        hackathons: [],
      },
      message: 'Judge created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create judge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}