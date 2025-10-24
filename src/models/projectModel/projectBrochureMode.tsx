export interface ProjectBrochureModel {
  id: string;
  createdAt: Date;
  createdBy: string;
  description?: string;
  descriptionEn: string;
  descriptionVi: string;
  documentFile?: string;
  documentUrl?: string;
  documentUrls: {
    name: string;
    url: string;
  }[];
  isActive: boolean;
  isDelete: boolean;
  order: number;
  projectId: string;
  showForCustomer: boolean;
  title: string;
  titleEn: string;
  updatedAt: Date;
  updatedBy: string;
}
