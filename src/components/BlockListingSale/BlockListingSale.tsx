'use client';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import { NAVIGATION } from '@/data/navigation';
import { listingType, removeDiacritics } from '@/libs/appconst';
import CoordinateModel from '@/models/commonModel/coordinateModel';
import { ShortHomeRealEstateSearchModel } from '@/models/homeRealEstateSearchModel/homeRealEstateSearchModel';
import Componentutil from '@/utils/componentUtil';
import { Pagination } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { FC } from 'react';
import './BlockListingSale.css';
import CardListing from '@/components/CardListing/CardListing';
import SidebarSale from '@/components/SidebarSale/SidebarSale';

export interface IProps {
  totalResult: number;
  listing: any;
  type: any;
  properties?: any;
  projects?: any;
  provinces?: any;
  views?: any;
  inAmenities?: any;
  outAmenities?: any;
  funitureStatus?: any;
  searchParams?: ShortHomeRealEstateSearchModel;
  paramsString?: string;
  currentPage: any;
  pageSize: any;
  allPropertyCoordinates: any;
}

const BlockListingSale: FC<IProps> = ({
  type,
  listing,
  properties = [],
  projects = [],
  provinces = [],
  views = [],
  inAmenities = [],
  outAmenities = [],
  funitureStatus = [],
  searchParams = {},
  totalResult = 0,
  paramsString,
  currentPage,
  pageSize,
  allPropertyCoordinates,
}) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');

  const getPropertyLink = (property) => {
    if (property) {
      let stringNotUniCode = removeDiacritics(property.title);
      let string = stringNotUniCode.replaceAll(/[^a-zA-Z ]/g, '').replaceAll(/ /g, '-');

      return `/property/${string + '-' + property.id}`;
    }
  };
  const handleMarkerClick = async (marker: CoordinateModel & { id?: string }) => {
    let property = properties.find((x) => x.id === marker.id);
    // let property = properties[0];
    if (!property && marker.id) {
      property = (await propertyApiService.getSimpleProperty(marker.id))?.data as any;
    }
    return property
      ? Componentutil.GetGoogleMapPopupContentString(
        getPropertyLink(property),
        property.imageThumbnailUrl,
        property.title,
        property.location?.formattedAddress,
        property.priceVnd,
        property.priceUsd,
        locale,
      )
      : '';
  };

  return (
    <div className='block-common-listingsale'>
      <SidebarSale
        searchParams={searchParams}
        type={type}
        properties={properties}
        projects={projects}
        provinces={provinces}
        views={views}
        inAmenities={inAmenities}
        outAmenities={outAmenities}
        funitureStatus={funitureStatus}
        className={''}
      />
      <div className="block-common-listingsale__wrapper">
        <span className='block-common-listingsale__title'>{t('EcomHomePagePropertyForSale')}</span>
        <div className='table-common-result table-common-result--sale'>
          {listing.map((item: any) => (
            <div key={item.id} className='table-common-result__cell'>
              <CardListing listing={item} />
            </div>
          ))}
        </div>
        {totalResult > 0 && (
          <div className="pagination-common">
            <Pagination
              current={currentPage}
              total={totalResult}
              pageSize={pageSize}
              showSizeChanger={false}
              itemRender={(page, itemtype, originalElement) => (
                <Link href={`${type === listingType.sale ? NAVIGATION.saleListing.href : NAVIGATION.rentListing.href}?${paramsString}&page=${page}`} legacyBehavior>{originalElement}</Link>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockListingSale;
