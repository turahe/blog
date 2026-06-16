import { NextResponse } from 'next/server'
import { getSearchDocuments } from '@/services'

export const revalidate = 60

export async function GET() {
  const documents = await getSearchDocuments()
  return NextResponse.json(documents)
}
