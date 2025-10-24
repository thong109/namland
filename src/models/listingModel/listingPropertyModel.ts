import { HandOverStatusEnum } from '@/ecom-sadec-api-client';
import { LegalStatusEnum } from '@/libs/enums/LegalStatusEnum';

interface ImageUrl {
  id: string;
  url: string;
  name: string | null;
}

interface Amenity {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
}

interface SaleContract {
  id: string;
  url: string;
  name: string;
  mimeType: string;
}

interface CertificateOfTitle {
  id: string;
  url: string;
  name: string;
  mimeType: string;
}

interface Project {
  id: string;
  name: string;
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

interface UserInfo {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  contactNumber: string;
}
interface Views {
  id: string;
  name: string;
}
export default interface Listing {
  agentRating?: any;
  imageUrls: ImageUrl[];
  imageThumbnailUrls?: ImageUrl[];
  description: string;
  cartParkingLot: number;
  yearBuilted: string;
  amenities: Amenity[];
  inDoorAmenities: Amenity[];
  outDoorAmenities: Amenity[];
  saleContracts: SaleContract[];
  certificateOfTitles: CertificateOfTitle[];
  listingId: string;
  unitCode: string;
  isShowUnitCode: boolean;
  project: Project;
  handOverStatus: HandOverStatusEnum;
  legalStatus: LegalStatusEnum;
  views: Views[];
  listingCategory: {
    id: string;
    code: string;
    name: string;
  };
  id: string;
  inquiryId?: string;
  title: string;
  imageThumbnailUrl: string;
  location: Location;
  bedrooms: number;
  bathrooms: number;
  size: number;
  priceVnd: number;
  priceUsd: number;
  displayPriceType?: number;
  priceVndM2?: number;
  priceUsdM2?: number;
  priorityStatus: number;
  isFavourite: boolean;
  type: number;
  userInfo: UserInfo;
  createdBy: string;
  totalImage: number;
  imageThumnailUrl?: string;
  videoLink: string;
  virtualTour: string;
  shortDescription?: string;
  nearBy: string[];
  blockTower?: string;
  floor?: string;
  unit?: {
    id: string;
    unitNo: string;
  };
  interior?: {
    id: string;
    interiorCode: string;
    interiorName: string;
  };
}
