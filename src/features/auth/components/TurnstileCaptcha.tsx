'use client';

import { RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import type { BoundTurnstileObject } from 'react-turnstile';
import Turnstile from 'react-turnstile';

import { Button } from '@/components/ui/button';
import { clientEnv } from '@/lib/env/end.client';

type Props = {
  onVerify: (token: string) => void;
  onRefresh?: () => void;
};

export function TurnstileField({ onVerify, onRefresh }: Props) {
  const boundRef = useRef<BoundTurnstileObject | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleRefresh = () => {
    if (!boundRef.current) return;

    setRefreshing(true);
    boundRef.current.reset();
    onRefresh?.();

    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="turnstile-container relative border-0 ring-0">
      <Turnstile
        className="w-full"
        sitekey={clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onVerify={(token, bound) => {
          boundRef.current = bound;
          setIsReady(true);
          setRefreshing(false);
          onVerify(token);
        }}
        size="flexible"
      />

      {isReady && (
        <Button
          type="button"
          variant="link"
          size="sm"
          disabled={refreshing}
          onClick={handleRefresh}
          className="text-muted-foreground hover:text-foreground absolute top-5 left-1/2 h-auto w-fit -translate-x-1/2 gap-1.5 py-1 text-xs"
        >
          <RotateCcw className={refreshing ? 'animate-spin' : ''} size={12} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      )}
    </div>
  );
}
