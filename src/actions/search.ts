'use server'

import { syncSearchIndex } from '@/lib/search'

export async function refreshSearchIndex() {
  await syncSearchIndex()
}
