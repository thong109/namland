'use client';
import transactionApiInAdmin from '@/apiServices/externalApiServices/apiTransactionService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreateDate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { excelIcon } from '@/libs/appComponents';
import {
  align,
  appPermissions,
  listPackage,
  listPackageEnum,
  listStatusProject,
  PackageExpiredStatus,
  renderDateTimeV2,
  roleAdminGod,
  userTypeForTrasaction,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertFilterDate,
  convertPhoneNumber84To0,
  formatNumber,
} from '@/libs/helper';

import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type IProps = {
  activeKey: string;
  tabKey: string;
};

const ListingPackagePage = (props: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const pathname = usePathname();
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
      getListTransactionListPackage(filter);
    }
  }, [props.activeKey, props.tabKey]);

  const getListTransactionListPackage = async (filter) => {
    const responseData: any =
      await transactionApiInAdmin.getListTransactionListPackageStaff(filter);
    setListTransaction(responseData);
  };

  const currentPage = () => Math.floor(filter.from / filter.size) + 1;

  const handleSearch = async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getListTransactionListPackage(convertFilterDate(filter, value));
    } else {
      const newFilter = { ...filter, [name]: value };
      setFilter(newFilter);
      getListTransactionListPackage(newFilter);
    }
  };

  const handleExport = () => {
    const { size, from, ...body } = filter;

    startTransition(async () => {
      await transactionApiInAdmin.exportTransactionPackage(body);
    });
  };

  const columnTopup = [
    {
      title: t('EcomTransactionPageIdTransaction'),
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 180,
      render: (transactionId) => <a className="line-clamp-3 text-xs">{transactionId}</a>,
    },

    {
      title: t('EcomTransactionPagePackageName'),
      dataIndex: 'listingPackageType',
      key: 'listingPackageType',
      width: 110,
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
      title: t('EcomListPackageDetailListingType'),
      dataIndex: 'type',
      key: 'type',
      width: 110,
      align: align.center,
      ellipsis: true,
      render: (type) => {
        return (
          <div className="text-xs">
            {t(listStatusProject?.find((item) => item?.id === type)?.name)}
          </div>
        );
      },
    },
    {
      title: t('EcomTransactionPageQuantity'),
      dataIndex: 'listingPackage',
      key: 'listingPackage',
      width: 160,
      render: (listingPackage) =>
        [
          { id: 1, name: '1Listing' },
          { id: 2, name: '10Listing' },
          { id: 3, name: '30Listing' },
          { id: 4, name: 'SpecialPromotion' },
        ].map((item) => {
          if (item.id === listingPackage)
            return <span className="text-xs">{comm(item.name) ?? '--'}</span>;
        }),
    },

    {
      title: t('EcomTransactionPageIdTransactionPoint'),
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (totalPoint) => {
        return <div className="text-xs">{formatNumber(totalPoint) ?? '--'}</div>;
      },
    },

    {
      title: t('EcomListPackageDetailListingDiscountedPoint'),
      dataIndex: 'discountedPoint',
      key: 'discountedPoint',
      width: 120,
      align: align.center,
      ellipsis: true,
      render: (discountedPoint) => {
        return <div className="text-xs">{formatNumber(discountedPoint) ?? '--'}</div>;
      },
    },
    {
      title: t('EcomTransactionPackageExpiredDate'),
      dataIndex: 'expiredDateTime',
      key: 'expiredDateTime',
      width: 130,
      align: align.center,

      render: (expiredDateTime) => {
        return <div className="text-xs">{renderDateTimeV2(expiredDateTime) ?? '--'}</div>;
      },
    },
    {
      title: t('EcomTransactionPackageExpiredStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: align.center,

      render: (status) => {
        return (
          <div className="text-xs">
            {status === PackageExpiredStatus.Expired ? comm('Expired') : comm('NotExpired')}
          </div>
        );
      },
    },
    columnCreateDate(),
    {
      title: t('EcomTransactionPageClientRole'),
      dataIndex: 'userInfo',
      key: 'userInfo',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (userInfo) => {
        return (
          <div>
            <div className="font-semibold">{userInfo?.accountType}</div>
          </div>
        );
      },
    },
    {
      title: t('EcomTransactionPageClientName'),
      dataIndex: 'userInfo',
      key: 'userInfo',
      width: 130,
      render: (userInfo) => {
        return (
          <div>
            <div className="font-semibold">{userInfo?.fullName}</div>
          </div>
        );
      },
    },
    {
      title: t('EcomTransactionPageClientPhoneNumber'),
      dataIndex: 'userInfo',
      key: 'userInfo',
      width: 130,
      ellipsis: true,
      render: (userInfo) => {
        return (
          <div>
            <div className="text-xs">
              {userInfo?.phone && convertPhoneNumber84To0(userInfo?.phone)}
            </div>
          </div>
        );
      },
    },
    {
      title: t('EcomTransactionPageClientEmailAddress'),
      dataIndex: 'userInfo',
      key: 'userInfo',
      width: 180,
      ellipsis: true,
      render: (userInfo) => {
        return (
          <div>
            <div className="text-xs">{userInfo?.email}</div>
          </div>
        );
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
          <div className="col-span-10">
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12 lg:col-span-4">
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
                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="quantityOption"
                    label={t('EcomTransactionPageQuantity')}
                    options={listPackageEnum.map((x) => ({
                      value: x.id,
                      label: comm(x.name),
                      id: x.id,
                    }))}
                    onChange={(value) => handleSearch('quantityOption', value)}
                    placeholder={t('EcomTransactionPageQuantity')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <Form.Item name="publishedDate">
                    <RangeDateFilter
                      placeholder={t('EcomTransactionPageSearchBarDate')}
                      label={t('EcomTransactiongPageSearchBarDate')}
                      onChange={(dates) => handleSearch('date', dates)}
                      className="flex w-[100%] items-end"
                    />
                  </Form.Item>
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="userTypes"
                    label={t('EcomTransactionPageClientRole')}
                    options={userTypeForTrasaction.map((x) => ({
                      value: x.value,
                      label: comm(x.name),
                      id: x.value,
                    }))}
                    onChange={(value) => handleSearch('userTypes', value)}
                    placeholder={t('EcomTransactionPageClientRole')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex justify-end">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.transaction.exportPackge,
            ]) && (
              <ButtonPrimary
                isLoading={isPending}
                size="middle"
                icon={excelIcon}
                text={comm('Export')}
                onClick={() => handleExport()}
              />
            )}
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
    getListTransactionListPackage(newFilter);
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
            columns={columnTopup}
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

export default ListingPackagePage;
