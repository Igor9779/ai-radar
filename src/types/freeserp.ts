export type SiteSortField =
  | 'relevance'
  | 'domain'
  | 'category'
  | 'ai_categories'
  | 'ai_source'
  | 'dr'
  | 'went_live'
  | 'first_seen'
  | 'real_site'
  | 'tld'
  | 'http_status'
  | 'content_length'
  | 'html_size'
  | 'webserver'
  | 'ip'
  | 'fetched_at';

export type SiteSortOrder = 'asc' | 'desc';

export interface FreeSerpSite {
  domain: string;
  url?: string | null;
  title?: string | null;
  ai_summary?: string | null;
  category?: string | null;
  ai_categories?: string[] | null;
  ai_source?: string | null;
  dr?: number | null;
  went_live?: string | null;
  first_seen?: string | null;
  tld?: string | null;
  http_status?: number | null;
  real_site?: number | null;
  content_length?: number | null;
  html_size?: number | null;
  fetched_at?: string | null;
  ip?: string | null;
  webserver?: string | null;
  _score?: number | null;
}

export interface FreeSerpSitesResponse {
  ok: boolean;
  index: 'sites';
  query?: string | null;
  total: number;
  count?: number;
  from?: number;
  size?: number;
  sort?: SiteSortField;
  order?: SiteSortOrder;
  filters?: Record<string, string | number | boolean>;
  took_ms?: number;
  engine_ms?: number;
  results: FreeSerpSite[];
  related_apis?: Record<string, unknown>;
}

export interface FreeSerpSitesParams {
  index: 'sites';
  ai_startups: 1;
  q?: string;
  ai_categories?: string;
  sort?: SiteSortField;
  order?: SiteSortOrder;
  from_date?: string;
  size: number;
  from: number;
}

export interface GetSitesParams {
  query?: string;
  category?: string;
  sort?: SiteSortField;
  order?: SiteSortOrder;
  fromDate?: string;
  page?: number;
  pageSize?: number;
}
