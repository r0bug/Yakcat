import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get counts
    const [totalUsers, totalItems, totalMessages, totalEvents] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.message.count(),
      prisma.event.count()
    ])

    // Get recent items
    const recentItems = await prisma.item.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      totalUsers,
      totalItems,
      totalMessages,
      totalEvents,
      recentItems,
      recentUsers
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}