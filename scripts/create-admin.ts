import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const password = process.env.ADMIN_PASSWORD || process.argv[2]
  
  if (!password) {
    console.error('Please provide admin password as argument: npm run create-admin <password>')
    console.error('Or set ADMIN_PASSWORD environment variable')
    process.exit(1)
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: 'john@yakimafinds.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        email: 'john@yakimafinds.com',
        name: 'John',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Admin user created successfully:', {
      email: user.email,
      name: user.name,
      role: user.role
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()