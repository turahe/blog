import { describe } from 'node:test'

export const describeIntegration =
  process.env.SKIP_INTEGRATION_TESTS === '1' ? describe.skip : describe
