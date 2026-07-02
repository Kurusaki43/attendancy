'use client';

import Turnstile from 'react-turnstile';

import { clientEnv } from '@/lib/env/end.client';

type Props = {
  onVerify: (token: string) => void;
};

export function TurnstileField({ onVerify }: Props) {
  return (
    <Turnstile
      className="w-full"
      sitekey={clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      onVerify={onVerify}
      size="flexible"
    />
  );
}
