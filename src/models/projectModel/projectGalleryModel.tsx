export interface ProjectGalleryModel {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  isDelete: boolean;
  imageUrls: string[];
  imageNames: string[];
  imageFiles?: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  titleEn: string;
  descriptionEn: string;
  avatarUrl?: string;
  avatarFile?: string;
}
