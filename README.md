# AI Radar

## Overview

AI Radar is a responsive catalog for discovering AI products. It retrieves site listings from the public FreeSerp API and lets visitors search, browse categories, sort results, and share catalog state through the URL.

## Features

- Search with a 400 ms debounce.
- Browse FreeSerp AI categories and sort by relevance, `went_live`, `first_seen`, or domain rating.
- Page-based results with a 12-item page size, exact API totals, and FreeSerp's 10,000-result window limit.
- URL state for search, category, sort, and page, including browser Back and Forward support.
- A “New AI Tools” section for products FreeSerp first confirmed online during the last 30 days.
- English and Ukrainian UI with language preference saved in local storage.
- TanStack Query caching, previous-page placeholders, loading skeletons, empty states, and retry actions.
- Responsive product cards with optional metadata fallbacks and safe external links.

## Tech Stack

- React
- TypeScript
- Vite
- Axios
- TanStack Query
- CSS

## Development and Test Tooling

- ESLint
- Prettier
- Cypress for end-to-end tests

## API

The app uses the public [FreeSerp API](https://freeserp.ai/docs.php), requesting the `sites` index with `ai_startups=1`.

The catalog sends these parameters when applicable:

- `q` for search.
- `ai_categories` for category filters.
- `sort` and `order` for sorting.
- `from` and `size` for pagination. `from` is calculated as `(page - 1) * size`; the default `size` is 12.
- `from_date` with `sort=went_live` for the recent-tools section.

FreeSerp returns an exact `total` for the current filter set. Its documented paging window ends at 10,000 results. The `went_live` value means FreeSerp first confirmed that a site was reachable; it is not necessarily the product's official launch date. The “New AI Tools” label uses that signal and should be understood accordingly.

The app calls `/api/freeserp`. Vite forwards this route during development and preview. For a built deployment, `server.js` provides the same-origin API proxy and static file server (`npm start`). Static-only hosting needs an equivalent proxy or rewrite for `/api/freeserp`.

## Development Workflow

```bash
npm install
npm run dev
```

Cypress uses `http://127.0.0.1:5173` as its base URL. Keep Vite running on that default port in one terminal while running Cypress from another.

## Production Build

```bash
npm run build
npm run preview
```

`npm run preview` serves the built app locally. To run the included Node server with its API proxy, build first and then use `npm start`.

## Testing

Cypress provides five end-to-end tests in `cypress/e2e/catalog.cy.ts`. Its configuration is in `cypress.config.ts`, and the FreeSerp response fixture is `cypress/fixtures/sites.json`.

Four tests use `cy.intercept()` and the fixture to cover initial catalog rendering, search with URL state, Next/Previous pagination with URL state, and switching between English and Ukrainian. The fifth is an unmocked smoke test that requests real FreeSerp results through the Vite proxy, so it requires network access to the public API.

```bash
npm run cy:open
npm run cy:run
```

`npm run cy:open` opens Cypress in interactive mode. `npm run cy:run` runs the E2E suite headlessly.

## AI-Assisted Development

Codex was used for:

- project scaffolding;
- FreeSerp API and TanStack Query integration;
- React component implementation;
- debugging and refactoring;
- Cypress test implementation and test failure analysis;
- documentation and code review.

The developer reviewed generated code, ran the checks and tests, and adjusted the implementation and documentation during development.

## What Could Be Improved

- Add favorites.
- Add detailed pages for individual tools.
- Expand automated coverage with unit tests and additional edge-case E2E tests.
- Add advanced filters supported by FreeSerp.
- Tune caching and stale-data behavior using production usage data.
- Display richer tool metadata when the API provides it consistently.
- Keep category values synchronized with changes to FreeSerp's taxonomy.
