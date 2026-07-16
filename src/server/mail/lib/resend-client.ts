import { env } from '@/lib/env/env';

type SendViaResendApiParams = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export async function sendViaResendApi({ from, to, subject, html }: SendViaResendApiParams) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }
}
