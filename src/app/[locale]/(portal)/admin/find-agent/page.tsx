'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import AgentDataTable from './AgentDataTable';

const BannerManagement: FC = () => {
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_find_agent.view,
    appPermissions.portal_find_agent.admin,
  ]) ? (
    <>
      <AppPageMeta title={t('EcomBannerManagementPageFindAgentListView')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomBannerManagementPageFindAgentListView')}
            </h1>
          </div>
        </div>

        <AgentDataTable />
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default BannerManagement;
