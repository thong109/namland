export interface Location {
  province: string;
  district: string;
  ward: string;
  formattedAddress?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface UserInfo {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}
interface ListingStatistic {
  totalViews: number;
  totalFavored: number;
  totalImages: number;
}
export default interface ListingModel {
  id: string;
  title: string;
  imageThumbnailUrl: string;
  imageThumnailUrl: string;
  location: Location;
  bedrooms: number;
  bathrooms: number;
  size: number;
  priceVnd: number;
  priceUsd: number;
  priceUsdM2?: number;
  priceVndM2?: number;
  priorityStatus: number;
  isFavourite: boolean;
  type: number;
  userInfo: UserInfo;
  createdBy: string;
  totalImage: number;
  listingStatistic: ListingStatistic;
  displayPriceType?: number;
}
