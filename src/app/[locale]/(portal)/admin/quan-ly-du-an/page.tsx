'use client';
import AppPageMeta from '@/components/AppPageMeta';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './index.scss';
import ProjectPage from './tabProject';
import UnitPage from './tabUnit';
const tabKeys = {
  tabProject: 'TAB_PROJECT',
  tabUnit: 'TAB_UNIT',
};
const { TabPane } = Tabs;

const ProjectAndUnitPage: React.FC = () => {
  const t = useTranslations('webLabel');

  const { userInfo } = useGlobalStore();

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabProject);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tabActive') === tabKeys.tabUnit) {
      setSelectedIndex(tabKeys.tabUnit);
    } else {
      setSelectedIndex(tabKeys.tabProject);
    }
  }, []);

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  return userInfo?.type === UserTypeConstant.Salesman ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarProjectManagement')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {selectedIndex === tabKeys.tabProject
              ? t('EcomLeftMenuBarProjectManagement')
              : t('EcomLeftMenuBarunitManagement')}
          </h1>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_project.view,
            appPermissions.portal_project.admin,
          ]) && (
            <TabPane tab={t(tabKeys.tabProject)} key={tabKeys.tabProject}>
              <ProjectPage activeKey={selectedIndex} tabKey={tabKeys.tabProject} />
            </TabPane>
          )}

          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_unit.view,
            appPermissions.portal_unit.admin,
          ]) && (
            <TabPane tab={t(tabKeys.tabUnit)} key={tabKeys.tabUnit}>
              <UnitPage activeKey={selectedIndex} tabKey={tabKeys.tabUnit} />
            </TabPane>
          )}
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ProjectAndUnitPage;
