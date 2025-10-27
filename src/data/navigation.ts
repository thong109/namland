import { NavItemType } from '@/shared/Navigation/NavigationItem';

type NavType = {
  home: NavItemType;
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
  findHouse: NavItemType;
  findAgent: NavItemType;
  housingServices: NavItemType;
  serviceAndProduct: NavItemType;
};

export const NAVIGATION: NavType = {
  home: {
    id: 'home',
    href: '/',
  },
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
    id: 'entrust',
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
  findHouse: {
    id: 'findHouse',
    href: '/toi-muon-tim-nha',
  },
  findAgent: {
    id: 'findAgent',
    href: '/find-agent',
  },
  housingServices: {
    id: 'service',
    href: '#',
  },
  serviceAndProduct: {
    id: 'serviceAndProduct',
    href: '#',
  },
};
