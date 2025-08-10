import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + 
    '-' + 
    Date.now().toString(36)
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, location, contactInfo, images } = body

    console.log('Creating item for user:', user.id)
    console.log('Images received:', images)

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Create the item with images
    const item = await prisma.item.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        location,
        contactInfo,
        slug: generateSlug(title),
        vendorId: user.id,
        images: {
          create: images?.map((img: any, index: number) => ({
            url: img.url,
            key: img.key,
            order: index,
          })) || []
        }
      },
      include: {
        images: true,
      }
    })

    console.log('Item created successfully:', item.id, 'with', item.images.length, 'images')

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return empty array if no database
    if (!prisma) {
      return NextResponse.json([])
    }
    
    const items = await prisma.item.findMany({
      where: { status: 'AVAILABLE' },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        vendor: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}