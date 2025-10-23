import { NextRequest, NextResponse } from 'next/server'
import { eq, and, count, sql } from 'drizzle-orm'
import { db, users, hackathons, projects, judgeAssignments, projectScores } from '@/lib/db'
import { getUserFromRequest, isAdmin } from '@/lib/auth-utils'

// GET /api/dashboard/stats - Get dashboard statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get total counts
    const [
      totalUsers,
      totalJudges,
      totalHackathons,
      totalProjects,
      totalScores,
    ] = await Promise.all([
      db.select({ count: count() }).from(users).where(eq(users.isActive, true)),
      db.select({ count: count() }).from(users).where(and(eq(users.role, 'judge'), eq(users.isActive, true))),
      db.select({ count: count() }).from(hackathons),
      db.select({ count: count() }).from(projects).where(eq(projects.isActive, true)),
      db.select({ count: count() }).from(projectScores),
    ])

    // Get hackathon status breakdown
    const hackathonsByStatus = await db
      .select({
        status: hackathons.status,
        count: count(),
      })
      .from(hackathons)
      .groupBy(hackathons.status)

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      recentUsers,
      recentProjects,
      recentScores,
    ] = await Promise.all([
      db.select({ count: count() }).from(users).where(
        and(
          eq(users.isActive, true),
          sql`${users.createdAt} >= ${thirtyDaysAgo}`
        )
      ),
      db.select({ count: count() }).from(projects).where(
        and(
          eq(projects.isActive, true),
          sql`${projects.submittedAt} >= ${thirtyDaysAgo}`
        )
      ),
      db.select({ count: count() }).from(projectScores).where(
        sql`${projectScores.scoredAt} >= ${thirtyDaysAgo}`
      ),
    ])

    // Get top hackathons by project count
    const topHackathons = await db
      .select({
        id: hackathons.id,
        name: hackathons.name,
        status: hackathons.status,
        totalProjects: hackathons.totalProjects,
        startDate: hackathons.startDate,
        endDate: hackathons.endDate,
      })
      .from(hackathons)
      .orderBy(sql`${hackathons.totalProjects} DESC`)
      .limit(5)

    // Get judge assignment statistics
    const judgeStats = await db
      .select({
        judgeId: judgeAssignments.judgeId,
        judgeName: users.name,
        assignmentCount: count(),
      })
      .from(judgeAssignments)
      .innerJoin(users, eq(judgeAssignments.judgeId, users.id))
      .where(eq(users.isActive, true))
      .groupBy(judgeAssignments.judgeId, users.name)
      .orderBy(sql`count(*) DESC`)
      .limit(10)

    // Get scoring statistics
    const scoringStats = await db
      .select({
        totalScores: count(),
        averageScore: sql`ROUND(AVG(${projectScores.totalScore}), 2)`,
        highestScore: sql`MAX(${projectScores.totalScore})`,
        lowestScore: sql`MIN(${projectScores.totalScore})`,
      })
      .from(projectScores)

    // Calculate completion rates
    const activeHackathons = await db.query.hackathons.findMany({
      where: eq(hackathons.status, 'ongoing'),
      with: {
        projects: {
          where: eq(projects.isActive, true),
          with: {
            scores: true,
          },
        },
        judgeAssignments: true,
      },
    })

    const completionRates = activeHackathons.map(hackathon => {
      const totalProjects = hackathon.projects.length
      const totalJudges = hackathon.judgeAssignments.length
      const expectedScores = totalProjects * totalJudges
      const actualScores = hackathon.projects.reduce(
        (sum, project) => sum + project.scores.length,
        0
      )
      
      return {
        hackathonId: hackathon.id,
        hackathonName: hackathon.name,
        totalProjects,
        totalJudges,
        expectedScores,
        actualScores,
        completionRate: expectedScores > 0 ? Math.round((actualScores / expectedScores) * 100) : 0,
      }
    })

    const stats = {
      overview: {
        totalUsers: totalUsers[0].count,
        totalJudges: totalJudges[0].count,
        totalHackathons: totalHackathons[0].count,
        totalProjects: totalProjects[0].count,
        totalScores: totalScores[0].count,
      },
      hackathonsByStatus: hackathonsByStatus.reduce((acc, item) => {
        acc[item.status] = item.count
        return acc
      }, {} as Record<string, number>),
      recentActivity: {
        newUsers: recentUsers[0].count,
        newProjects: recentProjects[0].count,
        newScores: recentScores[0].count,
      },
      topHackathons,
      judgeStats,
      scoringStats: {
        totalScores: Number(scoringStats[0]?.totalScores || 0),
        averageScore: Number(scoringStats[0]?.averageScore || 0),
        highestScore: Number(scoringStats[0]?.highestScore || 0),
        lowestScore: Number(scoringStats[0]?.lowestScore || 0),
      },
      completionRates,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}