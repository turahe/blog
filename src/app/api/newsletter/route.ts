import { NextResponse } from 'next/server'
import { subscribeToMailchimp } from '@/lib/newsletter/mailchimp'
import { getSiteMetadata } from '@/lib/site-metadata/get-site-metadata'

export async function POST(request: Request) {
  const { email } = await request.json()
  const siteMetadata = await getSiteMetadata()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    if (siteMetadata.newsletter?.provider === 'mailchimp') {
      const response = await subscribeToMailchimp(email)
      if (response.status >= 400) {
        return NextResponse.json(
          { error: 'There was an error subscribing to the list.' },
          { status: response.status }
        )
      }
      return NextResponse.json(
        { message: 'Successfully subscribed to the newsletter' },
        { status: 201 }
      )
    }

    return NextResponse.json({ error: 'Newsletter provider not supported' }, { status: 500 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Subscription failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
