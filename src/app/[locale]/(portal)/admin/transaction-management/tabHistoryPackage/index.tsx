'use client';
import transactionApiInAdmin from '@/apiServices/externalApiServices/apiTransactionService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import {
  align,
  appPermissions,
  listPackage,
  listStatusProject,
  renderDateTimeV2,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertFilterDate,
  convertPhoneNumber84To0,
} from '@/libs/helper';

import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';

type IProps = {
  activeKey: string;
  tabKey: string;
};

const HistoryUsePackage = (props: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formFIlter] = Form.useForm();
  const [listTransaction, setListTransaction] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });
  const [isPending, startTransition] = useTransition();
  const { userInfo } = useGlobalStore();
  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListingPackageLog(filter);
    }
  }, [props.activeKey, props.tabKey]);

  const getListingPackageLog = async (filter) => {
    const responseData: any = await transactionApiInAdmin.getListingPackageLog(filter);
    setListTransaction(responseData);
  };

  const currentPage = () => Math.floor(filter.from / filter.size) + 1;

  const handleSearch = async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getListingPackageLog(convertFilterDate(filter, value));
    } else {
      const newFilter = { ...filter, [name]: value };
      setFilter(newFilter);
      getListingPackageLog(newFilter);
    }
  };

  const handleExport = () => {
    const { size, from, ...body } = filter;

    startTransition(async () => {
      await transactionApiInAdmin.exportTransactionPackage(body);
    });
  };

  const columnHistory = [
    {
      title: t('EcomTransactionPageDateUsePackage'),
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 60,
      render: (createdTime) => <span className="text-xs">{renderDateTimeV2(createdTime)}</span>,
    },

    {
      title: t('EcomBannerManagementPageAgentInfo'),
      dataIndex: 'userInfo',
      key: 'userInfo',
      width: 80,
      render: (userInfo) => (
        <>
          <span className="text-xs">{userInfo?.fullName}</span>
          <br />
          <span className="text-xs">{convertPhoneNumber84To0(userInfo?.phone)}</span>
        </>
      ),
    },
    {
      title: t('EcomPackagePageType'),
      dataIndex: 'type',
      key: 'type',
      width: 50,
      align: align.center,
      render: (pk) =>
        listStatusProject.map((item) => {
          if (item.id === pk) return <span className="text-xs">{comm(item.name) ?? '--'}</span>;
        }),
    },
    {
      title: t('EcomPackagePagePackagePackageType'),
      dataIndex: 'packageType',
      key: 'packageType',
      width: 80,
      align: align.center,
      ellipsis: true,
      render: (listingPackageType) => {
        return (
          <div className="text-xs">
            {comm(listPackage?.find((item) => item?.id === listingPackageType)?.name)}
          </div>
        );
      },
    },

    {
      title: t('EcomPropertyListingPageSearchBarPlaceholder'),
      dataIndex: 'listing',
      key: 'listing',
      width: 200,
      align: align.left,
      ellipsis: true,
      render: (listing) => {
        return <div className="line-clamp-2 text-xs">{listing?.title}</div>;
      },
    },
  ];

  const renderFilter = () => {
    return (
      <Form
        form={formFIlter}
        layout="horizontal"
        size="middle"
        onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
      >
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12 lg:col-span-6">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomPropertyUserWalletPageSearchBarSearch')}
                    placeholder={t('EcomPropertyUserWalletPageSearchBarSearch')}
                    onChange={(value) => handleSearch('keyword', value?.target?.value)}
                  />
                </div>
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
                    placeholder={t('EcomTransactionPagePackageName')}
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
                <div className="col-span-12 lg:col-span-6">
                  <Form.Item name="publishedDate">
                    <RangeDateFilter
                      placeholder={t('EcomTransactionPageSearchBarDate')}
                      label={t('EcomTransactiongPageSearchBarDate')}
                      onChange={(dates) => handleSearch('date', dates)}
                      className="flex w-[100%] items-end"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  };
  const handleTableChange = (pagination: any) => {
    const newFilter = {
      ...filter,
      size: pagination?.pageSize,
      from: (pagination.current - 1) * pagination.pageSize,
    };
    getListingPackageLog(newFilter);
    setFilter(newFilter);
  };
  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_listing_package.view,
      appPermissions.portal_listing_package.admin,
    ]) ? (
    <>
      <div>{renderFilter()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: currentPage(),
            total: listTransaction?.total ?? 0,
            onChange: handleTableChange,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            columns={columnHistory}
            className="overflow-x-auto"
            dataSource={listTransaction?.data}
            scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default HistoryUsePackage;
