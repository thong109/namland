'use client';
import notifyApiService from '@/apiServices/externalApiServices/apiNotification';
import { NotificationTypeEnum, NotifyType, readStatus, renderDateTime } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { NotificationListModel } from '@/models/propertyModel/notificationModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { FC, useEffect, useState } from 'react';
import './style.css';

const NotifyComponent: FC = () => {
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();
  const { push } = useRouter();
  const [data, setData] = useState<any>();
  const [selectedIndex, setSelectedIndex] = useState<number>(NotificationTypeEnum.LISTING);

  useEffect(() => {
    fetchData(NotificationTypeEnum.LISTING);
  }, [userInfo?.id]);

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
    fetchData(tabKey);
  };

  const fetchData = async (tabKey) => {
    const items = await notifyApiService.getListNotify({ notiType: tabKey });
    const count = await notifyApiService.getCountUnRead();
    const dataReceive = {
      items: items,
      count: count,
    };
    setData(dataReceive);
  };

  const markReadNotify = async (id: string) => {
    await notifyApiService.markReadNotify(id);
  };

  const gotoDetail = async (item: NotificationListModel) => {
    switch (item?.type) {
      case NotifyType.CREATE_LISTING_SUCCESS_CUSTOMER:
      case NotifyType.LISTING_APPROVED_OWNER:
      case NotifyType.LISTING_REJECTED_OWNER:
      case NotifyType.LISTING_EXPIRED_OWNER:
      case NotifyType.LISTING_TAKEDOWN_OWNER:
        item.readStatus != readStatus.readed && markReadNotify(item.id);
        if (userInfo?.type === UserTypeConstant.Salesman) {
          push(`/admin/staff-properties/listing=${item.objectId}`);
        } else {
          push(`/client/tin-dang-cua-toi/listing=${item.objectId}`);
        }

        break;
      case NotifyType.CREATE_INQUIRY_CUSTOMER:
      case NotifyType.CREATE_SITEVISIT_CUSTOMER:
      case NotifyType.CONVERSATION:
        item.readStatus != readStatus.readed && markReadNotify(item.id);
        if (userInfo?.type === UserTypeConstant.Salesman) {
          push(`/admin/client-inquiry-admin/${item.objectId}`);
        } else {
          push(`/client/client-inquiry/${item.objectId}`);
        }

        break;
      case NotifyType.TOP_UP_COMPLETED:
        item.readStatus != readStatus.readed && markReadNotify(item.id);
        if (userInfo?.type === UserTypeConstant.Salesman) {
          push(`/admin/transaction-management`);
        } else {
          push(`/client/lich-su-giao-dich`);
        }
        break;
      case NotifyType.PURCHASED_SUCCESSFULLY:
        item.readStatus != readStatus.readed && markReadNotify(item.id);
        if (userInfo?.type === UserTypeConstant.Salesman) {
          push(`/admin/staff-properties`);
        } else {
          push(`/client/tin-dang-cua-toi`);
        }
        break;
      default:
        item.readStatus != readStatus.readed && markReadNotify(item.id);
    }
    fetchData(selectedIndex);
  };

  const renderItemNotify = (item: NotificationListModel) => {
    let textColor = '';
    let backgroundColor = '';
    switch (item?.type) {
      case NotifyType.CREATE_LISTING_SUCCESS_CUSTOMER: {
        textColor = 'text-[#1E854A]';
        backgroundColor = 'bg-[#FFD14B]';

        break;
      }
      case NotifyType.LISTING_APPROVED_OWNER: {
        textColor = 'text-[#0073F7]';
        backgroundColor = 'bg-[#E5F1FF]';

        break;
      }
      case NotifyType.LISTING_REJECTED_OWNER: {
        textColor = 'text-portal-orange';
        backgroundColor = 'bg-portal-orange-1';

        break;
      }
      case NotifyType.LISTING_EXPIRED_OWNER:
      case NotifyType.CREATE_INQUIRY_CUSTOMER:
      case NotifyType.CREATE_SITEVISIT_CUSTOMER:
      case NotifyType.LISTING_TAKEDOWN_OWNER:
      default: {
        textColor = 'text-[#FFD14B]';
        backgroundColor = 'bg-[#FFD14B]';

        break;
      }
    }

    return (
      <div
        onClick={() => gotoDetail(item)}
        key={item?.id}
        className="mb-2 mt-2 w-full rounded-xl border bg-[#FFFFFF] p-2"
      >
        <div className="grid grid-cols-12">
          <div className="col-span-11 justify-start">{item?.title}</div>
          <div className="col-span-1">
            {item?.readStatus === readStatus.new && (
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-500"></span>
            )}
          </div>
          <div className="col-span-12">
            <div
              className="line-clamp-3 py-1 text-xs font-normal"
              dangerouslySetInnerHTML={{
                __html: item?.body?.replace(/\n/g, '<br>') ?? ' ',
              }}
            />
          </div>
          <div className="col-span-12">
            <label className="py-1 text-xs font-normal">{renderDateTime(item?.createdAt)}</label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto border-b border-gray-200 text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <ul className="custom-scrollbar flex flex-nowrap overflow-x-auto whitespace-nowrap rounded-xl bg-[#F8F8F8] p-1">
        <li className="me-2">
          <a
            onClick={() => changTabSelect(NotificationTypeEnum.LISTING)}
            className={`${selectedIndex === NotificationTypeEnum.LISTING ? 'color-blue-600 border-b-2 border-blue-600 bg-[#FFD14B] p-1 font-semibold text-white' : ''} inline-block rounded-2xl border-b-2 border-transparent p-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            {t('LISTING')}
          </a>
        </li>
        <li className="me-2">
          <a
            onClick={() => changTabSelect(NotificationTypeEnum.CONVERSATION)}
            className={`${selectedIndex === NotificationTypeEnum.CONVERSATION ? 'color-blue-600 border-b-2 border-blue-600 bg-[#FFD14B] p-1 font-semibold text-white' : ''} inline-block rounded-2xl border-b-2 border-transparent p-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            {t('CONVERSATION')}
          </a>
        </li>
        <li className="me-2">
          <a
            onClick={() => changTabSelect(NotificationTypeEnum.TOPUP)}
            className={`${selectedIndex === NotificationTypeEnum.TOPUP ? 'color-blue-600 border-b-2 border-blue-600 bg-[#FFD14B] p-1 font-semibold text-white' : ''} inline-block rounded-2xl border-b-2 border-transparent p-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            {t('TOPUP')}
          </a>
        </li>
        <li className="me-2">
          <a
            onClick={() => changTabSelect(NotificationTypeEnum.PACKAGE)}
            className={`${selectedIndex === NotificationTypeEnum.PACKAGE ? 'color-blue-600 border-b-2 border-blue-600 bg-[#FFD14B] p-1 font-semibold text-white' : ''} inline-block rounded-2xl border-b-2 border-transparent p-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            {t('PACKAGE')}
          </a>
        </li>
        <li className="me-2">
          <a
            onClick={() => changTabSelect(NotificationTypeEnum.PUSH)}
            className={`${selectedIndex === NotificationTypeEnum.PUSH ? 'color-blue-600 border-b-2 border-blue-600 bg-[#FFD14B] p-1 font-semibold text-white' : ''} inline-block rounded-2xl border-b-2 border-transparent p-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            {t('PUSH')}
          </a>
        </li>
        <li className="me-2">
          <a
            onClick={() => changTabSelect(NotificationTypeEnum.OTHER)}
            className={`${selectedIndex === NotificationTypeEnum.OTHER ? 'color-blue-600 border-b-2 border-blue-600 bg-[#FFD14B] p-1 font-semibold text-white' : ''} inline-block rounded-2xl border-b-2 border-transparent p-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            {t('OTHER')}
          </a>
        </li>
      </ul>
      <div className="custom-scrollbar h-[calc(100vh-200px)] overflow-x-auto overflow-y-scroll">
        {(data?.items || []).map((item) => renderItemNotify(item))}
      </div>
    </div>
  );
};

export default NotifyComponent;
