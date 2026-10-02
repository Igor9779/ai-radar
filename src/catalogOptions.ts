import type { CatalogSort } from './hooks/useCatalogUrlState';
import type { SiteSortOrder } from './types/freeserp';

type CategoryLabel =
  | 'categoryAll'
  | 'categoryAgents'
  | 'categoryCode'
  | 'categoryAutomation'
  | 'categoryImages'
  | 'categoryVideo'
  | 'categoryChat'
  | 'categoryVoice';
type SortLabel = 'sortRelevance' | 'sortNewest' | 'sortDiscovered' | 'sortDomainRating';

export const CATEGORIES: { label: CategoryLabel; value: string | undefined }[] = [
  { label: 'categoryAll', value: undefined },
  { label: 'categoryAgents', value: 'AI Agents & Autonomous' },
  { label: 'categoryCode', value: 'Code & Dev Tools' },
  { label: 'categoryAutomation', value: 'AI Automation & Workflows' },
  { label: 'categoryImages', value: 'Image Generation' },
  { label: 'categoryVideo', value: 'Video Generation' },
  { label: 'categoryChat', value: 'AI Chatbot & Assistant' },
  { label: 'categoryVoice', value: 'Voice & Text-to-Speech' },
];

export const SORT_OPTIONS: { value: CatalogSort; label: SortLabel; order?: SiteSortOrder }[] = [
  { value: 'relevance', label: 'sortRelevance' },
  { value: 'went_live', label: 'sortNewest', order: 'desc' },
  { value: 'first_seen', label: 'sortDiscovered', order: 'desc' },
  { value: 'dr', label: 'sortDomainRating', order: 'desc' },
];
