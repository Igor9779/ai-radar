import axios from 'axios';
import type { FreeSerpSitesParams, FreeSerpSitesResponse, GetSitesParams } from '../types/freeserp';

export const DEFAULT_SITES_PAGE_SIZE = 12;
export const MAX_SITES_PAGE_SIZE = 100;
export const MAX_SITES_RESULT_WINDOW = 10_000;
export const MAX_SITES_PAGE = Math.floor(MAX_SITES_RESULT_WINDOW / DEFAULT_SITES_PAGE_SIZE);

export const freeserpApi = axios.create({
  baseURL: '/api/freeserp',
  timeout: 15_000,
});

export async function getSites(
  {
    query,
    category,
    sort,
    order,
    fromDate,
    page = 1,
    pageSize = DEFAULT_SITES_PAGE_SIZE,
  }: GetSitesParams = {},
  signal?: AbortSignal,
): Promise<FreeSerpSitesResponse> {
  const from = (page - 1) * pageSize;
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > MAX_SITES_PAGE_SIZE ||
    from + pageSize > MAX_SITES_RESULT_WINDOW
  ) {
    throw new RangeError('FreeSerp paging parameters are outside the supported result window.');
  }

  const params: FreeSerpSitesParams = {
    index: 'sites',
    ai_startups: 1,
    from,
    size: pageSize,
  };

  const normalizedQuery = query?.trim();
  if (normalizedQuery) params.q = normalizedQuery;

  const normalizedCategory = category?.trim();
  if (normalizedCategory) params.ai_categories = normalizedCategory;

  if (sort) params.sort = sort;
  if (order) params.order = order;

  const normalizedFromDate = fromDate?.trim();
  if (normalizedFromDate) params.from_date = normalizedFromDate;

  const response = await freeserpApi.get<FreeSerpSitesResponse>('', { params, signal });
  const data: unknown = response.data;

  if (
    !data ||
    typeof data !== 'object' ||
    !('ok' in data) ||
    data.ok !== true ||
    !('index' in data) ||
    data.index !== 'sites' ||
    !('total' in data) ||
    typeof data.total !== 'number' ||
    !Number.isFinite(data.total) ||
    data.total < 0 ||
    !('results' in data) ||
    !Array.isArray(data.results) ||
    !data.results.every(
      (site) =>
        site !== null &&
        typeof site === 'object' &&
        'domain' in site &&
        typeof site.domain === 'string',
    )
  ) {
    throw new Error('FreeSerp returned an invalid sites response.');
  }

  return data as FreeSerpSitesResponse;
}
