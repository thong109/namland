'use client';
import { listPackage, listPriotyStatusFilter, renderDateTime } from '@/libs/appconst';
import { PropertyStatus } from '@/models/propertyModel/propertyDetailModel';
import { PropertyListModel } from '@/models/propertyModel/propertyListModel';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FC } from 'react';

export interface Props {
  property: PropertyListModel;
  onGoDetail: (id: string) => void;
}

const PropetyCardMobile: FC<Props> = ({ property, onGoDetail }) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const renderApprovalStatus = (item: PropertyListModel) => {
    let approvalStatus = listPriotyStatusFilter.find((x) => x.value === item.status)?.label;

    let textColor = '';
    let backgroundColor = '';
    let borderColor = '';

    switch (item?.status) {
      case PropertyStatus.Draft: {
        textColor = 'text-[#0C1419]'; //đen
        backgroundColor = 'bg-transparent';
        borderColor = 'border-[#FFD14B]';
        break;
      }
      case PropertyStatus.WaitingForApproval: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#F2994A]'; // cam
        borderColor = '';
        break;
      }
      case PropertyStatus.approved: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#1178F5]'; // xanh dương
        borderColor = '';
        break;
      }
      case PropertyStatus.Cancelled: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Published: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#27AE60]'; // cam
        borderColor = '';
        break;
      }
      case PropertyStatus.Expired: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Rejected: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Takedown: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#FEDB71]'; // vàng
        borderColor = '';
        break;
      }
      case PropertyStatus.TakeDownLeased:
      case PropertyStatus.TakeDownSold: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#7D35B5]'; // tím
        borderColor = '';
        break;
      }
      default: {
        break;
      }
    }
    return (
      <label
        className={`p-1 ${textColor} ${backgroundColor} border ${borderColor} rounded-md text-[10px]`}
      >
        {t(approvalStatus)}
      </label>
    );
  };
  return (
    <>
      {/* Mobile */}
      <div className="col-span-12 mb-5 flex h-[140px] bg-portal-card lg:hidden">
        <div className="relative h-full w-[35%] flex-shrink-0 overflow-hidden">
          <Image
            alt={`${property?.imageThumbnailUrls[0]?.name}`}
            width={160}
            height={140}
            src={`${property?.imageThumbnailUrls[0]?.url}`}
          />
          <div className="absolute left-[5px] top-[5px] rounded bg-portal-gray-2 px-[3px] text-[10px]">
            {listPackage.map((item) => item.id === property.priorityStatus && comm(item.name))}
          </div>
        </div>
        <div className="ml-[5px] mr-1 flex h-full w-[65%] flex-col items-start">
          <div className="w-full py-[7px]">
            <span
              className="line-clamp-2 text-xs font-semibold"
              onClick={() => onGoDetail(property.id)}
            >
              {property?.title}
            </span>
          </div>
          <div className="flex h-1/6 w-full items-center justify-between text-xs">
            <span className="mr-1">{t('EcomMemberPageListViewCreatedDate')}:</span>
            <span>{property?.createdAt ? renderDateTime(property?.createdAt) : '--'}</span>
          </div>
          <div className="flex h-1/6 w-full items-center justify-between text-xs">
            <span className="mr-1">{t('EcomPropertyListingPageListViewCreateBy')}:</span>
            <span>{`${property?.userInfo?.firstName} ${property?.userInfo?.lastName}`}</span>
          </div>
          <div className="flex w-full items-center justify-between text-xs">
            <span className="mr-1">{t('EcomPropertyListingPageSearchBarPublishedDate')}:</span>
            <span className="justify-end">
              {property.publishedDate ? renderDateTime(property.publishedDate) : '--'}
            </span>
          </div>

          <div className="flex h-1/6 w-full items-center justify-between">
            <span className="text-xs">{t('EcomPropertyListingPageListViewStatus')}</span>

            <span>{renderApprovalStatus(property)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropetyCardMobile;
