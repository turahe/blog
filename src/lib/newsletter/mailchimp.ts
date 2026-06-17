export async function subscribeToMailchimp(email: string): Promise<Response> {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const server = process.env.MAILCHIMP_API_SERVER
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !server || !audienceId) {
    return new Response(JSON.stringify({ error: 'Mailchimp is not configured' }), {
      status: 500,
    })
  }

  const response = await fetch(
    `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      },
      body: JSON.stringify({ email_address: email, status: 'subscribed' }),
    }
  )

  return response
}
