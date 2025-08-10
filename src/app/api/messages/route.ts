import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipientId, subject, body: messageBody } = body

    if (!recipientId || !subject || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Return mock success if no database
    if (!prisma) {
      return NextResponse.json({
        id: Date.now().toString(),
        subject,
        body: messageBody,
        recipientId,
        senderId: 'temp-user',
        createdAt: new Date().toISOString()
      })
    }

    // For now, use a temp sender ID since we don't have auth
    const senderId = 'temp-sender-id'

    const message = await prisma.message.create({
      data: {
        subject,
        body: messageBody,
        sender: {
          connectOrCreate: {
            where: { id: senderId },
            create: {
              id: senderId,
              email: 'sender@example.com',
              name: 'User',
              password: 'temp',
            }
          }
        },
        recipient: {
          connect: { id: recipientId }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Return empty array if no database
    if (!prisma) {
      return NextResponse.json([])
    }

    // For now, get messages for temp user
    const userId = 'temp-user-id'
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { recipientId: userId },
          { senderId: userId }
        ]
      },
      include: {
        sender: { select: { name: true, email: true } },
        recipient: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}