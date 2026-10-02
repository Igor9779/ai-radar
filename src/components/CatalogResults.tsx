import { DEFAULT_SITES_PAGE_SIZE, MAX_SITES_RESULT_WINDOW } from '../api/freeserp';
import { EmptyState, ErrorState, InlineErrorState, SkeletonGrid } from './CatalogStates';
import { Pagination } from './Pagination';
import { SiteCard } from './SiteCard';
import type { Language, TranslationDictionary } from '../translations';
import type { FreeSerpSitesResponse } from '../types/freeserp';

interface CatalogResultsProps {
  hasFilters: boolean;
  isPlaceholderData: boolean;
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  data: FreeSerpSitesResponse | undefined;
  total: number | undefined;
  page: number;
  language: Language;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  translations: TranslationDictionary;
}

export function CatalogResults({
  hasFilters,
  isPlaceholderData,
  isPending,
  isError,
  isFetching,
  data,
  total,
  page,
  language,
  onClearFilters,
  onPageChange,
  onRetry,
  translations,
}: CatalogResultsProps) {
  const results = data?.results ?? [];
  const totalPages = Math.ceil(Math.max(0, total ?? 0) / DEFAULT_SITES_PAGE_SIZE);
  const accessiblePageCount = Math.max(
    1,
    Math.min(totalPages, Math.floor(MAX_SITES_RESULT_WINDOW / DEFAULT_SITES_PAGE_SIZE)),
  );
  const resultStart = results.length > 0 ? (data?.from ?? 0) + 1 : 0;
  const resultEnd = (data?.from ?? 0) + results.length;

  return (
    <>
      <div className="results-heading" aria-live="polite">
        <p>
          {total !== undefined
            ? translations.resultsCount(resultStart, resultEnd, total)
            : isError
              ? translations.catalogUnavailable
              : translations.curatedProducts}
        </p>
        {isFetching && isPlaceholderData && (
          <span className="updating-label">{translations.updatingResults}</span>
        )}
      </div>

      <div className="results-content">
        {isPending ? (
          <SkeletonGrid
            count={DEFAULT_SITES_PAGE_SIZE}
            loadingLabel={translations.loadingProducts}
          />
        ) : isError && results.length === 0 ? (
          <ErrorState onRetry={onRetry} translations={translations} />
        ) : results.length > 0 ? (
          <>
            {isError && (
              <InlineErrorState
                message={translations.errorMessage}
                onRetry={onRetry}
                retryLabel={translations.retry}
              />
            )}
            <div className="site-grid">
              {results.map((site) => (
                <SiteCard
                  key={site.domain}
                  site={site}
                  translations={translations}
                  language={language}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            hasFilters={hasFilters}
            onClearFilters={onClearFilters}
            translations={translations}
          />
        )}
      </div>

      {accessiblePageCount > 1 && (
        <div className="pagination-wrapper">
          <Pagination
            currentPage={page}
            isDisabled={isPlaceholderData}
            onPageChange={onPageChange}
            totalPages={accessiblePageCount}
            translations={translations}
          />
          {totalPages > accessiblePageCount && (
            <p className="pagination-limit-notice">{translations.paginationLimitNotice}</p>
          )}
        </div>
      )}
    </>
  );
}
