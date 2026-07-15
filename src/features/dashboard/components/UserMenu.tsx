'use client';

import { Settings, User } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutButton } from '@/features/auth/components/LogoutButton';

import { UserAvatar } from './UserAvatar';

type UserMenuProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    roles: { name: string }[];
  };
  onLogout?: () => void;
};

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const primaryRole = user.roles[0]?.name ?? 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex h-10 items-center gap-2.5 rounded-md px-2 transition-colors focus-visible:ring-2 focus-visible:outline-none">
        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          avatar={user.avatar}
          size="sm"
          showStatus
        />
        <div className="hidden flex-col items-start gap-1 md:flex">
          <span className="text-sm leading-tight font-medium">
            {user.firstName} {user.lastName}
          </span>
          <Badge
            variant="default"
            className="flex h-4 items-center rounded-lg px-1.5 py-0 text-[10px] leading-none font-semibold tracking-wider lowercase"
          >
            {primaryRole}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        {/* User Info Header */}
        <div className="from-primary/10 to-primary/5 mb-2 rounded-lg bg-linear-to-br p-3">
          <div className="flex items-center gap-3">
            <UserAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              avatar={user.avatar}
              size="md"
              className="ring-background shadow-md ring-2"
            />
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-muted-foreground truncate text-xs">{user.email}</p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <Link href="/dashboard/profile">
            <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
              <User className="size-4 shrink-0 text-violet-500" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm leading-none font-medium">My Profile</span>
                <span className="text-muted-foreground text-xs leading-none">
                  View and edit profile
                </span>
              </div>
            </DropdownMenuItem>
          </Link>

          <Link href="/dashboard/settings">
            <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
              <Settings className="size-4 shrink-0 text-blue-500" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm leading-none font-medium">Settings</span>
                <span className="text-muted-foreground text-xs leading-none">
                  Preferences & security
                </span>
              </div>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        {/* Logout Button */}
        <LogoutButton onLogout={onLogout} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
