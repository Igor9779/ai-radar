import type { FreeSerpSite } from '../types/freeserp';
import type { Language, TranslationDictionary } from '../translations';
import { getUtcDateString, isNewTool } from '../constants';

interface SiteCardProps {
  site: FreeSerpSite;
  language: Language;
  translations: TranslationDictionary;
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path d="M4.25 11.75 11.5 4.5M5 4.5h6.5V11" />
    </svg>
  );
}

function formatLiveDate(value: string | null | undefined, language: Language): string | null {
  const dateString = getUtcDateString(value);
  if (!dateString) return null;

  const date = new Date(`${dateString}T00:00:00.000Z`);

  return new Intl.DateTimeFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function getSafeWebsiteUrl(url: string | null | undefined, domain: string): string | null {
  const candidates = [url?.trim(), domain ? `https://${domain}` : undefined];

  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      const parsedUrl = new URL(candidate);
      if (
        (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') &&
        parsedUrl.hostname &&
        !parsedUrl.username &&
        !parsedUrl.password
      ) {
        return parsedUrl.href;
      }
    } catch {
      // Try the domain fallback when the API URL is missing or malformed.
    }
  }

  return null;
}

export function SiteCard({ site, language, translations }: SiteCardProps) {
  const rawDomain = typeof site.domain === 'string' ? site.domain.trim() : '';
  const websiteUrl = getSafeWebsiteUrl(site.url, rawDomain);
  const domain = rawDomain || (websiteUrl ? new URL(websiteUrl).hostname : '');
  const title = typeof site.title === 'string' ? site.title.trim() : '';
  const displayTitle = title || domain || translations.unknownProduct;
  const monogram = (domain || displayTitle).charAt(0).toUpperCase();
  const categories = Array.isArray(site.ai_categories)
    ? site.ai_categories
        .filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
        .slice(0, 2)
    : [];
  const fallbackCategory = typeof site.category === 'string' ? site.category.trim() : '';
  const displayCategories =
    categories.length > 0 ? categories : fallbackCategory ? [fallbackCategory] : [];
  const summary =
    typeof site.ai_summary === 'string' && site.ai_summary.trim()
      ? site.ai_summary.trim()
      : translations.fallbackSummary;
  const liveDate = formatLiveDate(site.went_live, language);
  const hasDomainRating = typeof site.dr === 'number' && Number.isFinite(site.dr);

  return (
    <article className="site-card" data-cy="site-card">
      <div className="site-card__identity">
        <span className="site-card__monogram" aria-hidden="true">
          {monogram}
        </span>
        <div className="site-card__title-group">
          <h3 className="site-card__title">{displayTitle}</h3>
          {domain && <p className="site-card__domain">{domain}</p>}
        </div>
        {isNewTool(site.went_live ?? null) && (
          <span className="site-card__new-badge">{translations.newBadge}</span>
        )}
      </div>

      <p className="site-card__summary">{summary}</p>

      {displayCategories.length > 0 && (
        <ul className="site-card__categories" aria-label={translations.productCategories}>
          {displayCategories.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      <div className="site-card__footer">
        <div className="site-card__metadata">
          {hasDomainRating && (
            <span className="site-card__rating">
              <span className="rating-mark" aria-hidden="true">
                ✦
              </span>
              {translations.domainRating} <strong>{site.dr}</strong>
            </span>
          )}
          {liveDate && <span>{translations.liveSince(liveDate)}</span>}
        </div>
        {websiteUrl && (
          <a
            aria-label={`${translations.visitWebsite}: ${displayTitle}`}
            className="visit-button"
            href={websiteUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {translations.visitWebsite} <ArrowUpRightIcon />
          </a>
        )}
      </div>
    </article>
  );
}
