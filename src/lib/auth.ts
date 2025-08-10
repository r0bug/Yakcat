import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export interface JWTPayload {
  userId: string
  email: string
  role: 'ADMIN' | 'STAFF' | 'VENDOR'
}

export async function getAuthUser(request: NextRequest) {
  try {
    // Check for token in Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })
      
      return user
    }

    // Check for token in cookies
    const token = request.cookies.get('token')?.value
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })
      
      return user
    }
    
    return null
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}