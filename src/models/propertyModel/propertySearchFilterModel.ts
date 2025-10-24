export interface PropertySearchFilterModel {
  keyword?: string;
  projectid?: string[];
  bedrooms?: string[];
  Province?: string;
  District?: string;
  Ward?: string;
  categoryIds?: string[];
  amenitiesIds?: string[];
  type?: number;
  priceRange?: number[];
  fromPriceUsd?: number;
  toPriceUsd?: number;
  fromPriceVnd?: number;
  toPriceVnd?: number;

  crescentMallDistance?: number[];
  scVivoDistance?: number[];
  emasiNamLongDistance?: number[];
  primrarySchoolREnaissanceDistance?: number[];
  agencyId?: string;
  showFilter?: boolean;
  sizeRange?: number[];
  fromSize?: number;
  toSize?: number;
}
