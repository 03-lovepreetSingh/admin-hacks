import { NextRequest, NextResponse } from 'next/server'
import { eq, and, or } from 'drizzle-orm'
import { db, notifications } from '@/lib/db'
import { getUserFromRequest, isAdmin } from '@/lib/auth-utils'

// GET /api/notifications/[id] - Get a specific notification
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const notificationId = params.id

    // Find notification - user can only access their own notifications or global ones
    const notification = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.id, notificationId),
        or(
          eq(notifications.userId, user.userId),
          eq(notifications.userId, null), // Global notifications
          isAdmin(user) ? undefined : false // Admins can see all notifications
        )
      ),
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Get notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications/[id] - Update notification (mark as read/unread or update content)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const notificationId = params.id
    const { isRead, title, message, type, priority, actionUrl } = await request.json()

    // Find notification
    const notification = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.id, notificationId),
        or(
          eq(notifications.userId, user.userId),
          eq(notifications.userId, null), // Global notifications
          isAdmin(user) ? undefined : false // Admins can update all notifications
        )
      ),
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    // Users can only mark notifications as read/unread
    if (isRead !== undefined) {
      updateData.isRead = isRead
      if (isRead) {
        updateData.readAt = new Date()
      } else {
        updateData.readAt = null
      }
    }

    // Only admins can update notification content
    if (isAdmin(user)) {
      if (title !== undefined) updateData.title = title
      if (message !== undefined) updateData.message = message
      if (type !== undefined) {
        const validTypes = ['info', 'success', 'warning', 'error', 'announcement']
        if (!validTypes.includes(type)) {
          return NextResponse.json(
            { error: 'Invalid notification type' },
            { status: 400 }
          )
        }
        updateData.type = type
      }
      if (priority !== undefined) {
        const validPriorities = ['low', 'medium', 'high', 'urgent']
        if (!validPriorities.includes(priority)) {
          return NextResponse.json(
            { error: 'Invalid priority level' },
            { status: 400 }
          )
        }
        updateData.priority = priority
      }
      if (actionUrl !== undefined) updateData.actionUrl = actionUrl
    }

    // Update notification
    const [updatedNotification] = await db
      .update(notifications)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(notifications.id, notificationId))
      .returning()

    return NextResponse.json({
      notification: updatedNotification,
      message: 'Notification updated successfully',
    })
  } catch (error) {
    console.error('Update notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications/[id] - Delete a notification (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const notificationId = params.id

    // Check if notification exists
    const notification = await db.query.notifications.findFirst({
      where: eq(notifications.id, notificationId),
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Delete notification
    await db.delete(notifications).where(eq(notifications.id, notificationId))

    return NextResponse.json({
      message: 'Notification deleted successfully',
    })
  } catch (error) {
    console.error('Delete notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}