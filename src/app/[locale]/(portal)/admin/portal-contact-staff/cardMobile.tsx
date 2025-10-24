'use client';
import { convertPhoneNumber84To0 } from '@/libs/helper';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { FC, useEffect } from 'react';
export interface Props {
  item: any;
  gotoDetail: (id) => void;
}

const ContactStaffCardMobile: FC<Props> = ({ item, gotoDetail }) => {
  const { push } = useRouter();
  const t = useTranslations('webLabel');

  useEffect(() => {}, []);
  return (
    <>
      {/* Mobile */}
      <div
        onClick={gotoDetail ? () => gotoDetail(item.id) : undefined}
        className="round-sm col-span-1 mt-3 grid w-full grid-cols-12 bg-portal-card p-3 text-sm"
      >
        <div className="col-span-12 mb-2 line-clamp-2 font-medium">
          <span>
            {t('EcomReponsiveViewMessage')}: {item?.message}
          </span>
        </div>
        <div className="col-span-6 grid grid-cols-12 truncate">
          <span className="col-span-12 font-bold">{t('EcomTicketManagementInforOwner')}:</span>
          <div className="col-span-12 ml-1 truncate">
            <span className="col-span-1">{item.ownerBrokerClientName ?? '--'}</span>
          </div>
          <div className="col-span-12 ml-1 truncate">
            <span className="col-span-1">
              {convertPhoneNumber84To0(item.ownerBrokerPhone) ?? '--'}
            </span>
          </div>
        </div>
        <div className="col-span-6 grid grid-cols-12 justify-end truncate">
          <span className="col-span-12 font-bold">
            {t('EcomContactListInfoPageSearchBarClientName')}:
          </span>
          <span className="col-span-12 ml-1 truncate">{item?.clientName ?? '--'}</span>
          <span className="col-span-12 ml-1 truncate">{convertPhoneNumber84To0(item?.phone)}</span>
        </div>{' '}
        <div className="col-span-12 flex space-x-1 truncate">
          <span className="truncate font-bold">
            {t('EcomContactListInfoPageListViewCreatedDate')}:
          </span>
          <span className="truncate">
            {dayjs(item?.createdAt).format('HH:mm, DD/MM/YYYY') ?? '--'}
          </span>
        </div>
      </div>
    </>
  );
};

export default ContactStaffCardMobile;
