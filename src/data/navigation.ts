import { NavItemType } from '@/shared/Navigation/NavigationItem';

type NavType = {
  listingDetail: NavItemType;
  projectList: NavItemType;
  saleListing: NavItemType;
  rentListing: NavItemType;
  projectDetail: NavItemType;
  newsList: NavItemType;
  newsDetail: NavItemType;
  contactUs: NavItemType;
  entrust: NavItemType;
  posterDetail: NavItemType;
  newHomePage: NavItemType;
  newHomeDetail: NavItemType;
};

export const NAVIGATION: NavType = {
  listingDetail: {
    id: 'listingDetail',
    href: '/property/:id',
  },

  projectList: {
    id: 'projectList',
    href: '/project',
  },
  projectDetail: {
    id: 'projectDetail',
    href: '/project/:id',
  },

  contactUs: {
    id: 'contactUs',
    href: '/contact-us',
  },

  saleListing: {
    id: 'saleListing',
    href: '/sale-listing',
  },
  rentListing: {
    id: 'rentListing',
    href: '/rent-listing',
  },

  newsList: {
    id: 'newsList',
    href: '/news',
  },
  newsDetail: {
    id: 'newsDetail',
    href: '/news/:id',
  },

  entrust: {
    id: 'findAgent',
    href: '/nhu-cau-cua-toi',
  },

  posterDetail: {
    id: 'posterDetail',
    href: '/poster-detail/:id',
  },
  newHomePage: {
    id: 'newHomePage',
    href: '/du-an-mo-ban',
  },
  newHomeDetail: {
    id: 'newHomePage',
    href: '/du-an-mo-ban/:id',
  },
};
