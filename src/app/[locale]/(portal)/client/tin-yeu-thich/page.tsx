'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import useDistrict from '@/hooks/useDistrict';
import useProvince from '@/hooks/useProvince';
import useWard from '@/hooks/useWard';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import NewHomeFavorite from './newHomeFavorite';
import './page.scss';
import RentFavorite from './rentFavorite';
import SaleFavorite from './saleFavorite';
const tabKeys = {
  tabSell: 'TAB_SELL',
  tabRent: 'TAB_RENT',
  tabNewHome: 'TAB_NEW_HOME',
};
const { TabPane } = Tabs;

const ProjectPage: React.FC = () => {
  const t = useTranslations('webLabel');

  const { userInfo } = useGlobalStore();
  const { listProvince } = useProvince();
  const { listDistrict } = useDistrict();
  const { listWard } = useWard();

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabSell);

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  return userInfo?.type === UserTypeConstant.Customer ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarProjectManagement')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomFavoritesPageListViewFavorites')}
          </h1>
        </div>

        <Tabs className="" activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabSell)} key={tabKeys.tabSell}>
            <SaleFavorite
              activeKey={selectedIndex}
              tabKey={tabKeys.tabSell}
              listProvince={listProvince}
              listDistrict={listDistrict}
              listWard={listWard}
            />
          </TabPane>

          <TabPane tab={t(tabKeys.tabRent)} key={tabKeys.tabRent}>
            <RentFavorite
              activeKey={selectedIndex}
              tabKey={tabKeys.tabRent}
              listProvince={listProvince}
              listDistrict={listDistrict}
              listWard={listWard}
            />
          </TabPane>
          <TabPane tab={t(tabKeys.tabNewHome)} key={tabKeys.tabNewHome}>
            <NewHomeFavorite activeKey={selectedIndex} tabKey={tabKeys.tabNewHome} />
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ProjectPage;
