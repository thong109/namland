export interface PropertyListModel {
  id: string;
  imageThumbnailUrl?: string;
  title: string;
  type: number;
  size: string[];
  publishedDate?: Date;
  views?: any;
  status: any;
  userInfo?: any;
  lastRejectedLog?: any;
  priorityStatus: number;
  lastApprovedLog?: any;
  createdAt?: string;
  listingStatistic?: any;
  location?: any;
  priceVnd?: number;
  priceVndM2?: number;
  priceUsd?: number;
  priceUsdM2: number;
  imageThumbnailUrls?: any[];
  actualPrice?: number;
}
