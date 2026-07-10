import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { ERROR_CODES } from '@/lib/errors/error-codes';

type ListErrorStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

type GetListErrorStatePropsOptions = {
  /** Plural, lowercase name of the listed resource, e.g. "departments", "positions". */
  resourceLabel: string;
  /** Per-error-code overrides, for features that need different copy or actions than the defaults. */
  overrides?: Partial<Record<string, ListErrorStateProps>>;
};

export function getListErrorStateProps(
  code: string | undefined,
  { resourceLabel, overrides }: GetListErrorStatePropsOptions,
): ListErrorStateProps {
  if (code && overrides?.[code]) {
    return overrides[code];
  }

  switch (code) {
    case ERROR_CODES.BAD_QUERY_PARAMS:
      return {
        title: 'Invalid search or filters',
        description: "Some of the applied filters or search terms aren't valid.",
        action: <ClearFiltersButton />,
      };
    case ERROR_CODES.FORBIDDEN:
      return {
        title: "You don't have access",
        description: `You don't have permission to view ${resourceLabel}. Contact your administrator if you think this is a mistake.`,
        action: null,
      };
    default:
      return {
        title: `Couldn't load ${resourceLabel}`,
        description: `Something went wrong while fetching ${resourceLabel}.`,
        action: undefined,
      };
  }
}
