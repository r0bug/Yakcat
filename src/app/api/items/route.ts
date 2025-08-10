import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + 
    '-' + 
    Date.now().toString(36)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, price, location, contactInfo, images } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Check if database is available
    if (!prisma) {
      // Return mock data if no database
      return NextResponse.json({
        id: Date.now().toString(),
        title,
        description,
        price,
        location,
        contactInfo,
        slug: generateSlug(title),
        images: images || [],
        status: 'AVAILABLE',
        createdAt: new Date().toISOString()
      })
    }

    // For now, use a default vendor ID since we don't have auth yet
    // In production, this would come from the authenticated user
    const vendorId = 'temp-vendor-id'

    // Create the item with images
    const item = await prisma.item.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        location,
        contactInfo,
        slug: generateSlug(title),
        vendor: {
          connectOrCreate: {
            where: { id: vendorId },
            create: {
              id: vendorId,
              email: 'temp@example.com',
              name: 'Temp Vendor',
              password: 'temp',
            }
          }
        },
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