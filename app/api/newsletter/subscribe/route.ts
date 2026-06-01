import { NextResponse } from 'next/server';

const DC = 'us22';

export async function POST(request: Request) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: 'Newsletter service not configured.' }, { status: 500 });
  }

  let body: { email?: unknown; firstName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';

  const response = await fetch(
    `https://${DC}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`anystring:${apiKey}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: firstName ? { FNAME: firstName } : undefined,
      }),
    },
  );

  if (response.ok) {
    return NextResponse.json({ success: true });
  }

  const data = (await response.json().catch(() => null)) as { title?: string; detail?: string } | null;
  const title = data?.title ?? '';

  if (title === 'Member Exists') {
    return NextResponse.json({ success: true });
  }

  console.error('Mailchimp subscribe error:', data?.title, data?.detail);
  return NextResponse.json({ error: 'Unable to subscribe. Please try again.' }, { status: 500 });
}
