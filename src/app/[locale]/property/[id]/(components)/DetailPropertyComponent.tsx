'use-client';
import IconArea from '@/assets/icon/icon-area.svg';
import IconBathRoom from '@/assets/icon/icon-bathroom.svg';
import IconBedRoom from '@/assets/icon/icon-bedroom.svg';
import IconHandover from '@/assets/icon/icon-handoverStatus.svg';
import IconLegal from '@/assets/icon/icon-legalstatus.svg';
import IconParking from '@/assets/icon/icon-parkingslot.svg';
import IconPrice from '@/assets/icon/icon-price.svg';
import IconProject from '@/assets/icon/icon-project.svg';
import IconPropertyStatus from '@/assets/icon/icon-propertyStatus.svg';
import IconPropertyType from '@/assets/icon/icon-propertyType.svg';
import IconUnit from '@/assets/icon/icon-unit.svg';
import IconView from '@/assets/icon/icon-view.svg';
import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import * as _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import { isMobile } from 'react-device-detect';
const DetaildataComponent = ({ data }: any) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {data?.isShowUnitCode ? (
          <>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconProject.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomHomePageFooterProject')}:
                </span>
              </div>
              <span className="w-[48%] font-normal">{data?.project?.name}</span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconPrice.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailPrice')}:
                </span>
              </div>
              <span className="w-[48%] font-normal">
                <NumberFormatPrice
                  value={locale == 'vi' ? data?.priceVnd : data?.priceUsd}
                ></NumberFormatPrice>
                {data?.type == 1 ? '' : t('/mo')}
              </span>
            </div>
            {data?.isShowUnitCode ? (
              <div className="flex border-b py-2">
                <div className="flex w-[52%]">
                  <img src={IconUnit.src} className="mr-2 h-6 w-6"></img>
                  <span className="font-semibold text-primaryColor">
                    {t('EcomPropertyDetailPageDetailUnit')}:
                  </span>
                </div>

                <span className="w-[48%] font-normal">{data?.unitCode}</span>
              </div>
            ) : null}
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconArea.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailHomeArea')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.size + ' ' + ''}m<sup>2</sup>
              </span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconPropertyStatus.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailPropertyType')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">{data?.listingCategory?.name}</span>
            </div>
            <div className={`flex border-b py-2 pb-1`}>
              <div className="flex w-[52%]">
                <img src={IconHandover.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailHandoverStatus')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.handOverStatus
                  ? t('EcomPropertyDetailPageDetailHandedOver')
                  : t('EcomPropertyDetailPageDetailWaitingForHandOver')}
              </span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconBedRoom.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailBedrooms')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">{data?.bedrooms ? data?.bedrooms : 0}</span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconLegal.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailLegalStatus')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.legalStatus
                  ? t('EcomPropertyDetailPageDetailPinkBookIssued')
                  : t('EcomPropertyDetailPageDetailWaitingForPinkBook')}
              </span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconBathRoom.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailBathrooms')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">{data?.bathrooms ? data.bathrooms : 0}</span>
            </div>
            <div className={`flex border-b py-2 pb-1`}>
              <div className="flex w-[52%]">
                <img src={IconPropertyType.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailPropertyStatus')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.type
                  ? t('EcomPropertyListingPageListViewForSale')
                  : t('EcomPropertyListingPageListViewForRent')}
              </span>
            </div>
            <div className={`flex border-b py-2`}>
              <div className="flex w-[52%]">
                <img src={IconParking.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailCarParkingSlot')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.cartParkingLot ? data?.cartParkingLot : 0}
              </span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconView.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyListingDetailPagePropertyInformationHouseDirection')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.views &&
                  _.map(data?.views, (item, index) => {
                    return <div key={item?.id}>{item?.name}</div>;
                  })}
              </span>
            </div>
            <div className="flex py-2">
              <div className="flex w-[52%]">
                <img src={IconView.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyListingDetailPagePropertyInformationBalconyDirection')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.views &&
                  _.map(data?.viewBalconies, (item, index) => {
                    return <div key={item?.id}>{item?.name}</div>;
                  })}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconProject.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomHomePageFooterProject')}:
                </span>
              </div>
              <span className="w-[48%] font-normal">{data?.project?.name}</span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconPrice.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailPrice')}:
                </span>
              </div>
              <span className="w-[48%] font-normal">
                <NumberFormatPrice
                  value={locale == 'vi' ? data?.priceVnd : data?.priceUsd}
                ></NumberFormatPrice>
                {data?.type == 1 ? '' : t('/mo')}
              </span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconPropertyStatus.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailPropertyType')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">{data?.listingCategory?.name}</span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconArea.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailHomeArea')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.size + ' ' + ''}m<sup>2</sup>
              </span>
            </div>

            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconBedRoom.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailBedrooms')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">{data?.bedrooms ? data?.bedrooms : 0}</span>
            </div>
            <div className={`flex border-b py-2 pb-1`}>
              <div className="flex w-[52%]">
                <img src={IconHandover.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailHandoverStatus')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.handOverStatus
                  ? t('EcomPropertyDetailPageDetailHandedOver')
                  : t('EcomPropertyDetailPageDetailWaitingForHandOver')}
              </span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconBathRoom.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailBathrooms')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">{data?.bathrooms ? data.bathrooms : 0}</span>
            </div>
            <div className="flex border-b py-2">
              <div className="flex w-[52%]">
                <img src={IconLegal.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailLegalStatus')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.legalStatus
                  ? t('EcomPropertyDetailPageDetailPinkBookIssued')
                  : t('EcomPropertyDetailPageDetailWaitingForPinkBook')}
              </span>
            </div>
            <div className={`flex border-b py-2`}>
              <div className="flex w-[52%]">
                <img src={IconParking.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailCarParkingSlot')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.cartParkingLot ? data?.cartParkingLot : 0}
              </span>
            </div>
            <div className={`flex border-b py-2 pb-1`}>
              <div className="flex w-[52%]">
                <img src={IconPropertyType.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyDetailPageDetailPropertyStatus')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.type
                  ? t('EcomPropertyListingPageListViewForSale')
                  : t('EcomPropertyListingPageListViewForRent')}
              </span>
            </div>
            <div className={` ${isMobile ? 'border-b' : ''} flex py-2`}>
              <div className="flex w-[52%]">
                <img src={IconView.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyListingDetailPagePropertyInformationHouseDirection')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.views &&
                  _.map(data?.views, (item, index) => {
                    return <div key={item?.id}>{item?.name}</div>;
                  })}
              </span>
            </div>
            <div className="flex py-2">
              <div className="flex w-[52%]">
                <img src={IconView.src} className="mr-2 h-6 w-6"></img>
                <span className="font-semibold text-primaryColor">
                  {t('EcomPropertyListingDetailPagePropertyInformationBalconyDirection')}:
                </span>
              </div>

              <span className="w-[48%] font-normal">
                {data?.views &&
                  _.map(data?.viewBalconies, (item, index) => {
                    return <div key={item?.id}>{item?.name}</div>;
                  })}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DetaildataComponent;
