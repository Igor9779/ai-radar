import type { Language, TranslationDictionary } from '../translations';
import { SiteBrand } from './SiteBrand';

interface SiteHeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  translations: TranslationDictionary;
}

export function SiteHeader({ language, onLanguageChange, translations }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner page-width">
        <SiteBrand />

        <nav className="header-actions" aria-label={translations.navigationLabel}>
          <div
            className="language-switch"
            data-cy="language-selector"
            role="group"
            aria-label={translations.languageSelector}
          >
            <button
              aria-label={translations.switchToEnglish}
              aria-pressed={language === 'en'}
              className={
                language === 'en' ? 'language-switch__option is-active' : 'language-switch__option'
              }
              data-cy="language-en"
              data-testid="language-en"
              onClick={() => onLanguageChange('en')}
              type="button"
            >
              EN
            </button>
            <span aria-hidden="true">|</span>
            <button
              aria-label={translations.switchToUkrainian}
              aria-pressed={language === 'uk'}
              className={
                language === 'uk' ? 'language-switch__option is-active' : 'language-switch__option'
              }
              data-cy="language-uk"
              data-testid="language-uk"
              onClick={() => onLanguageChange('uk')}
              type="button"
            >
              UA
            </button>
          </div>
          <a className="about-link" href="#about">
            {translations.about}
          </a>
        </nav>
      </div>
    </header>
  );
}
