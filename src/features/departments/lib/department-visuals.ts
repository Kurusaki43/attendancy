import {
  Archive,
  Briefcase,
  Building2,
  Code2,
  Flag,
  GraduationCap,
  Headphones,
  type LucideIcon,
  Megaphone,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';

export type DepartmentIconOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const DEPARTMENT_ICON_OPTIONS: DepartmentIconOption[] = [
  { value: 'building-2', label: 'General', icon: Building2 },
  { value: 'code-2', label: 'Engineering', icon: Code2 },
  { value: 'users', label: 'People', icon: Users },
  { value: 'megaphone', label: 'Marketing', icon: Megaphone },
  { value: 'trending-up', label: 'Sales', icon: TrendingUp },
  { value: 'archive', label: 'Operations', icon: Archive },
  { value: 'headphones', label: 'Support', icon: Headphones },
  { value: 'shield', label: 'Security', icon: Shield },
  { value: 'briefcase', label: 'Finance', icon: Briefcase },
  { value: 'shopping-cart', label: 'Retail', icon: ShoppingCart },
  { value: 'settings', label: 'IT', icon: Settings },
  { value: 'graduation-cap', label: 'Training', icon: GraduationCap },
  { value: 'flag', label: 'Legal', icon: Flag },
  { value: 'package', label: 'Logistics', icon: Package },
  { value: 'wrench', label: 'Maintenance', icon: Wrench },
];

export const DEPARTMENT_ICON_MAP = new Map<string, LucideIcon>(
  DEPARTMENT_ICON_OPTIONS.map((option) => [option.value, option.icon]),
);

// Full literal class names (not built via template strings) so Tailwind's scanner picks them up.
export const DEPARTMENT_COLOR_OPTIONS: { value: string; label: string }[] = [
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-amber-500', label: 'Amber' },
  { value: 'bg-lime-500', label: 'Lime' },
  { value: 'bg-emerald-500', label: 'Emerald' },
  { value: 'bg-teal-500', label: 'Teal' },
  { value: 'bg-cyan-500', label: 'Cyan' },
  { value: 'bg-sky-500', label: 'Sky' },
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-violet-500', label: 'Violet' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-fuchsia-500', label: 'Fuchsia' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-rose-500', label: 'Rose' },
  { value: 'bg-slate-500', label: 'Slate' },
];
