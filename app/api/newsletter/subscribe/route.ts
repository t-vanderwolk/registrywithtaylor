import { NextRequest, NextResponse } from 'next/server';
import { forbiddenResponse, rejectReviewerMutation } from '@/lib/server/apiAuth';
import { NewsletterValidationError, subscribeToNewsletter } from '@/lib/server/newsletter';

export async function POST(request: NextRequest) {
  try {
    await rejectReviewerMutation(request);
  } catch (error) {
    return forbiddenResponse(error);
  }

  let body: {
    email?: unknown;
    firstName?: unknown;
    source?: unknown;
    sourceDetail?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    await subscribeToNewsletter({
      email: typeof body.email === 'string' ? body.email : '',
      firstName: typeof body.firstName === 'string' ? body.firstName : null,
      source: typeof body.source === 'string' ? body.source : 'newsletter_form',
      sourceDetail: typeof body.sourceDetail === 'string' ? body.sourceDetail : null,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NewsletterValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Unable to subscribe. Please try again.' }, { status: 500 });
  }
}
