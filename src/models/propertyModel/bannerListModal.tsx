export interface BannerListModel {
  id: string;
  status?: Boolean;
  title: string;
  switchAfterSeconds: number;
  size: string[];
  startDate?: Date;
  endDate?: Date;
  position?: any;
  userInfo?: any;
  createdBy?: any;
  createdAt: Date;
}
export interface BannerDetail {
  id: string;
  attachments?: BannerAttachments[];
  title: string;
  switchAfterSeconds: number;
  size: string[];
  startDate?: Date;
  endDate?: Date;
  position?: any;
  userInfo?: any;
  createdBy?: string;
  createdAt?: Date;
  status?: Boolean;
}
export interface BannerAttachments {
  bannerId?: string;
  bannerImageUrl?: string;
  bannerLink: string;
  bannerName: string;
  sequence?: number;
}
