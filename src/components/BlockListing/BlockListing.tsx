'use client';
import IconButton from '@/_components/IconButton/IconButton';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import IconCloseFilter from '@/assets/icon/icon-close-filter.svg';
import IconFilter from '@/assets/icon/icon-filter.svg';
import GoogleMap from '@/components/GoogleMap';
import { NAVIGATION } from '@/data/navigation';
import { listingType, removeDiacritics } from '@/libs/appconst';
import LocationConstant from '@/libs/constants/locationConstant';
import CoordinateModel from '@/models/commonModel/coordinateModel';
import { ShortHomeRealEstateSearchModel } from '@/models/homeRealEstateSearchModel/homeRealEstateSearchModel';
import Componentutil from '@/utils/componentUtil';
import { Pagination, Switch, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import './BlockListing.css';
import TableResult from './TableResult';
import SidebarListing from '@/components/SidebarListing/SidebarListing';

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

const BlockListing: FC<IProps> = ({
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
  const [showFiltter, setIsShowFiltter] = useState(false);
  const [showingMap, setShowingMap] = useState<boolean>(false);
  useEffect(() => {
    setIsShowFiltter(false);
  }, []);
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
    <div className='block-common-listing'>
      <SidebarListing
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
      <div className="block-common-listing__wrapper">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex w-full flex-col items-center justify-center">
            <Typography className="text-3xl font-bold">{t('SearchResult')}</Typography>
            <div>
              {t('EcomSearchPageRentalListingMap')}{' '}
              <Switch
                className="bg-portal-gray-3"
                checked={showingMap}
                onChange={(e) => changeViewMode(e)}
              ></Switch>
            </div>
          </div>
          <div className="lg:hidden">
            <IconButton
              onClick={() => setIsShowFiltter(!showFiltter)}
              label={<Image alt="" width={20} height={20} src={IconFilter.src} />}
            />
          </div>
        </div>
        <div className={`${showingMap ? 'h-[800px]' : 'h-[0px]'} relative mt-4 w-full`}>
          {renderMaps()}
        </div>
        {!showingMap && (
          <>
            <TableResult listings={listing} />
            {totalResult > 0 && (
              <div className="mt-2">
                <div className="flex w-full justify-center pb-7">
                  <Pagination
                    current={currentPage}
                    total={totalResult}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    itemRender={(page, itemtype, originalElement) => (
                      <Link
                        legacyBehavior
                        href={`${type === listingType.sale ? NAVIGATION.saleListing.href : NAVIGATION.rentListing.href}?${paramsString}&page=${page}`}
                      >
                        {originalElement}
                      </Link>
                    )}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {showFiltter && (
        <>
          <div className="fixed inset-0 z-20 bg-gray-500 opacity-50"></div>
          <div className="absolute left-0 right-0 z-30 flex justify-center border-b-2 border-yellow-500 bg-white pb-4">
            <div className="w-full">
              <div className="absolute right-0 z-[31]">
                <IconButton
                  className="bg-transparent"
                  onClick={() => setIsShowFiltter(!showFiltter)}
                  label={<Image alt="" width={20} height={20} src={IconCloseFilter.src} />}
                />
              </div>
              <SidebarListing
                searchParams={searchParams}
                type={type}
                properties={properties}
                provinces={provinces}
                views={views}
                inAmenities={inAmenities}
                outAmenities={outAmenities}
                funitureStatus={funitureStatus}
                onOffFiltter={() => setIsShowFiltter(!showFiltter)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlockListing;
