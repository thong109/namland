import { NAVIGATION } from '@/data/navigation';

const encodeTitle = (title: string) =>
  title
    ?.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim() // Remove leading and trailing whitespace
    .toLowerCase() // Convert to lowercase for consistency
    .replace(/[\s\n]+/g, '-') // Replace spaces and line breaks with a hyphen
    .replace(/[^a-z0-9\-]+/g, '-') // Replace non-alphanumeric characters with a hyphen
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim leading hyphens
    .replace(/-+$/, ''); // Trim trailing hyphens

const getPathname = (title: string, id: string) => {
  const pageTitle = !!title ? `${encodeTitle(title)}-` : '';
  return pageTitle + id;
};

export const getListingUrl = (id: string, title: string) =>
  NAVIGATION.listingDetail.href.replace(':id', getPathname(title, id));

export const getProjectUrl = (id: string, title: string) =>
  NAVIGATION.projectDetail.href.replace(':id', getPathname(title, id));

export const getNewsUrl = (id: string, title: string) =>
  NAVIGATION.newsDetail.href.replace(':id', getPathname(title, id));

export const getPosterDetailUrl = (id: string, title: string) =>
  NAVIGATION.posterDetail.href.replace(':id', getPathname(title, id));

export const getNewHomeDetailUrl = (id: string, title: string) =>
  NAVIGATION.newHomeDetail.href.replace(':id', getPathname(title, id));
