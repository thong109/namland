'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import BannerDataTable from './BannerDataTable';

const BannerManagement: FC = () => {
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_banner.view,
    appPermissions.portal_banner.admin,
  ]) ? (
    <>
      <AppPageMeta title={t('EcomBannerManagementPageAdBannerListViewBannerManagement')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomBannerManagementPageAdBannerListViewBannerManagement')}
            </h1>
          </div>
        </div>

        <BannerDataTable />
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default BannerManagement;
