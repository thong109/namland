export interface ProjectMasterPlanModel {
  id: string;
  avatarFile: null;
  avatarUrl: null;
  createdAt: Date;
  createdBy: string;
  description: string;
  descriptionEn?: string;
  imageFiles: string;
  imageUrls: string[];
  isActive: boolean;
  isDelete: boolean;
  order: number;
  projectId: string;
  title: string;
  titleEn: string;
  titleKr: string;
  updatedAt: Date;
  updatedBy: string;
}
