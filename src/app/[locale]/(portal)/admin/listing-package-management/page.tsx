'use client';
import listingApiPackageService from '@/apiServices/externalApiServices/apilistingPackageService';
import paymeConfigService from '@/apiServices/externalApiServices/pamymeConfigService';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon } from '@/libs/appComponents';
import {
  align,
  appPermissions,
  listPackage,
  listStatusProject,
  renderDate,
  renderDateTime,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, convertFilterDate } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table, Tabs } from 'antd';
import Form from 'antd/es/form';
import { ColumnsType } from 'antd/lib/table';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const { TabPane } = Tabs;

const tabKeys = {
  TAB_PAYME_CONFIG: 'EcomMemberPageListViewListingPackge',
  TAB_PAYME_CONFIG_LOGS: 'TAB_PAYME_CONFIG_LOGS',
};

const ListingPackagePage: React.FC = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();
  const [packages, setPackages] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });
  const [tabActive, setTabActive] = useState(tabKeys.TAB_PAYME_CONFIG);
  const [listAuditlog, setListAuditlog] = useState([] as any);

  useEffect(() => {
    getListPackage(filter);
  }, []);

  const getListPackage = async (dataFilter) => {
    const list = await listingApiPackageService.getListPackage(dataFilter);

    setPackages(list ?? undefined);
  };

  const getListAuditlog = async () => {
    const list = await paymeConfigService.GetAllAuditLog('PACKAGE');

    setListAuditlog(list.data ?? undefined);
  };

  const currentPage = () => Math.floor(filter.from / filter.size) + 1;

  const handleSearch = async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getListPackage(convertFilterDate(filter, value));
    } else {
      const newFilter = { ...filter, [name]: value };
      setFilter(newFilter);
      getListPackage(newFilter);
    }
  };

  const handleTableChange = (pagination: any) => {
    const newFilter = {
      ...filter,
      size: pagination?.pageSize,
      from: (pagination.current - 1) * pagination.pageSize,
    };

    getListPackage(newFilter);
    setFilter(newFilter);
  };

  const onEdit = (id: string) => {
    if (id) {
      push(`/admin/listing-package-management/${id}`);
    } else {
      push(`/admin/listing-package-management/add-new`);
    }
  };

  const changTabSelect = (tabKey) => {
    setTabActive(tabKey);
    if (tabKey === tabKeys.TAB_PAYME_CONFIG) {
      getListPackage(filter);
    }
    if (tabKey === tabKeys.TAB_PAYME_CONFIG_LOGS) {
      getListAuditlog();
    }
  };

  const columns = [
    {
      title: t('EcomPackagePagePackageName'),
      dataIndex: 'package',
      key: 'package',
      width: 120,
      render: (pk, record) =>
        [
          { id: 1, name: '1ListingNew' },
          { id: 2, name: '10ListingNew' },
          { id: 3, name: '30ListingNew' },
          { id: 4, name: 'SpecialPromotion' },
        ].map((item) => {
          if (item.id === pk)
            return (
              <span className="text-xs">
                {comm(item.name, { percentDecrease: record?.percentDecrease }) ?? '--'}
              </span>
            );
        }),
    },
    {
      title: t('EcomPackagePagePackagePackageType'),
      dataIndex: 'packageType',
      key: 'packageType',
      width: 120,
      align: align.center,
      render: (pk) =>
        listPackage.map((item) => {
          if (item.id === pk) return <span className="text-xs">{comm(item.name) ?? '--'}</span>;
        }),
    },
    {
      title: t('EcomPackagePageType'),
      dataIndex: 'type',
      key: 'type',
      width: 130,
      align: align.center,
      render: (pk) =>
        listStatusProject.map((item) => {
          if (item.id === pk) return <span className="text-xs">{comm(item.name) ?? '--'}</span>;
        }),
    },
    {
      title: t('EcomPackagePageCreate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      align: align.center,
      render: (createdAt) => <div className="text-xs">{renderDate(createdAt)}</div>,
    },
    {
      title: t('EcomPackagePageStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: align.center,
      render: (status) => (
        <span
          style={{
            fontSize: 12,
            backgroundColor: status === 1 ? '#E6F9EE' : '#FCE4E4',
            color: status === 1 ? '#27AE60' : '#840B1F',
            padding: '6px 8px',
            borderRadius: '8px',
            fontWeight: 600,
          }}
        >
          {status === 1 ? t('Active') : t('InActive')}
        </span>
      ),
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 90,
      align: align.center,
      render: (id) => (
        <div className="flex w-full items-center justify-center">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_listing_package.insert,
            appPermissions.portal_listing_package.update,
            appPermissions.portal_listing_package.admin,
          ]) &&
            checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_listing_package.update,
              appPermissions.portal_listing_package.admin,
            ]) && (
              <button className="mr-1" onClick={() => onEdit(id)}>
                {editIcon}
              </button>
            )}
        </div>
      ),
    },
  ];

  const columnAuditLog: ColumnsType<any> = [
    {
      title: t('EcomTransactionPageColumnName'),
      dataIndex: 'columnName',
      key: 'columnName',
      width: 180,
      render: (columnName) => <>{columnName}</>,
    },
    {
      title: t('EcomTransactionPageOldValue'),
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 180,
      render: (oldValue) => <>{oldValue}</>,
    },
    {
      title: t('EcomTransactionPageNewValue'),
      dataIndex: 'newValue',
      key: 'newValue',
      width: 180,
      render: (newValue) => <>{newValue}</>,
    },
    {
      title: t('EcomTransactionPageCreatedAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: renderDateTime,
    },
    {
      title: t('EcomTransactionPageUser'),
      dataIndex: 'user',
      key: 'user',
      width: 180,
      render: (user) => <>{user?.fullName}</>,
    },
  ];

  const renderFilter = () => {
    return (
      <Form
        layout="horizontal"
        size="middle"
        onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
      >
        <div className="grid grid-cols-12">
          <div className="col-span-10">
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="packageType"
                    label={t('EcomPackagePagePackageType')}
                    options={listPackage.map((x) => ({
                      value: x.id,
                      label: comm(x.name),
                      id: x.id,
                    }))}
                    onChange={(value) => handleSearch('packageType', value)}
                    placeholder={t('EcomPackagePagePackageType')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="type"
                    label={t('EcomListPackageDetailListingType')}
                    options={listStatusProject.map((x) => ({
                      value: x.id,
                      label: t(x.name),
                      id: x.id,
                    }))}
                    onChange={(value) => handleSearch('type', value)}
                    placeholder={t('EcomListPackageDetailListingType')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_listing_package.view,
      appPermissions.portal_listing_package.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomMemberPageListViewListingPackge')} />
      <div className="w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomMemberPageListViewListingPackge')}
            </h1>
          </div>
        </div>

        <Tabs activeKey={tabActive} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.TAB_PAYME_CONFIG)} key={tabKeys.TAB_PAYME_CONFIG}>
            <div>{renderFilter()}</div>

            <div className="w-full sm:rounded-lg">
              <DataTableAdvanced
                showChangePageSize
                pagination={{
                  pageSize: filter?.size,
                  current: currentPage(),
                  total: packages?.total ?? 0,
                  onChange: handleTableChange,
                }}
              >
                <Table
                  size={'middle'}
                  pagination={false}
                  columns={columns}
                  className="overflow-x-auto"
                  dataSource={packages?.data}
                  scroll={{ x: 600, y: '65vh', scrollToFirstRowOnChange: true }}
                />
              </DataTableAdvanced>
            </div>
          </TabPane>
          <TabPane tab={t(tabKeys.TAB_PAYME_CONFIG_LOGS)} key={tabKeys.TAB_PAYME_CONFIG_LOGS}>
            <div className="w-full sm:rounded-lg">
              <Table
                pagination={false}
                size="small"
                bordered
                dataSource={listAuditlog}
                columns={columnAuditLog}
                rowKey={(record) => record.id}
                scroll={{ x: 900, scrollToFirstRowOnChange: true }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ListingPackagePage;
