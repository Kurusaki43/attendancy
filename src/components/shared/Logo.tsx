import Image from 'next/image';

import { cn } from '@/lib/utils';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'size-7',
  md: 'size-9',
  lg: 'size-12',
};

const imageSizes = {
  sm: '28px',
  md: '36px',
  lg: '48px',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <span className={cn('relative inline-block shrink-0', sizeClasses[size], className)}>
      <Image
        src="/logo.png"
        alt="Attendancy logo"
        fill
        sizes={imageSizes[size]}
        className="object-contain"
        priority
      />
    </span>
  );
}
