'use client';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, roleAdminGod, tabModulComment } from '@/libs/appconst';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tab } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import CommentDataTable from './CommentDataTable';

const CommentManagement: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const t = useTranslations('webLabel');

  const { userInfo } = useGlobalStore();

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_comment.view,
    appPermissions.portal_comment.admin,
  ]) ? (
    <div className="h-full w-full bg-portal-backgroud px-3 md:px-[40px] lg:px-[50px]">
      <div className="align-items-center mt-[57px] flex justify-between">
        <div className="mb-5 text-xl font-semibold">
          <h1>{t('EcomLeftCommentListView')}</h1>
        </div>
      </div>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List>
          <Tab
            className={`${
              selectedIndex === 0 && 'bg-portal-primaryMainAdmin text-[#FFFFFF]'
            } h-11 w-fit rounded-t-xl px-4 py-3 shadow-inner`}
          >
            <label className="text-sm">{t('EcomCommentTabProperty')}</label>
          </Tab>
          <Tab
            className={`${
              selectedIndex === 1 && 'bg-portal-primaryMainAdmin text-[#FFFFFF]'
            } h-11 w-fit rounded-t-xl px-4 py-3 shadow-inner`}
          >
            <label className="text-sm">{t('EcomCommentTabMember')}</label>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <CommentDataTable mainTabProps={tabModulComment.property} />
          </Tab.Panel>

          <Tab.Panel>
            <CommentDataTable mainTabProps={tabModulComment.member} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  ) : (
    <WaringPermission />
  );
};

export default CommentManagement;
