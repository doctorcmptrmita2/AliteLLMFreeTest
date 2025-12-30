// Seed script to initialize test user and API key
// This runs on server startup to create a default test user

import { createUser, addApiKeyToUser, getUserByEmail } from './auth'

const TEST_EMAIL = 'doctor.cmptr.mita2@gmail.com'
const TEST_PASSWORD = 'test123456' // Change this in production
const TEST_API_KEY = 'sk-nWqZQbczxgZPWPrQjdpWTA'
const TEST_NAME = 'Test User'

export async function seedTestUser() {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(TEST_EMAIL)
    
    if (existingUser) {
      console.log(`[Seed] User ${TEST_EMAIL} already exists`)
      
      // Check if API key is already associated
      if (!existingUser.apiKeys.includes(TEST_API_KEY)) {
        await addApiKeyToUser(existingUser.id, TEST_API_KEY)
        console.log(`[Seed] Added API key to existing user ${TEST_EMAIL}`)
      } else {
        console.log(`[Seed] API key already associated with user ${TEST_EMAIL}`)
      }
      
      return existingUser
    }
    
    // Create new user
    const user = await createUser(TEST_EMAIL, TEST_NAME, TEST_PASSWORD)
    console.log(`[Seed] Created test user: ${TEST_EMAIL}`)
    
    // Associate API key
    await addApiKeyToUser(user.id, TEST_API_KEY)
    console.log(`[Seed] Associated API key with user ${TEST_EMAIL}`)
    
    return user
  } catch (error) {
    console.error('[Seed] Error seeding test user:', error)
    return null
  }
}

// Auto-run on module import (only in development or if explicitly enabled)
if (process.env.SEED_TEST_USER === 'true' || process.env.NODE_ENV === 'development') {
  seedTestUser().catch(console.error)
}

