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

const ContactCardMobile: FC<Props> = ({ item, gotoDetail }) => {
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
        <div className="col-span-12 mb-1 line-clamp-2 flex space-x-1">
          <span className="font-medium">{t('EcomReponsiveViewMessage')}:</span>{' '}
          <span>{item?.message}</span>
        </div>
        <div className="col-span-12 flex truncate">
          <div className="runcate">
            <span className="font-bold">{t('EcomContactListInfoPageSearchBarSendTo')}:</span>
          </div>
          <div className="grid grid-cols-12 truncate">
            <span className="col-span-12 ml-1 truncate">
              {item?.clientName ?? '--'} - {convertPhoneNumber84To0(item?.phone)}
            </span>
            <span className="col-span-12 ml-1 truncate">{item?.email}</span>
          </div>{' '}
        </div>

        <div className="col-span-12 mt-0.5 flex space-x-1 truncate">
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

export default ContactCardMobile;
