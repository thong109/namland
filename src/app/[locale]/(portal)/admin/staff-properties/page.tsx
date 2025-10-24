'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import PropertiesDataTable from './propertiesDataTable';

const MyPropopertiesForStaff: FC = () => {
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();
  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_listing.view,
      appPermissions.portal_listing.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomPropertyListingPageMenuListing')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomPropertyListingPageHeaderPropertiesStaff')}
          </h1>
        </div>

        <PropertiesDataTable />
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default MyPropopertiesForStaff;
