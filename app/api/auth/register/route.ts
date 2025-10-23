import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, users } from '@/lib/db'
import { hashPassword, generateToken, getUserFromRequest, isAdmin } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'judge', expertise, avatar } = await request.json()

    // Validate input
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

    // Check if creating admin user - only admins can create admin users
    if (role === 'admin') {
      const currentUser = getUserFromRequest(request)
      if (!isAdmin(currentUser)) {
        return NextResponse.json(
          { error: 'Only admins can create admin users' },
          { status: 403 }
        )
      }
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

    // Create user
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      expertise: expertise || null,
      avatar: avatar || null,
    }).returning()

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'User created successfully',
    }, { status: 201 })

    // Set token in httpOnly cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}