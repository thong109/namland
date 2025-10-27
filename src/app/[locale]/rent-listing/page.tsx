'use server';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import {
  getEcomEcomPlaceGetProvince,
  getEcomEcomProjectGetListProjectSearch,
  getEcomInteriorGetList,
  getEcomListingAmenitiesGetList,
  getEcomListingCategoryGetList,
  getEcomListingViewGetList,
  ListingSearchQueryDto,
  postListingSearch,
} from '@/ecom-sadec-api-client';
import { getParamsStringFromObj, listingType } from '@/libs/appconst';
import {
  convertToHomeRealEstateSearchModel,
  convertTypeOfShortFilterListingParams,
  ShortHomeRealEstateSearchModel,
} from '@/models/homeRealEstateSearchModel/homeRealEstateSearchModel';
import FooterContactForm from '../_components/FooterContactForm/FooterContactForm';
import BlockListing from '../_components/SearchBlockListing/BlockListing';
interface PageRentListingProps {
  searchParams: ShortHomeRealEstateSearchModel;
}
const fetchRentListing = async (filter: ListingSearchQueryDto) => {
  const listing = await postListingSearch({
    requestBody: {
      ...filter,
      type: listingType.rent,
    },
  });

  return {
    listing: (listing as any).data?.data,
    totalResult: (listing as any).data?.total,
  };
};

const getAllPropertyCoordinates = async (filter) => {
  const response = await propertyApiService.getAllPropertiesGeoRent(filter);
  return response.data;
};

const PageRentListing: React.FC<PageRentListingProps> = async ({ searchParams }) => {
  const size = 10;
  const curentPage = Number(searchParams.page) || 1;
  const filter = convertToHomeRealEstateSearchModel({ ...searchParams, s: size, page: curentPage });

  const rentCategories = ((await getEcomListingCategoryGetList({ type: listingType.rent })) as any)
    .data.data;
  const provinces = ((await getEcomEcomPlaceGetProvince()) as any).data?.data;
  const views = ((await getEcomListingViewGetList()) as any).data;
  const projects = ((await getEcomEcomProjectGetListProjectSearch()) as any).data;
  const inAmenities = ((await getEcomListingAmenitiesGetList({ type: 1 })) as any).data; // 1 = in
  const outAmenities = ((await getEcomListingAmenitiesGetList({ type: 2 })) as any).data; // 2 = out
  const funitureStatus = ((await getEcomInteriorGetList()) as any).data;
  const { listing, totalResult } = await fetchRentListing(filter);
  const paramsvalue = convertTypeOfShortFilterListingParams(searchParams);
  const { page, ...paramOtherPage } = searchParams;
  const paramsString = getParamsStringFromObj(paramOtherPage);
  const allPropertyCoordinates = await getAllPropertyCoordinates(filter);

  return (
    <>
      <BlockListing
        allPropertyCoordinates={allPropertyCoordinates}
        paramsString={paramsString}
        totalResult={totalResult}
        currentPage={curentPage}
        pageSize={size}
        searchParams={paramsvalue}
        type={listingType.rent}
        listing={listing}
        properties={rentCategories}
        projects={projects}
        provinces={provinces}
        views={views}
        inAmenities={inAmenities}
        outAmenities={outAmenities}
        funitureStatus={funitureStatus}
      />
      <FooterContactForm />
    </>
  );
};

export default PageRentListing;
