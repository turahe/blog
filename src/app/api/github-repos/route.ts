import { NextResponse } from 'next/server'
import { getGitHubRepos } from '@/services'

export const revalidate = 3600

export async function GET() {
  try {
    const repos = await getGitHubRepos()
    return NextResponse.json(repos)
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
