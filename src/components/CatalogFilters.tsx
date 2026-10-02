import { CATEGORIES, SORT_OPTIONS } from '../catalogOptions';
import type { CatalogSort } from '../hooks/useCatalogUrlState';
import type { TranslationDictionary } from '../translations';

interface CatalogFiltersProps {
  category: string | undefined;
  hasFilters: boolean;
  onCategoryChange: (category: string | undefined) => void;
  onClearFilters: () => void;
  onSortChange: (sort: CatalogSort) => void;
  sortValue: CatalogSort;
  translations: TranslationDictionary;
}

export function CatalogFilters({
  category,
  hasFilters,
  onCategoryChange,
  onClearFilters,
  onSortChange,
  sortValue,
  translations,
}: CatalogFiltersProps) {
  return (
    <>
      <div className="catalog__heading">
        <div>
          <p className="section-kicker">{translations.explore}</p>
          <h2>{translations.catalogTitle}</h2>
        </div>
        <label className="sort-control">
          <span>{translations.sortBy}</span>
          <select
            aria-label={translations.sortProducts}
            onChange={(event) => onSortChange(event.target.value as CatalogSort)}
            value={sortValue}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {translations[option.label]}
              </option>
            ))}
          </select>
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </label>
      </div>

      <div className="category-section">
        <h3 className="category-section__label">{translations.categoryFilter}</h3>
        <div className="category-list" role="group" aria-label={translations.categoryFilter}>
          {CATEGORIES.map((option, index) => {
            const isActive = (category ?? '') === (option.value ?? '');
            return (
              <button
                aria-pressed={isActive}
                className={`category-chip${isActive ? ' category-chip--active' : ''}`}
                data-testid={index === 0 ? 'category-all' : undefined}
                key={option.value ?? 'all'}
                onClick={() => onCategoryChange(option.value)}
                type="button"
              >
                {translations[option.label]}
              </button>
            );
          })}
        </div>
        {hasFilters && (
          <button className="clear-filters" onClick={onClearFilters} type="button">
            {translations.clearFilters}
          </button>
        )}
      </div>
    </>
  );
}
