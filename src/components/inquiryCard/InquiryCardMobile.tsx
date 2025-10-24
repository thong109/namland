'use client';
import { listStatusProject, listStatusTicketFilter } from '@/libs/appconst';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { FC } from 'react';
export interface Props {
  item: any;
  gotoDetail: (id) => void;
}

const InquiryCardMobile: FC<Props> = ({ item, gotoDetail }) => {
  const { push } = useRouter();
  const t = useTranslations('webLabel');

  return (
    <>
      {/* Mobile */}
      <div className="round-sm col-span-1 mt-3 grid w-full grid-cols-12 bg-portal-card p-3 text-sm">
        <div
          className="col-span-12 mb-2 line-clamp-2 font-medium"
          onClick={gotoDetail ? () => gotoDetail(item.id) : undefined}
        >
          <span className="text-base">{item?.listing?.title}</span>
        </div>
        <div className="col-span-7 grid grid-cols-12 truncate">
          <span className="col-span-12 font-bold">
            {t('EcomTicketManagementInforPageSearchBarClientName')}:
          </span>
          <div className="col-span-12 truncate">
            <span className="col-span-1">{item.clientName ?? '--'}</span>
          </div>
          <div className="col-span-12 truncate">
            <span className="col-span-1">{item.phone ?? '--'}</span>
          </div>
          <div className="col-span-12 truncate">
            <span className="col-span-1">{item.email ?? '--'}</span>
          </div>
        </div>
        <div className="col-span-5 ml-2 grid grid-cols-12 justify-end truncate">
          <span className="col-span-12 font-bold">
            {t('EcomTicketManagementInforPageSearchBarUnitNo')}/
            {t('EcomTicketManagementInforPageSearchBarProject')}
          </span>
          <span className="col-span-12 truncate">
            {item?.property?.propertyCode ?? '--'}
            <br />
            {item.project?.projectName}
          </span>
        </div>
        <div className="col-span-12 mt-4 flex justify-between">
          <span>
            {listStatusProject.map(
              (type) =>
                type.id === item?.listing?.type && (
                  <label className="rounded-lg bg-portal-gray-1 p-2">{t(type?.name)}</label>
                ),
            )}
          </span>
          <span>
            {listStatusTicketFilter.map(
              (status) =>
                status.value === item.ticketStatus && (
                  <label className={`${status.classCode}`}>{t(status?.name)}</label>
                ),
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default InquiryCardMobile;
