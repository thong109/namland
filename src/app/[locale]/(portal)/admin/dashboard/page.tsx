'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';

import { appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tab } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import PropertyDashBoard from './propertyComponent';

const DashboardPage: FC = () => {
  const { userInfo } = useGlobalStore();
  const t = useTranslations('webLabel');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_dashboard.view,
      appPermissions.portal_dashboard.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarDashboard')} />

      <div className="h-full w-full bg-portal-background px-3 md:px-[40px] lg:px-[50px]">
        <div className="align-items-center mt-[57px] flex justify-between">
          <div className="mb-5 text-xl font-semibold">
            <h1>{t('EcomLeftMenuBarDashboard')}</h1>
          </div>
        </div>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List>
            <Tab
              className={`${
                selectedIndex === 0 && 'bg-portal-primaryMainAdmin text-[#FFFFFF]'
              } h-11 w-fit rounded-t-xl px-4 py-3 shadow-inner`}
            >
              <label className="text-sm">{t('EcomDashboardTabProperty')}</label>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <PropertyDashBoard />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default DashboardPage;
