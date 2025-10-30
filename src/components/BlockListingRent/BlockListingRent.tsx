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
import './BlockListingRent.css';
import TableResult from '../TableResult/TableResult';
import SidebarListingRent from '../SidebarListingRent/SidebarListingRent';

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

const BlockListingRent: FC<IProps> = ({
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
    <div className='block-common-listing'>
      <SidebarListingRent />
      <div className="block-common-listing__wrapper">
        <span className='block-common-listing__title'>{t('EcomHomePagePropertyForSale')}</span>
        <TableResult listings={listing} />
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

export default BlockListingRent;
