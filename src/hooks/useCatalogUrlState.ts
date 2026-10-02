import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_SITES_PAGE } from '../api/freeserp';
import type { SiteSortField } from '../types/freeserp';

export type CatalogSort = Extract<SiteSortField, 'relevance' | 'went_live' | 'first_seen' | 'dr'>;

export interface CatalogUrlState {
  query: string;
  category: string | undefined;
  sort: CatalogSort;
  page: number;
}

const DEFAULT_CATALOG_STATE: CatalogUrlState = {
  query: '',
  category: undefined,
  sort: 'relevance',
  page: 1,
};

type CatalogField = keyof CatalogUrlState;
type StateUpdate = (current: CatalogUrlState) => CatalogUrlState;

function parseCatalogUrl(): CatalogUrlState {
  const params = new URLSearchParams(window.location.search);
  const rawSort = params.get('sort');
  const rawPage = Number(params.get('page'));
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, MAX_SITES_PAGE) : 1;
  const supportedSorts: CatalogSort[] = ['relevance', 'went_live', 'first_seen', 'dr'];

  return {
    query: params.get('q')?.trim() ?? '',
    category: params.get('category')?.trim() || undefined,
    sort: supportedSorts.includes(rawSort as CatalogSort)
      ? (rawSort as CatalogSort)
      : DEFAULT_CATALOG_STATE.sort,
    page,
  };
}

function writeCatalogParams(state: CatalogUrlState, fields: CatalogField[], replace = false) {
  const params = new URLSearchParams(window.location.search);

  for (const field of fields) {
    if (field === 'query') {
      if (state.query) params.set('q', state.query);
      else params.delete('q');
    } else if (field === 'category') {
      if (state.category) params.set('category', state.category);
      else params.delete('category');
    } else if (field === 'sort') {
      if (state.sort !== DEFAULT_CATALOG_STATE.sort) params.set('sort', state.sort);
      else params.delete('sort');
    } else if (field === 'page') {
      if (state.page !== DEFAULT_CATALOG_STATE.page) params.set('page', String(state.page));
      else params.delete('page');
    }
  }

  const queryString = params.toString();
  const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`;
  if (replace) window.history.replaceState(window.history.state, '', nextUrl);
  else window.history.pushState(window.history.state, '', nextUrl);
}

function statesMatch(left: CatalogUrlState, right: CatalogUrlState) {
  return (
    left.query === right.query &&
    left.category === right.category &&
    left.sort === right.sort &&
    left.page === right.page
  );
}

export function useCatalogUrlState() {
  const [state, setState] = useState(parseCatalogUrl);
  const stateRef = useRef(state);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const expected = {
      q: state.query || null,
      category: state.category ?? null,
      sort: state.sort === DEFAULT_CATALOG_STATE.sort ? null : state.sort,
      page: state.page === 1 ? null : String(state.page),
    };

    if (Object.entries(expected).some(([key, value]) => params.get(key) !== value)) {
      writeCatalogParams(state, ['query', 'category', 'sort', 'page'], true);
    }
  }, [state]);

  useEffect(() => {
    function handlePopState() {
      const nextState = parseCatalogUrl();
      stateRef.current = nextState;
      setState(nextState);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const update = useCallback(
    (fields: CatalogField[], getNextState: StateUpdate, replace = false) => {
      const current = stateRef.current;
      const nextState = getNextState(current);
      if (statesMatch(current, nextState)) return;

      writeCatalogParams(nextState, fields, replace);
      stateRef.current = nextState;
      setState(nextState);
    },
    [],
  );

  const setQuery = useCallback(
    (query: string) =>
      update(['query', 'page'], (current) => ({ ...current, query: query.trim(), page: 1 })),
    [update],
  );
  const setCategory = useCallback(
    (category: string | undefined) =>
      update(['category', 'page'], (current) => ({
        ...current,
        category: category?.trim() || undefined,
        page: 1,
      })),
    [update],
  );
  const setSort = useCallback(
    (sort: CatalogSort) => update(['sort', 'page'], (current) => ({ ...current, sort, page: 1 })),
    [update],
  );
  const setPage = useCallback(
    (page: number) => {
      if (!Number.isSafeInteger(page) || page < 1 || page > MAX_SITES_PAGE) return;
      update(['page'], (current) => ({ ...current, page }));
    },
    [update],
  );
  const replacePage = useCallback(
    (page: number) => {
      if (!Number.isSafeInteger(page) || page < 1 || page > MAX_SITES_PAGE) return;
      update(['page'], (current) => ({ ...current, page }), true);
    },
    [update],
  );
  const clear = useCallback(
    () => update(['query', 'category', 'sort', 'page'], () => ({ ...DEFAULT_CATALOG_STATE })),
    [update],
  );

  return {
    ...state,
    setQuery,
    setCategory,
    setSort,
    setPage,
    replacePage,
    clear,
  };
}
