import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

// In a real app, these would be stored in database
let siteSettings = {
  siteName: 'YakCat',
  siteDescription: 'Consignment Mall Catalog System',
  contactEmail: 'admin@yakcat.com',
  maxImagesPerItem: 6,
  requireApproval: false,
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(siteSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // Update settings in memory (in production, save to database)
    siteSettings = {
      ...siteSettings,
      ...body
    }

    return NextResponse.json(siteSettings)
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}