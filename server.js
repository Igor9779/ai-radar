import axios from 'axios';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDirectory = fileURLToPath(new URL('.', import.meta.url));
const distDirectory = resolve(projectDirectory, 'dist');
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

async function proxyFreeSerp(url, response) {
  try {
    const upstream = await axios.get('https://freeserp.ai/api.php', {
      params: url.searchParams,
      timeout: 15_000,
    });

    response.writeHead(upstream.status, {
      'Cache-Control': upstream.headers['cache-control'] ?? 'public, max-age=30',
      'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(JSON.stringify(upstream.data));
  } catch (error) {
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 502) : 500;
    const data = axios.isAxiosError(error)
      ? (error.response?.data ?? {
          ok: false,
          error: 'upstream',
          detail: 'FreeSerp is unavailable',
        })
      : { ok: false, error: 'proxy_error' };

    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(data));
  }
}

async function serveStaticFile(url, request, response) {
  let pathname;

  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  const filePath =
    pathname === '/'
      ? resolve(distDirectory, 'index.html')
      : resolve(distDirectory, `.${pathname}`);
  if (filePath !== distDirectory && !filePath.startsWith(`${distDirectory}${sep}`)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  let content;
  let resolvedPath = filePath;

  try {
    content = await readFile(resolvedPath);
  } catch (error) {
    if (error.code !== 'ENOENT' || extname(pathname)) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      response.end('Not found');
      return;
    }

    resolvedPath = resolve(distDirectory, 'index.html');
    try {
      content = await readFile(resolvedPath);
    } catch {
      response.writeHead(500);
      response.end('Build the app before starting the server');
      return;
    }
  }

  response.writeHead(200, {
    'Cache-Control': resolvedPath.endsWith('.html')
      ? 'no-cache'
      : 'public, max-age=31536000, immutable',
    'Content-Type': contentTypes[extname(resolvedPath)] ?? 'application/octet-stream',
  });
  response.end(request.method === 'HEAD' ? undefined : content);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');

  if (url.pathname === '/api/freeserp') {
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' });
      response.end('Method not allowed');
      return;
    }

    await proxyFreeSerp(url, response);
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  await serveStaticFile(url, request, response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`AI Radar listening on http://localhost:${port}`);
});
