'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import LeaseAgreement from './tabLeaseAgreement';

const tabKeys = {
  tabLease: 'TAB_LEASE',
  tabReport: 'TAB_REPORT',
};
const { TabPane } = Tabs;

const LeaseAgreementPage: React.FC = () => {
  const t = useTranslations('webLabel');

  const { userInfo } = useGlobalStore();

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabLease);

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_la.view,
      appPermissions.portal_la.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarLeaseAfreement')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {selectedIndex === tabKeys.tabLease
              ? t('EcomLeftMenuBarLeaseAfreement')
              : t('EcomLeftMenuBarLeaseReport')}
          </h1>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabLease)} key={tabKeys.tabLease}>
            <LeaseAgreement activeKey={selectedIndex} tabKey={tabKeys.tabLease} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default LeaseAgreementPage;
