import { NextRequest, NextResponse } from 'next/server'
import { eq, and, or } from 'drizzle-orm'
import { db, notifications } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth-utils'

// PUT /api/notifications/mark-all-read - Mark all notifications as read for the authenticated user
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Update all unread notifications for the user (including global notifications)
    const result = await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          or(
            eq(notifications.userId, user.userId),
            eq(notifications.userId, null) // Global notifications
          ),
          eq(notifications.isRead, false)
        )
      )
      .returning({ id: notifications.id })

    return NextResponse.json({
      message: `${result.length} notifications marked as read`,
      updatedCount: result.length,
    })
  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}