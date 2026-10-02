import type { FreeSerpSitesResponse } from '../../src/types/freeserp';

type FixtureSiteResponse = FreeSerpSitesResponse & {
  results: [FreeSerpSitesResponse['results'][number]];
};

function stubFreeSerpApi() {
  cy.fixture<FixtureSiteResponse>('sites').then((fixture) => {
    cy.intercept({ method: 'GET', pathname: '/api/freeserp' }, (request) => {
      const params = new URL(request.url).searchParams;
      const from = Number(params.get('from') ?? 0);

      if (params.has('from_date')) {
        request.alias = 'newTools';
        request.reply({
          statusCode: 200,
          body: {
            ...fixture,
            total: 4,
            count: 1,
            from,
            size: Number(params.get('size') ?? 4),
            sort: 'went_live',
            order: 'desc',
            results: [
              { ...fixture.results[0], domain: 'recent.example.ai', title: 'Recent AI Product' },
            ],
          },
        });
        return;
      }

      const page = Math.floor(from / 12) + 1;
      const query = params.get('q');
      request.alias = query ? 'catalogSearch' : `catalogPage${page}`;
      request.reply({
        statusCode: 200,
        body: {
          ...fixture,
          query,
          from,
          size: Number(params.get('size') ?? 12),
          sort: params.get('sort') ?? 'relevance',
          order: params.get('order') ?? 'desc',
          results: [
            {
              ...fixture.results[0],
              domain: `catalog-page-${page}.example.ai`,
              title: query ? 'Chatbot Search Result' : `Example AI Product Page ${page}`,
            },
          ],
        },
      });
    });
  });
}

function visitWithMocks() {
  stubFreeSerpApi();
  cy.visit('/', {
    onBeforeLoad(window) {
      window.localStorage.clear();
    },
  });
}

describe('AI Radar catalog', () => {
  it('loads the main catalog and renders site results', () => {
    visitWithMocks();

    cy.wait('@catalogPage1');
    cy.get('[data-cy="brand"]').should('be.visible').and('contain', 'AI Radar');
    cy.get('[data-cy="search-input"]').should('be.visible');
    cy.get('[data-cy="site-results"]').should('be.visible');
    cy.get('[data-cy="site-card"]').should('have.length.at.least', 1);
  });

  it('searches for a query and reflects it in the URL', () => {
    visitWithMocks();
    cy.wait('@catalogPage1');

    cy.get('[data-cy="search-input"]').clear().type('chatbot');
    cy.wait('@catalogSearch').its('request.url').should('include', 'q=chatbot');
    cy.get('[data-cy="site-card"]').should('contain', 'Chatbot Search Result');
    cy.location('search').should('include', 'q=chatbot');
  });

  it('moves between result pages and updates the URL', () => {
    visitWithMocks();
    cy.wait('@catalogPage1');

    cy.get('[data-cy="pagination-next"]').should('be.visible').and('not.be.disabled').click();
    cy.wait('@catalogPage2').its('request.url').should('include', 'from=12');
    cy.location('search').should('include', 'page=2');
    cy.get('[data-cy="pagination-status"]').should('contain.text', '2');
    cy.get('[data-cy="site-card"]').should('contain', 'Page 2');

    cy.get('[data-cy="pagination-previous"]').should('not.be.disabled').click();
    cy.location('search').should('not.include', 'page=');
    cy.get('[data-cy="site-card"]').should('contain', 'Page 1');
  });

  it('switches the interface between Ukrainian and English', () => {
    visitWithMocks();
    cy.wait('@catalogPage1');

    cy.get('[data-cy="language-selector"]').should('be.visible');
    cy.get('[data-cy="language-uk"]').click();
    cy.get('[data-cy="hero-title"]').should('have.text', 'Знаходьте корисні ШІ-продукти');

    cy.get('[data-cy="language-en"]').click();
    cy.get('[data-cy="hero-title"]').should('have.text', 'Discover useful AI products');
  });

  it('loads catalog cards from the live FreeSerp API', () => {
    cy.intercept({ method: 'GET', pathname: '/api/freeserp' }, (request) => {
      const params = new URL(request.url).searchParams;
      if (!params.has('from_date') && params.get('size') === '12') {
        request.alias = 'liveCatalog';
      }
    });

    cy.visit('/');
    cy.wait('@liveCatalog', { timeout: 20_000 });
    cy.get('[data-cy="site-results"] [data-cy="site-card"]', { timeout: 20_000 }).should(
      ($cards) => {
        expect($cards.length).to.be.greaterThan(0);
      },
    );
  });
});
