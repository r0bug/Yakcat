import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create test users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yakcat.com' },
    update: {},
    create: {
      email: 'admin@yakcat.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  const staffPassword = await bcrypt.hash('staff123', 10)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@yakcat.com' },
    update: {},
    create: {
      email: 'staff@yakcat.com',
      name: 'Staff Member',
      password: staffPassword,
      role: 'STAFF'
    }
  })

  const vendorPassword = await bcrypt.hash('vendor123', 10)
  const vendor1 = await prisma.user.upsert({
    where: { email: 'john@vendor.com' },
    update: {},
    create: {
      email: 'john@vendor.com',
      name: 'John Vendor',
      password: vendorPassword,
      role: 'VENDOR'
    }
  })

  const vendor2 = await prisma.user.upsert({
    where: { email: 'jane@vendor.com' },
    update: {},
    create: {
      email: 'jane@vendor.com',
      name: 'Jane Vendor',
      password: vendorPassword,
      role: 'VENDOR'
    }
  })

  console.log('Created users:', {
    admin: admin.email,
    staff: staff.email,
    vendor1: vendor1.email,
    vendor2: vendor2.email
  })

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'furniture' },
      update: {},
      create: { name: 'furniture' }
    }),
    prisma.tag.upsert({
      where: { name: 'electronics' },
      update: {},
      create: { name: 'electronics' }
    }),
    prisma.tag.upsert({
      where: { name: 'vintage' },
      update: {},
      create: { name: 'vintage' }
    }),
    prisma.tag.upsert({
      where: { name: 'collectibles' },
      update: {},
      create: { name: 'collectibles' }
    }),
    prisma.tag.upsert({
      where: { name: 'tools' },
      update: {},
      create: { name: 'tools' }
    })
  ])

  console.log('Created tags:', tags.map(t => t.name))

  console.log('Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })