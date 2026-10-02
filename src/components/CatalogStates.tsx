import type { TranslationDictionary } from '../translations';

interface ErrorStateProps {
  onRetry: () => void;
  translations: TranslationDictionary;
  title?: string;
  message?: string;
}

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
  translations: TranslationDictionary;
  title?: string;
  message?: string;
}

interface InlineErrorStateProps {
  message: string;
  onRetry: () => void;
  retryLabel: string;
}

interface SkeletonGridProps {
  loadingLabel: string;
  count?: number;
  className?: string;
}

export function SkeletonGrid({
  loadingLabel,
  count = 6,
  className = 'site-grid',
}: SkeletonGridProps) {
  return (
    <div className={className} role="status" aria-label={loadingLabel}>
      {Array.from({ length: count }, (_, index) => (
        <article className="site-card skeleton-card" aria-hidden="true" key={index}>
          <div className="skeleton-card__identity">
            <span className="skeleton skeleton-card__avatar" />
            <span className="skeleton-card__heading">
              <span className="skeleton skeleton-card__title" />
              <span className="skeleton skeleton-card__domain" />
            </span>
          </div>
          <span className="skeleton skeleton-card__line" />
          <span className="skeleton skeleton-card__line skeleton-card__line--short" />
          <span className="skeleton skeleton-card__tag" />
          <span className="skeleton skeleton-card__button" />
        </article>
      ))}
    </div>
  );
}

export function ErrorState({ onRetry, translations, title, message }: ErrorStateProps) {
  return (
    <section className="state-panel" role="alert">
      <span className="state-panel__icon state-panel__icon--error" aria-hidden="true">
        !
      </span>
      <h2>{title ?? translations.errorTitle}</h2>
      <p>{message ?? translations.errorMessage}</p>
      <button className="state-panel__button" onClick={onRetry} type="button">
        {translations.retry}
      </button>
    </section>
  );
}

export function InlineErrorState({ message, onRetry, retryLabel }: InlineErrorStateProps) {
  return (
    <div className="inline-error" role="alert">
      <p>{message}</p>
      <button onClick={onRetry} type="button">
        {retryLabel}
      </button>
    </div>
  );
}

export function EmptyState({
  hasFilters,
  onClearFilters,
  translations,
  title,
  message,
}: EmptyStateProps) {
  return (
    <section className="state-panel">
      <span className="state-panel__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.2 4.2" />
        </svg>
      </span>
      <h2>{title ?? (hasFilters ? translations.emptyTitleFiltered : translations.emptyTitle)}</h2>
      <p>
        {message ?? (hasFilters ? translations.emptyMessageFiltered : translations.emptyMessage)}
      </p>
      {hasFilters && onClearFilters && (
        <button
          className="state-panel__button state-panel__button--secondary"
          onClick={onClearFilters}
          type="button"
        >
          {translations.clearFilters}
        </button>
      )}
    </section>
  );
}
