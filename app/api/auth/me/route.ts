import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, users } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const tokenUser = getUserFromRequest(request)
    if (!tokenUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch fresh user data from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, tokenUser.userId),
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is still active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}