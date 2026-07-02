import { env } from '@/lib/env/env';

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
};

export async function verifyCaptcha(token: string) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SITE_KEY,
      response: token,
    }),
    cache: 'no-store',
  });

  const data = (await response.json()) as TurnstileResponse;

  return data.success;
}
