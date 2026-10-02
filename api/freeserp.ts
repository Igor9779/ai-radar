import axios from 'axios';

const FREE_SERP_API_URL = 'https://freeserp.ai/api.php';
const FORWARDED_PARAMETERS = ['q', 'ai_categories', 'sort', 'order', 'from_date', 'size', 'from'];

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return Response.json(
        { ok: false, error: 'method_not_allowed' },
        { status: 405, headers: { Allow: 'GET' } },
      );
    }

    const requestUrl = new URL(request.url);
    const params = new URLSearchParams({ index: 'sites', ai_startups: '1' });

    for (const key of FORWARDED_PARAMETERS) {
      const value = requestUrl.searchParams.get(key)?.trim();
      if (value) params.set(key, value);
    }

    try {
      const upstream = await axios.get<unknown>(FREE_SERP_API_URL, {
        params,
        signal: request.signal,
        timeout: 15_000,
      });
      const upstreamCacheControl = upstream.headers['cache-control'];

      return Response.json(upstream.data, {
        status: upstream.status,
        headers: {
          'Cache-Control':
            typeof upstreamCacheControl === 'string' ? upstreamCacheControl : 'public, max-age=30',
        },
      });
    } catch (error) {
      const isAxiosError = axios.isAxiosError(error);
      const status = isAxiosError ? (error.response?.status ?? 502) : 500;
      const body = isAxiosError
        ? (error.response?.data ?? {
            ok: false,
            error: 'upstream_unavailable',
            detail: 'FreeSerp is unavailable',
          })
        : { ok: false, error: 'proxy_error' };

      return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
    }
  },
};
