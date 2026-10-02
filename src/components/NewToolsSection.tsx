import { NEW_TOOL_DAYS, NEW_TOOLS_PAGE_SIZE, getUtcDateDaysAgo } from '../constants';
import { EmptyState, ErrorState, InlineErrorState, SkeletonGrid } from './CatalogStates';
import { SiteCard } from './SiteCard';
import { useSites } from '../hooks/useSites';
import type { Language, TranslationDictionary } from '../translations';

interface NewToolsSectionProps {
  language: Language;
  translations: TranslationDictionary;
}

export function NewToolsSection({ language, translations }: NewToolsSectionProps) {
  const { data, isPending, isError, refetch } = useSites({
    fromDate: getUtcDateDaysAgo(NEW_TOOL_DAYS),
    sort: 'went_live',
    order: 'desc',
    page: 1,
    pageSize: NEW_TOOLS_PAGE_SIZE,
  });
  const tools = data?.results ?? [];

  return (
    <section className="new-tools" aria-labelledby="new-tools-title" data-testid="new-tools">
      <div className="new-tools__heading">
        <div>
          <p className="section-kicker">{translations.newToolsEyebrow}</p>
          <h2 id="new-tools-title">{translations.newToolsTitle}</h2>
          <p className="new-tools__subtitle">{translations.newToolsSubtitle}</p>
        </div>
      </div>

      <div className="new-tools__content">
        {isPending ? (
          <SkeletonGrid
            className="site-grid new-tools__grid"
            count={NEW_TOOLS_PAGE_SIZE}
            loadingLabel={translations.loadingProducts}
          />
        ) : isError && tools.length === 0 ? (
          <ErrorState
            message={translations.newToolsErrorMessage}
            onRetry={() => void refetch()}
            title={translations.newToolsErrorTitle}
            translations={translations}
          />
        ) : tools.length > 0 ? (
          <>
            {isError && (
              <InlineErrorState
                message={translations.newToolsErrorMessage}
                onRetry={() => void refetch()}
                retryLabel={translations.retry}
              />
            )}
            <div className="site-grid new-tools__grid">
              {tools.map((site) => (
                <SiteCard
                  key={site.domain}
                  language={language}
                  site={site}
                  translations={translations}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            hasFilters={false}
            message={translations.newToolsEmptyMessage}
            title={translations.newToolsEmptyTitle}
            translations={translations}
          />
        )}
      </div>
    </section>
  );
}
