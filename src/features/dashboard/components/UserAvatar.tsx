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

export function UserAvatar({
  firstName,
  lastName,
  avatar,
  size = 'sm',
  className,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = avatar && !imageError;

  if (showImage) {
    return (
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
    );
  }

  return (
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
}
