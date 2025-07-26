import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  // Clean up any test artifacts or temporary files
  console.log('🧹 Cleaning up test environment...')
  
  // Add any cleanup logic here if needed
  // For example, removing test data, cleaning up files, etc.
  
  console.log('✅ Test environment cleanup completed')
}

export default globalTeardown 