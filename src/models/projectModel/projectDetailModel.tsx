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

export interface ProjectDetailModel {
  id: string;
  accountNumber?: string;
  address: string;
  bank?: string;
  bankEn?: string;
  bankName?: string;
  beneficiary?: string;
  code: string;
  color: string;
  counterPaymentEn: string;
  counterPaymentVi: string;
  createdAt: Date;
  createdBy: string;
  deleteNote?: string;
  description?: string;
  descriptionsEn?: string;
  exchangeRate: number;
  id_WS?: string;
  imageFile?: string;
  imageUrl?: string;
  importErrorMessage?: string;
  introduction?: string;
  introductionEn?: string;
  introductionKr?: string;
  investor: string;
  isActive?: boolean;
  isDelete?: boolean;
  isPush: boolean;
  link360?: string;
  // location?: string;
  thumbnail?: any;
  locationEn?: string;
  locationKr?: string;
  locationType?: string;
  logoFile?: string;
  logoUrl?: string;
  title: string;
  name: string;
  nameEn?: string;
  nameKr?: string;
  order: number;
  packageIndex: string;
  paymentInfo?: string;
  paymentInfoEn?: string;
  progress?: string;
  progressEn?: string;
  progressKr?: string;
  province?: string;
  segment?: string;
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
  utility?: string;
  utilityEn?: string;
  utilityKr?: string;
  views: string[];
  vnPayPaymentEn: string;
  vnPayPaymentVi: string;

  images: ImageUrl[];
  totalArea: number;
  handOverYear: number;
  yearBuited: Date;
  numberOfFloor: number;
  numberOfUnit: number;
  unitTypeRent: { id: string; name: string }[];
  unitTypeSell: { id: string; name: string }[];
  owner: string;
  managedBy: string;
  indoorAmenities: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  outdoorAmenities: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  nearBy: string[];
  location: Location;
  priceRange?: {
    saleMinPrice: number;
    saleMaxPrice: number;
    rentMinPrice: number;
    rentMaxPrice: number;
  };
  saleCount: number;
  rentCount: number;
}
