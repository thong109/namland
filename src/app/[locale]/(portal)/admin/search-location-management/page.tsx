'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import SearchLocationDataTable from './SearchLocationDataTable';

const BannerManagement: FC = () => {
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_searchlocation.admin,
  ]) ? (
    <>
      <AppPageMeta title={t('EcomSearchLocationManagement')} />
      <div className="h-full w-full bg-portal-background px-[3%] md:px-[40px] lg:px-[60px]">
        <div className="align-items-center mt-[4%] flex justify-between lg:mt-[57px]">
          <div className="mb-5 text-xl font-semibold">
            <h1>{t('EcomSearchLocationManagement')}</h1>
          </div>
        </div>
        <SearchLocationDataTable />
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default BannerManagement;
