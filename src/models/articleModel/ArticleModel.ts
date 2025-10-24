export default interface ArticleModel {
  id: string;
  lang: string;
  category: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  contentFrom: string;
  linkContent?: string | null;
  content: string;
  shareLink: string | null;
  agencyIds: (string | null)[];
  isPublic: boolean;
  tags: string[] | null;
  isActive: boolean;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  titleEn: string | null;
  contentEn: string | null;
  shareLinkEn: string | null;
  descriptionEn: string | null;
  postAt: string;
  isPush: boolean;
  imageFile: string | null;
}
