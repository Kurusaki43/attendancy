'use client';

import { ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { Logo } from '@/components/shared/Logo';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { canSeeNavItem } from '@/features/dashboard/lib/navigation-utils';
import type { NavGroup, NavItem } from '@/features/dashboard/types/navigation.types';
import { cn } from '@/lib/utils';
import type { AuthUser } from '@/server/auth/types';

type SidebarProps = {
  user: AuthUser;
  navGroups: NavGroup[];
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
};

function NavItemLink({
  item,
  isCollapsed,
  pinned = false,
}: {
  item: NavItem;
  isCollapsed: boolean;
  pinned?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const link = (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-sm px-1.5 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out',
        pinned && 'border-sidebar-border border',
        isCollapsed && 'lg:justify-center lg:px-0 lg:py-1',
        isActive
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-sidebar-foreground/80 hover:bg-muted/60 hover:text-sidebar-foreground',
      )}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="bg-primary absolute inset-y-1 -left-3 w-1 rounded-r-sm"
        />
      )}
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-sm transition-colors duration-200',
          isActive ? 'bg-primary/15 text-primary' : 'bg-muted/60 text-sidebar-foreground/60',
        )}
      >
        <item.icon className="size-4" />
      </span>
      <span className={cn('truncate', isCollapsed && 'lg:hidden')}>{item.title}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            'ml-auto rounded-sm px-2 py-0.5 text-xs font-semibold',
            isCollapsed && 'lg:hidden',
            isActive
              ? 'bg-primary/20 text-primary'
              : 'bg-sidebar-accent/80 text-sidebar-accent-foreground',
          )}
        >
          {item.badge}
        </span>
      )}
      {pinned && (
        <ChevronRight
          className={cn(
            'text-sidebar-foreground/40 ml-auto size-4 shrink-0',
            isCollapsed && 'lg:hidden',
          )}
        />
      )}
    </Link>
  );

  if (!isCollapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right" className="hidden lg:block">
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

function NavGroupSection({
  group,
  user,
  isCollapsed,
}: {
  group: NavGroup;
  user: AuthUser;
  isCollapsed: boolean;
}) {
  const visibleItems = group.items.filter((item) => canSeeNavItem(item, user));
  if (visibleItems.length === 0) return null;

  return (
    <div className="space-y-1">
      <p
        className={cn(
          'text-sidebar-foreground/50 truncate px-1.5 py-1.5 text-xs font-semibold tracking-wider uppercase',
          isCollapsed && 'lg:hidden',
        )}
      >
        {group.label}
      </p>
      {visibleItems.map((item) => (
        <NavItemLink key={item.href} item={item} isCollapsed={isCollapsed} />
      ))}
    </div>
  );
}

export function Sidebar({
  user,
  navGroups,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const scrollableGroups = navGroups.filter((group) => !group.pinned);
  const pinnedGroups = navGroups.filter((group) => group.pinned);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-[35] bg-black/50 duration-300 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'bg-sidebar text-sidebar-foreground border-sidebar-border fixed inset-y-0 left-0 z-40 flex w-54 flex-col border-r shadow-lg transition-transform duration-300 ease-out will-change-transform',
          'lg:transition-[width] lg:duration-300 lg:ease-in-out',
          'h-full lg:static lg:z-auto lg:my-3 lg:ms-3 lg:h-[calc(100vh-1.5rem)] lg:translate-x-0 lg:rounded-sm lg:border lg:shadow-xl',
          isCollapsed ? 'lg:w-20' : 'lg:w-54',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo / Brand */}
        <div
          className={cn(
            'border-sidebar-border flex h-16 shrink-0 items-center gap-3 px-2',
            isCollapsed && 'lg:justify-center lg:gap-1.5',
          )}
        >
          <Logo size="lg" className={cn(isCollapsed && 'lg:size-7')} />
          <div className={cn('min-w-0', isCollapsed && 'lg:hidden')}>
            <p className="text-sidebar-foreground truncate text-sm font-semibold">Attendancy</p>
            <p className="text-sidebar-foreground/60 truncate text-xs">HR Platform</p>
          </div>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'text-sidebar-foreground/60 hover:text-sidebar-accent-foreground group/toggle hidden size-5 shrink-0 items-center justify-center lg:flex',
              !isCollapsed && 'ms-auto',
            )}
          >
            {isCollapsed ? (
              <ChevronsRight className="size-5 transition-transform duration-200 group-hover/toggle:scale-125" />
            ) : (
              <ChevronsLeft className="size-5 transition-transform duration-200 group-hover/toggle:scale-125" />
            )}
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 scrollbar-none overflow-x-hidden overflow-y-auto px-3 py-2">
          <div className="space-y-2">
            {scrollableGroups.map((group, index) => (
              <Fragment key={group.label}>
                <NavGroupSection group={group} user={user} isCollapsed={isCollapsed} />
                {isCollapsed && index < scrollableGroups.length - 1 && (
                  <Separator className="hidden lg:block" />
                )}
              </Fragment>
            ))}
          </div>
        </nav>

        {/* Pinned groups (e.g. Settings) */}
        {pinnedGroups.length > 0 && (
          <div
            className={cn('border-sidebar-border shrink-0 border-t p-3', isCollapsed && 'lg:px-2')}
          >
            {pinnedGroups.flatMap((group) =>
              group.items
                .filter((item) => canSeeNavItem(item, user))
                .map((item) => (
                  <NavItemLink key={item.href} item={item} isCollapsed={isCollapsed} pinned />
                )),
            )}
          </div>
        )}
      </aside>
    </>
  );
}
