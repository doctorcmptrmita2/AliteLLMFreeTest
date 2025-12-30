// Seed script for initial data
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const testEmail = 'doctor.cmptr.mita2@gmail.com'
  const testPassword = 'test123456' // Change this in production!
  const testApiKey = 'sk-nWqZQbczxgZPWPrQjdpWTA'

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email: testEmail },
    include: { apiKeys: true },
  })

  if (!user) {
    // Create user
    const passwordHash = await bcrypt.hash(testPassword, 10)
    user = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test User',
        passwordHash,
        apiKeys: {
          create: {
            keyId: testApiKey,
            keyName: 'Default API Key',
          },
        },
      },
      include: { apiKeys: true },
    })
    console.log(`✅ Created test user: ${testEmail}`)
  } else {
    // Check if API key exists
    const hasApiKey = user.apiKeys.some((key) => key.keyId === testApiKey)
    if (!hasApiKey) {
      await prisma.userApiKey.create({
        data: {
          userId: user.id,
          keyId: testApiKey,
          keyName: 'Default API Key',
        },
      })
      console.log(`✅ Added API key to existing user: ${testEmail}`)
    } else {
      console.log(`ℹ️  Test user already exists: ${testEmail}`)
    }
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

