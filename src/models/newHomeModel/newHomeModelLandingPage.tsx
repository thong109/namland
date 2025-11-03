interface ImageUrl {
  id: string;
  url: string;
  name: string | null;
}

interface Location {
  province: string;
  district: string;
  ward: string;
  street: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
}

export interface NewHomeLandingPageModel {
  thumbnail?: any;
  title: string;
  location: Location;
  isFavourite?: boolean;
  totalPrice?: string;
  parkingFee?: string;
  layout?: string;
  unitArea?: string;
  handoverYear?: number | string;
  investor: string;
  layouts?: any[];
  fromPrice?: number;
  toPrice?: number;
  images: ImageUrl[];
  listingDetail?: any;
  address: string;
  id: string;
  code: string;
  name: string;
  nameEn: string;
  nameKr: string;
  locationType?: string;
  segment?: string;
  order: number;
  listingCount: number;
  logoUrl?: string;
  logoFile?: string;
  imageUrl?: string;
  imageFile?: string;
  isShowUnitCode: boolean;
  unitCode: string;
  size: string;
  color: string;
  totalArea: number;
  handOverYear: number;
  yearBuited: Date;
  numberOfFloor: number;
  numberOfUnit: number;
  unitTypeRent: { id: string; name: string }[];
  unitTypeSell: { id: string; name: string }[];
  types: { id: string; name: string }[];
  counterPaymentEn: string;
  counterPaymentVi: string;
  exchangeRate: number;
  id_WS?: string;
  createdAt: Date;
  createdBy: string;
  isPush: boolean;
  packageIndex: string | null;
  showOnApp: boolean;
  showOnOverviewReport: boolean;
  status: string;
  transferPaymentEn: string;
  transferPaymentVi: string;
  tutorialBooking: string;
  tutorialBookingEn: string;
  type: string;
  updatedAt: Date;
  updatedBy: string;
  views: any[];
  vnPayPaymentEn: string;
  vnPayPaymentVi: string;
  owner: string;
  managedBy: string;
  indoorAmenities: any[];
  outdoorAmenities: any[];
  nearBy: any[];
  saleCount: number;
  rentCount: number;
  description?: string;
  descriptionsEn?: string;
}
