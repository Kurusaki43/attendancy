'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { AuthUser } from '@/features/auth/types';
import { cn } from '@/lib/utils';

import { canSeeNavItem } from '../lib/navigation-utils';
import type { NavGroup, NavItem } from '../types/navigation.types';
import { UserAvatar } from './UserAvatar';

type SidebarProps = {
  user: AuthUser;
  navGroups: NavGroup[];
  isOpen: boolean;
  onClose: () => void;
};

function NavItemLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out',
        isActive
          ? 'bg-primary text-sidebar-primary-foreground shadow-sm'
          : 'text-sidebar-foreground/80 hover:bg-primary/10 hover:text-sidebar-accent-foreground',
      )}
    >
      <item.icon
        className={cn(
          'size-4 shrink-0 transition-colors duration-200',
          isActive
            ? 'text-sidebar-primary-foreground'
            : 'text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground',
        )}
      />
      <span className="truncate">{item.title}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            'ml-auto rounded-full px-2 py-0.5 text-xs font-semibold',
            isActive
              ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
              : 'bg-sidebar-accent/80 text-sidebar-accent-foreground',
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function NavGroupSection({ group, user }: { group: NavGroup; user: AuthUser }) {
  const visibleItems = group.items.filter((item) => canSeeNavItem(item, user));
  if (visibleItems.length === 0) return null;

  return (
    <div className="space-y-1">
      <p className="text-sidebar-foreground/50 px-3 py-2 text-xs font-semibold tracking-wider uppercase">
        {group.label}
      </p>
      {visibleItems.map((item) => (
        <NavItemLink key={item.href} item={item} />
      ))}
    </div>
  );
}

export function Sidebar({ user, navGroups, isOpen, onClose }: SidebarProps) {
  const primaryRole = user.roles[0]?.name ?? 'User';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r shadow-lg transition-transform duration-300 ease-in-out',
          'h-full lg:static lg:z-auto lg:w-56 lg:translate-x-0 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo / Brand */}
        <div className="border-sidebar-border flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
          <div className="bg-primary flex size-9 items-center justify-center rounded-lg shadow-sm">
            <span className="text-sidebar-primary-foreground text-sm font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-sidebar-foreground truncate text-sm font-semibold">Attendancy</p>
            <p className="text-sidebar-foreground/60 truncate text-xs">HR Platform</p>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 scrollbar-thin overflow-y-auto px-3 py-6">
          <div className="space-y-6">
            {navGroups.map((group) => (
              <NavGroupSection key={group.label} group={group} user={user} />
            ))}
          </div>
        </nav>

        {/* User info footer */}
        <div className="border-sidebar-border shrink-0 border-t p-3">
          <div className="bg-sidebar-accent flex items-center gap-3 rounded-lg px-3 py-2.5 shadow-sm">
            <UserAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              avatar={user.avatar}
              size="sm"
              className="shrink-0 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-accent-foreground truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sidebar-foreground/60 truncate text-xs">{primaryRole}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
