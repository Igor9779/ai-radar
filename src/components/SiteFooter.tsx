import type { TranslationDictionary } from '../translations';
import { SiteBrand } from './SiteBrand';

interface SiteFooterProps {
  translations: TranslationDictionary;
}

export function SiteFooter({ translations }: SiteFooterProps) {
  return (
    <footer className="site-footer" id="about">
      <div className="page-width site-footer__inner">
        <SiteBrand className="brand--footer" />
        <p>{translations.footerTagline}</p>
      </div>
    </footer>
  );
}
