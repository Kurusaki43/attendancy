'use client';

import Image from 'next/image';
import { useState } from 'react';

import { getInitials } from '@/features/dashboard/lib/dashboard-utils';
import { cn } from '@/lib/utils';

type UserAvatarProps = {
  firstName: string;
  lastName: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
};

const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-20 text-2xl',
};

const imageSizes = {
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '80px',
};

const statusDotClasses = {
  sm: 'size-2',
  md: 'size-2.5',
  lg: 'size-3',
  xl: 'size-4',
};

function StatusDot({ size }: { size: keyof typeof statusDotClasses }) {
  return (
    <span
      aria-label="Connected"
      title="Connected"
      className={cn(
        'ring-background absolute right-0 bottom-0 rounded-full bg-emerald-500 ring-2',
        statusDotClasses[size],
      )}
    />
  );
}

export function UserAvatar({
  firstName,
  lastName,
  avatar,
  size = 'sm',
  className,
  showStatus = false,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = avatar && !imageError;

  const avatarNode = showImage ? (
    <div
      className={cn(
        'bg-primary relative overflow-hidden rounded-full',
        sizeClasses[size],
        className,
      )}
    >
      <Image
        src={avatar}
        alt={`${firstName} ${lastName}`}
        fill
        sizes={imageSizes[size]}
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  ) : (
    <div
      className={cn(
        'bg-primary text-primary-foreground flex items-center justify-center rounded-full font-bold shadow-sm',
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );

  if (!showStatus) return avatarNode;

  return (
    <span className="relative inline-block shrink-0">
      {avatarNode}
      <StatusDot size={size} />
    </span>
  );
}
