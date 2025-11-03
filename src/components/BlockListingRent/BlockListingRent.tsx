'use client';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import { NAVIGATION } from '@/data/navigation';
import { listingType, removeDiacritics } from '@/libs/appconst';
import GoogleMap from '@/components/GoogleMap';
import LocationConstant from '@/libs/constants/locationConstant';
import CoordinateModel from '@/models/commonModel/coordinateModel';
import { ShortHomeRealEstateSearchModel } from '@/models/homeRealEstateSearchModel/homeRealEstateSearchModel';
import Componentutil from '@/utils/componentUtil';
import { Pagination, Switch } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { FC, useState } from 'react';
import './BlockListingRent.css';
import CardListingRent from '@/components/CardListing/CardListingRent';
import SidebarRent from '../SidebarRent/SidebarRent';

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
  const [showingMap, setShowingMap] = useState<boolean>(false);
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
  const changeViewMode = (e) => {
    setShowingMap(e);
  };
  const renderMaps = () => {
    return (
      <GoogleMap
        zoom={12}
        initCenter={LocationConstant.PMHCoordinate}
        isMarker={true}
        listMarker={allPropertyCoordinates}
        useMarkerCluster
        markerClickedContent={handleMarkerClick}
      />
    );
  };
  return (
    <div className='block-common-listingrent'>
      <div className='block-common-listingrent__filter'>
        <div className='container'>
          <div className='block-common-listingrent__filter-wrapper'>
            <SidebarRent />
            <div className='switch-common-map'>
              <span className='switch-common-map__label'>Hiển thị bản đồ</span>
              <Switch className='switch-common-map__control' checked={showingMap} onChange={(e) => changeViewMode(e)}></Switch>
            </div>
          </div>
          <div className='block-common-listingrent__filter-analyze'>
            <div className='block-common-listingrent__analyze-label'>Có 79 kết quả</div>
            <div className='select-common-sortby'>
              <span className='select-common-sortby__label'>Sắp xếp:</span>
              <div className='select-common-sortby__control'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='block-common-listingrent__wrapper'>
        <div className='container'>
          <div className={`block-common-listingrent__map ${showingMap ? `is-state-active` : ``}`}>{renderMaps()}</div>
          {!showingMap && (
            <>
              <div className='table-common-result table-common-result--rent'>
                {listing.map((item: any) => (
                  <div key={item.id} className='table-common-result__cell'>
                    <CardListingRent listing={item} />
                  </div>
                ))}
              </div>
              {totalResult > 0 && (
                <div className='pagination-common'>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockListingRent;
