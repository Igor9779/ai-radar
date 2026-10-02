import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_SITES_PAGE_SIZE, getSites } from '../api/freeserp';
import type { GetSitesParams } from '../types/freeserp';

const DEFAULT_PAGE = 1;
const SITES_STALE_TIME = 30_000;

export const sitesQueryKeys = {
  list: (params: GetSitesParams = {}) =>
    [
      'sites',
      {
        query: params.query?.trim() || null,
        category: params.category?.trim() || null,
        sort: params.sort ?? null,
        order: params.order ?? null,
        fromDate: params.fromDate?.trim() || null,
        page: params.page ?? DEFAULT_PAGE,
        pageSize: params.pageSize ?? DEFAULT_SITES_PAGE_SIZE,
      },
    ] as const,
};

type SitesQueryKey = ReturnType<typeof sitesQueryKeys.list>;

function sameResultFilters(previous: SitesQueryKey[1], current: SitesQueryKey[1]) {
  return (
    previous.query === current.query &&
    previous.category === current.category &&
    previous.sort === current.sort &&
    previous.order === current.order &&
    previous.fromDate === current.fromDate &&
    previous.pageSize === current.pageSize
  );
}

function shouldRetryRequest(failureCount: number, error: unknown) {
  if (axios.isCancel(error)) return false;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status && status < 500 && status !== 408 && status !== 429) return false;
  }

  return failureCount < 2;
}

export function useSites(params: GetSitesParams = {}) {
  const queryKey = sitesQueryKeys.list(params);
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => getSites(params, signal),
    placeholderData: (previousData, previousQuery) => {
      const previousKey = previousQuery?.queryKey;
      const previousParams = previousKey?.[1] as SitesQueryKey[1] | undefined;

      return previousParams && sameResultFilters(previousParams, queryKey[1])
        ? previousData
        : undefined;
    },
    staleTime: SITES_STALE_TIME,
    retry: shouldRetryRequest,
  });

  return {
    ...query,
    total: query.data?.total,
  };
}
