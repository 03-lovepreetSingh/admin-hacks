import { NextRequest, NextResponse } from 'next/server'
import { eq, and, desc, or } from 'drizzle-orm'
import { db, notifications } from '@/lib/db'
import { getUserFromRequest, isAdmin } from '@/lib/auth-utils'

// GET /api/notifications - Get notifications for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Build where conditions
    let whereConditions = or(
      eq(notifications.userId, user.userId),
      eq(notifications.userId, null) // Global notifications
    )

    if (unreadOnly) {
      whereConditions = and(
        whereConditions,
        eq(notifications.isRead, false)
      )
    }

    // Fetch notifications
    const userNotifications = await db.query.notifications.findMany({
      where: whereConditions,
      orderBy: [desc(notifications.createdAt)],
      limit,
      offset,
    })

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(notifications)
      .where(whereConditions)

    return NextResponse.json({
      notifications: userNotifications,
      pagination: {
        total: Number(totalCount[0].count),
        limit,
        offset,
        hasMore: Number(totalCount[0].count) > offset + limit,
      },
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create a new notification (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const {
      userId,
      type,
      title,
      message,
      actionUrl,
      priority = 'medium',
    } = await request.json()

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Type, title, and message are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['info', 'success', 'warning', 'error', 'announcement']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      )
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority level' },
        { status: 400 }
      )
    }

    // Create notification
    const [notification] = await db.insert(notifications).values({
      userId: userId || null, // null means global notification
      type,
      title,
      message,
      actionUrl: actionUrl || null,
      priority,
    }).returning()

    return NextResponse.json({
      notification,
      message: 'Notification created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}