export type Language = 'en' | 'uk';

export interface TranslationDictionary {
  navigationLabel: string;
  languageSelector: string;
  switchToEnglish: string;
  switchToUkrainian: string;
  about: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchButton: string;
  clearSearch: string;
  catalogLabel: string;
  explore: string;
  catalogTitle: string;
  sortBy: string;
  sortProducts: string;
  sortRelevance: string;
  sortNewest: string;
  sortDiscovered: string;
  sortDomainRating: string;
  categoryFilter: string;
  categoryAll: string;
  categoryAgents: string;
  categoryCode: string;
  categoryAutomation: string;
  categoryImages: string;
  categoryVideo: string;
  categoryChat: string;
  categoryVoice: string;
  curatedProducts: string;
  newToolsEyebrow: string;
  newToolsTitle: string;
  newToolsSubtitle: string;
  newBadge: string;
  newToolsErrorTitle: string;
  newToolsErrorMessage: string;
  newToolsEmptyTitle: string;
  newToolsEmptyMessage: string;
  resultsCount: (start: number, end: number, total: number) => string;
  updatingResults: string;
  loadingProducts: string;
  catalogUnavailable: string;
  errorTitle: string;
  errorMessage: string;
  retry: string;
  emptyTitleFiltered: string;
  emptyMessageFiltered: string;
  emptyTitle: string;
  emptyMessage: string;
  clearFilters: string;
  paginationLabel: string;
  paginationLimitNotice: string;
  goToPage: (page: number) => string;
  previous: string;
  next: string;
  pageOf: (page: number, totalPages: number) => string;
  visitWebsite: string;
  unknownProduct: string;
  productCategories: string;
  domainRating: string;
  liveSince: (date: string) => string;
  fallbackSummary: string;
  footerTagline: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    navigationLabel: 'Main navigation',
    languageSelector: 'Language selector',
    switchToEnglish: 'Switch language to English',
    switchToUkrainian: 'Switch language to Ukrainian',
    about: 'About',
    heroEyebrow: 'YOUR GUIDE TO THE AI LANDSCAPE',
    heroTitle: 'Discover useful AI products',
    heroSubtitle: 'Find AI tools for work, creativity and everyday tasks.',
    searchLabel: 'Search AI products',
    searchPlaceholder: 'Search tools, tasks or ideas...',
    searchButton: 'Search',
    clearSearch: 'Clear search',
    catalogLabel: 'AI product catalog',
    explore: 'EXPLORE',
    catalogTitle: 'Find your next favorite tool',
    sortBy: 'Sort by',
    sortProducts: 'Sort products',
    sortRelevance: 'Most relevant',
    sortNewest: 'Newest',
    sortDiscovered: 'Recently discovered',
    sortDomainRating: 'Domain Rating',
    categoryFilter: 'Browse by category',
    categoryAll: 'All tools',
    categoryAgents: 'AI Agents',
    categoryCode: 'Code & Dev',
    categoryAutomation: 'Automation',
    categoryImages: 'Image generation',
    categoryVideo: 'Video generation',
    categoryChat: 'Chat assistants',
    categoryVoice: 'Voice',
    curatedProducts: 'Curated AI products',
    newToolsEyebrow: 'RECENTLY CONFIRMED ONLINE',
    newToolsTitle: 'New AI Tools',
    newToolsSubtitle: 'AI products FreeSerp has recently confirmed online',
    newBadge: 'NEW',
    newToolsErrorTitle: 'New tools are unavailable',
    newToolsErrorMessage: 'We could not load recently confirmed products. Please try again.',
    newToolsEmptyTitle: 'No recently confirmed tools',
    newToolsEmptyMessage: 'Products confirmed online in this period will appear here.',
    resultsCount: (start, end, total) =>
      `Showing ${start}–${end} of ${total.toLocaleString('en-US')} products`,
    updatingResults: 'Updating results…',
    loadingProducts: 'Loading AI products',
    catalogUnavailable: 'Catalog unavailable',
    errorTitle: 'We couldn’t load the catalog',
    errorMessage: 'Something went wrong while loading AI products. Please try again.',
    retry: 'Try again',
    emptyTitleFiltered: 'No matching products',
    emptyMessageFiltered: 'Try a different search or choose another category.',
    emptyTitle: 'No products to show yet',
    emptyMessage: 'Check back soon for more AI products.',
    clearFilters: 'Clear filters',
    paginationLabel: 'Product results pages',
    paginationLimitNotice: 'FreeSerp limits paging offsets to the first 10,000 results.',
    goToPage: (page) => `Go to page ${page}`,
    previous: 'Previous',
    next: 'Next',
    pageOf: (page, totalPages) => `Page ${page} of ${totalPages}`,
    visitWebsite: 'Visit website',
    unknownProduct: 'AI product',
    productCategories: 'Product categories',
    domainRating: 'DR',
    liveSince: (date) => `First confirmed online ${date}`,
    fallbackSummary: 'A useful AI product to explore. Visit the website to learn more.',
    footerTagline: 'Discover tools that move your ideas forward.',
  },
  uk: {
    navigationLabel: 'Головна навігація',
    languageSelector: 'Вибір мови',
    switchToEnglish: 'Перемкнути мову на англійську',
    switchToUkrainian: 'Перемкнути мову на українську',
    about: 'Про проєкт',
    heroEyebrow: 'ВАШ ГІД У СВІТІ ШТУЧНОГО ІНТЕЛЕКТУ',
    heroTitle: 'Знаходьте корисні ШІ-продукти',
    heroSubtitle: 'Інструменти ШІ для роботи, творчості та повсякденних справ.',
    searchLabel: 'Пошук ШІ-продуктів',
    searchPlaceholder: 'Шукайте інструменти, завдання чи ідеї...',
    searchButton: 'Знайти',
    clearSearch: 'Очистити пошук',
    catalogLabel: 'Каталог ШІ-продуктів',
    explore: 'ДОСЛІДЖУЙТЕ',
    catalogTitle: 'Знайдіть свій наступний улюблений інструмент',
    sortBy: 'Сортування',
    sortProducts: 'Сортувати продукти',
    sortRelevance: 'Найрелевантніші',
    sortNewest: 'Найновіші',
    sortDiscovered: 'Нещодавно знайдені',
    sortDomainRating: 'Рейтинг домену',
    categoryFilter: 'Перегляд за категоріями',
    categoryAll: 'Усі інструменти',
    categoryAgents: 'ШІ-агенти',
    categoryCode: 'Код і розробка',
    categoryAutomation: 'Автоматизація',
    categoryImages: 'Генерація зображень',
    categoryVideo: 'Генерація відео',
    categoryChat: 'Чат-помічники',
    categoryVoice: 'Голос',
    curatedProducts: 'Добірка ШІ-продуктів',
    newToolsEyebrow: 'НЕЩОДАВНО ПІДТВЕРДЖЕНО ОНЛАЙН',
    newToolsTitle: 'Нові ШІ-інструменти',
    newToolsSubtitle: 'ШІ-продукти, які FreeSerp нещодавно підтвердив онлайн',
    newBadge: 'НОВЕ',
    newToolsErrorTitle: 'Нові інструменти недоступні',
    newToolsErrorMessage:
      'Не вдалося завантажити нещодавно підтверджені продукти. Спробуйте ще раз.',
    newToolsEmptyTitle: 'Нещодавно підтверджених інструментів немає',
    newToolsEmptyMessage:
      'Тут з’являтимуться продукти, доступність яких підтверджено в цей період.',
    resultsCount: (start, end, total) =>
      `Показано ${start}–${end} із ${total.toLocaleString('uk-UA')} продуктів`,
    updatingResults: 'Оновлюємо результати…',
    loadingProducts: 'Завантажуємо ШІ-продукти',
    catalogUnavailable: 'Каталог недоступний',
    errorTitle: 'Не вдалося завантажити каталог',
    errorMessage: 'Під час завантаження ШІ-продуктів сталася помилка. Спробуйте ще раз.',
    retry: 'Спробувати ще раз',
    emptyTitleFiltered: 'Нічого не знайдено',
    emptyMessageFiltered: 'Змініть пошуковий запит або виберіть іншу категорію.',
    emptyTitle: 'Поки що немає продуктів',
    emptyMessage: 'Зазирніть пізніше, щоб переглянути нові ШІ-продукти.',
    clearFilters: 'Очистити фільтри',
    paginationLabel: 'Сторінки результатів',
    paginationLimitNotice: 'FreeSerp обмежує пагінацію першими 10 000 результатами.',
    goToPage: (page) => `Перейти до сторінки ${page}`,
    previous: 'Назад',
    next: 'Далі',
    pageOf: (page, totalPages) => `Сторінка ${page} з ${totalPages}`,
    visitWebsite: 'Відвідати сайт',
    unknownProduct: 'ШІ-продукт',
    productCategories: 'Категорії продукту',
    domainRating: 'DR',
    liveSince: (date) => `Вперше підтверджено онлайн: ${date}`,
    fallbackSummary:
      'Корисний ШІ-продукт, який варто дослідити. Відвідайте сайт, щоб дізнатися більше.',
    footerTagline: 'Відкривайте інструменти для втілення ваших ідей.',
  },
};
