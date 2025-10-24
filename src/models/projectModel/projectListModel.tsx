export interface ProjectListModel {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  nameKr: string;
  locationType?: string;
  address: string;
  segment?: string;
  order: number;
  logoUrl?: string;
  logoFile?: string;
  imageUrl?: string;
  imageFile?: string;
  listingCount: number;
}
