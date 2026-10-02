import { useEffect, useState, type FormEvent } from 'react';
import { DEFAULT_SITES_PAGE_SIZE, MAX_SITES_RESULT_WINDOW } from './api/freeserp';
import { SORT_OPTIONS } from './catalogOptions';
import { CatalogFilters } from './components/CatalogFilters';
import { CatalogResults } from './components/CatalogResults';
import { HeroSearchSection } from './components/HeroSearchSection';
import { NewToolsSection } from './components/NewToolsSection';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { useCatalogUrlState } from './hooks/useCatalogUrlState';
import { useSites } from './hooks/useSites';
import { translations, type Language } from './translations';

const LANGUAGE_STORAGE_KEY = 'ai-radar-language';

function readInitialLanguage(): Language {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'uk' ? 'uk' : 'en';
  } catch {
    return 'en';
  }
}

function App() {
  const {
    query: searchQuery,
    category,
    sort: sortValue,
    page,
    setQuery,
    setCategory,
    setSort,
    setPage,
    replacePage,
    clear,
  } = useCatalogUrlState();
  const [language, setLanguage] = useState<Language>(readInitialLanguage);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const t = translations[language];
  const sortOption = SORT_OPTIONS.find((option) => option.value === sortValue) ?? SORT_OPTIONS[0];

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Keep the selected language for this session if browser storage is unavailable.
    }
  }, [language]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextQuery = searchInput.trim();
      if (nextQuery !== searchQuery) {
        setQuery(nextQuery);
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, searchQuery, setQuery]);

  const sitesQuery = useSites({
    query: searchQuery || undefined,
    category,
    sort: sortOption.value,
    order: sortOption.order,
    page,
    pageSize: DEFAULT_SITES_PAGE_SIZE,
  });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    setSearchInput(nextQuery);
    setQuery(nextQuery);
  }

  function clearSearch() {
    setSearchInput('');
    setQuery('');
  }

  function clearFilters() {
    setSearchInput('');
    clear();
  }

  const hasFilters = Boolean(
    searchInput.trim() || searchQuery || category || sortValue !== 'relevance' || page > 1,
  );

  useEffect(() => {
    if (!sitesQuery.data || sitesQuery.isError || sitesQuery.isPlaceholderData) return;

    const lastAvailablePage = Math.max(
      1,
      Math.min(
        Math.ceil(Math.max(0, sitesQuery.data.total) / DEFAULT_SITES_PAGE_SIZE),
        Math.floor(MAX_SITES_RESULT_WINDOW / DEFAULT_SITES_PAGE_SIZE),
      ),
    );

    if (page > lastAvailablePage) replacePage(lastAvailablePage);
  }, [sitesQuery.data, sitesQuery.isError, sitesQuery.isPlaceholderData, page, replacePage]);

  return (
    <div className="app-frame">
      <SiteHeader language={language} onLanguageChange={setLanguage} translations={t} />

      <main id="top" className="page-width">
        <HeroSearchSection
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearchClear={clearSearch}
          onSubmit={handleSearch}
          translations={t}
        />

        <NewToolsSection language={language} translations={t} />

        <section className="catalog" aria-label={t.catalogLabel} data-cy="site-results">
          <CatalogFilters
            category={category}
            hasFilters={hasFilters}
            onCategoryChange={setCategory}
            onClearFilters={clearFilters}
            onSortChange={setSort}
            sortValue={sortValue}
            translations={t}
          />
          <CatalogResults
            data={sitesQuery.data}
            hasFilters={hasFilters}
            isError={sitesQuery.isError}
            isFetching={sitesQuery.isFetching}
            isPending={sitesQuery.isPending}
            isPlaceholderData={sitesQuery.isPlaceholderData}
            language={language}
            onClearFilters={clearFilters}
            onPageChange={setPage}
            onRetry={() => void sitesQuery.refetch()}
            page={page}
            total={sitesQuery.total}
            translations={t}
          />
        </section>
      </main>

      <SiteFooter translations={t} />
    </div>
  );
}

export default App;
