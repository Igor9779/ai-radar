import type { TranslationDictionary } from '../translations';

type PaginationTranslations = Pick<
  TranslationDictionary,
  'goToPage' | 'next' | 'pageOf' | 'paginationLabel' | 'previous'
>;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
  translations: PaginationTranslations;
}

type PageItem = number | 'ellipsis';

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visiblePages = new Set<number>([1, totalPages]);
  const firstNearPage = Math.max(2, currentPage - 2);
  const lastNearPage = Math.min(totalPages - 1, currentPage + 2);

  for (let page = firstNearPage; page <= lastNearPage; page += 1) {
    visiblePages.add(page);
  }

  const sortedPages = Array.from(visiblePages).sort((left, right) => left - right);
  const items: PageItem[] = [];

  sortedPages.forEach((page, index) => {
    if (index > 0) {
      const gap = page - sortedPages[index - 1];
      if (gap === 2) items.push(page - 1);
      if (gap > 2) items.push('ellipsis');
    }
    items.push(page);
  });

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  isDisabled = false,
  onPageChange,
  translations,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, Math.floor(totalPages));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const pageItems = getPageItems(safeCurrentPage, safeTotalPages);

  return (
    <nav className="pagination" aria-label={translations.paginationLabel}>
      <button
        className="pagination__button"
        data-cy="pagination-previous"
        data-testid="previous-page"
        disabled={isDisabled || safeCurrentPage <= 1}
        onClick={() => onPageChange(safeCurrentPage - 1)}
        type="button"
      >
        {translations.previous}
      </button>

      <div className="pagination__pages">
        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span className="pagination__ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>
              …
            </span>
          ) : (
            <button
              aria-current={item === safeCurrentPage ? 'page' : undefined}
              aria-label={translations.goToPage(item)}
              className={`pagination__page-button${item === safeCurrentPage ? ' is-current' : ''}`}
              data-testid={`page-number-${item}`}
              disabled={isDisabled && item !== safeCurrentPage}
              key={item}
              onClick={() => onPageChange(item)}
              type="button"
            >
              {item}
            </button>
          ),
        )}
      </div>

      <span className="pagination__status" aria-live="polite" data-cy="pagination-status">
        {translations.pageOf(safeCurrentPage, safeTotalPages)}
      </span>

      <button
        className="pagination__button"
        data-cy="pagination-next"
        data-testid="next-page"
        disabled={isDisabled || safeCurrentPage >= safeTotalPages}
        onClick={() => onPageChange(safeCurrentPage + 1)}
        type="button"
      >
        {translations.next}
      </button>
    </nav>
  );
}
