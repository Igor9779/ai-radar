import type { FormEvent } from 'react';
import type { TranslationDictionary } from '../translations';

interface HeroSearchSectionProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  translations: TranslationDictionary;
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

export function HeroSearchSection({
  searchInput,
  onSearchInputChange,
  onSearchClear,
  onSubmit,
  translations,
}: HeroSearchSectionProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="eyebrow">
        <span className="eyebrow__dot" /> {translations.heroEyebrow}
      </p>
      <h1 id="hero-title" data-cy="hero-title">
        {translations.heroTitle}
      </h1>
      <p className="hero__subtitle">{translations.heroSubtitle}</p>

      <form
        aria-label={translations.searchLabel}
        className="search-form"
        role="search"
        onSubmit={onSubmit}
      >
        <div className="search-form__field">
          <SearchIcon />
          <label className="visually-hidden" htmlFor="catalog-search">
            {translations.searchLabel}
          </label>
          <input
            id="catalog-search"
            autoComplete="off"
            data-cy="search-input"
            data-testid="search-input"
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder={translations.searchPlaceholder}
            type="search"
            value={searchInput}
          />
          {searchInput && (
            <button
              aria-label={translations.clearSearch}
              className="search-clear"
              onClick={onSearchClear}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <path d="m6 6 8 8m0-8-8 8" />
              </svg>
            </button>
          )}
        </div>
        <button className="search-form__button" type="submit">
          <span>{translations.searchButton}</span>
          <SearchIcon />
        </button>
      </form>
    </section>
  );
}
