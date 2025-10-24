'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import HistoryUsePackage from './tabHistoryPackage';
import HistoryUsePush from './tabHistoryPush';
import ListingPackagePage from './tabListingPackage';
import ListingPushPage from './tabListingPush';
import TopupPageV2 from './tabTopupV2';
const tabKeys = {
  tabTopup: 'TAB_TOPUP',
  tabListingPackage: 'TAB_LISTING_PACKGE',
  tabListingPush: 'TAB_LISTING_PUSH',
  tabHistoryPackage: 'TAB_HISTORY_PACKAGE',
  tabHistoryPush: 'TAB_HISTORY_PUSH',
};
const { TabPane } = Tabs;

const TransactionPage: React.FC = () => {
  const t = useTranslations('webLabel');

  const { userInfo } = useGlobalStore();

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabTopup);

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  return userInfo?.type === UserTypeConstant.Customer ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarTransaction')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomLeftMenuBarTransaction')}
          </h1>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabTopup)} key={tabKeys.tabTopup}>
            <TopupPageV2 activeKey={selectedIndex} tabKey={tabKeys.tabTopup} />
          </TabPane>

          <TabPane tab={t(tabKeys.tabListingPackage)} key={tabKeys.tabListingPackage}>
            <ListingPackagePage activeKey={selectedIndex} tabKey={tabKeys.tabListingPackage} />
          </TabPane>
          <TabPane tab={t(tabKeys.tabListingPush)} key={tabKeys.tabListingPush}>
            <ListingPushPage activeKey={selectedIndex} tabKey={tabKeys.tabListingPush} />
          </TabPane>

          <TabPane tab={t(tabKeys.tabHistoryPackage)} key={tabKeys.tabHistoryPackage}>
            <HistoryUsePackage activeKey={selectedIndex} tabKey={tabKeys.tabHistoryPackage} />
          </TabPane>

          <TabPane tab={t(tabKeys.tabHistoryPush)} key={tabKeys.tabHistoryPush}>
            <HistoryUsePush activeKey={selectedIndex} tabKey={tabKeys.tabHistoryPush} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default TransactionPage;
