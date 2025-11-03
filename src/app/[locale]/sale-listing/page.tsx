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
import './style.css';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlockListingSale from '@/components/BlockListingSale/BlockListingSale';
import SectionContact from '@/components/SectionContact/SectionContact';
interface PageSaleListingProps {
  searchParams: ShortHomeRealEstateSearchModel;
}
const fetchSaleListing = async (filter: ListingSearchQueryDto) => {
  const listing = await postListingSearch({
    requestBody: {
      ...filter,
      type: listingType.sale,
    },
  });

  return {
    listing: (listing as any).data?.data,
    totalResult: (listing as any).data?.total,
  };
};

const getAllPropertyCoordinates = async (filter) => {
  const response = await propertyApiService.getAllPropertiesGeoSale(filter);
  return response.data;
};

const PageSaleListing: React.FC<PageSaleListingProps> = async ({ searchParams }) => {
  const size = 10;
  const curentPage = Number(searchParams.page) || 1;
  const filter = convertToHomeRealEstateSearchModel({ ...searchParams, s: size, page: curentPage });

  const saleCategories = ((await getEcomListingCategoryGetList({ type: listingType.sale })) as any)
    .data.data;
  const provinces = ((await getEcomEcomPlaceGetProvince()) as any).data?.data;
  const views = ((await getEcomListingViewGetList()) as any).data;
  const projects = ((await getEcomEcomProjectGetListProjectSearch()) as any).data;
  const inAmenities = ((await getEcomListingAmenitiesGetList({ type: 1 })) as any).data; // 1 = in
  const outAmenities = ((await getEcomListingAmenitiesGetList({ type: 2 })) as any).data; // 2 = out
  const funitureStatus = ((await getEcomInteriorGetList()) as any).data;

  const { listing, totalResult } = await fetchSaleListing({ ...filter });

  const allPropertyCoordinates = await getAllPropertyCoordinates(filter);
  const paramsvalue = convertTypeOfShortFilterListingParams(searchParams);
  const { page, ...paramOtherPage } = searchParams;
  const paramsString = getParamsStringFromObj(paramOtherPage);

  return (
    <>
      <Breadcrumb
        breadcrumbItems={[
          { path: '/', title: 'Trang chủ' },
          { path: '', title: 'Bán' },
        ]}
        hasBanner={false}
      />
      <div className='section-ban'>
        <div className='container'>
          <h1 className='section-ban__title'>Gửi bán Bất động sản Nam Long<br /><strong>Nhanh chóng, Bảo mật & Uy tín</strong></h1>
          <BlockListingSale
            allPropertyCoordinates={allPropertyCoordinates}
            totalResult={totalResult}
            paramsString={paramsString}
            currentPage={curentPage}
            pageSize={size}
            searchParams={paramsvalue}
            type={listingType.sale}
            listing={listing}
            properties={saleCategories}
            projects={projects}
            provinces={provinces}
            views={views}
            inAmenities={inAmenities}
            outAmenities={outAmenities}
            funitureStatus={funitureStatus}
          />
        </div>
      </div>
      <SectionContact />
    </>
  );
};

export default PageSaleListing;
