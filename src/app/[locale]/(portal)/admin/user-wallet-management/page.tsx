'use client';
import userWalletApiInAdmin from '@/apiServices/externalApiServices/apiUserWallet';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, excelIcon } from '@/libs/appComponents';
import { align, appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, convertFilterDate, formatNumber } from '@/libs/helper';
import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const props: (keyof INewFilterModelInAdmin)[] = [
  'keyword',
  'fromDate',
  'toDate',
  'createdBy',
  'type',
  'isActive',
  'from',
  'size',
  'category',
];

const UserWalletPage: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const { push } = useRouter();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();
  const [userWallets, setUserWallets] = useState([] as any);
  const [isPending, startTransition] = useTransition();

  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getUsetWallet(filter);
  }, []);

  const getUsetWallet = async (dataFilter) => {
    const newsResponse: any = await userWalletApiInAdmin.getUserWallets(dataFilter);

    setUserWallets(newsResponse);
  };

  const handleSearch = debounce(async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getUsetWallet(convertFilterDate(filter, value, 'fromDate', 'toDate'));
    } else {
      const newFilter = { ...filter };

      newFilter[name] = value;
      setFilter(newFilter);
      getUsetWallet(newFilter);
    }
  }, 300);

  const handleTableChange = (pagination: any) => {
    const newFilter = {
      ...filter,
      size: pagination?.pageSize,
      from: (pagination.current - 1) * pagination.pageSize,
    };

    getUsetWallet(newFilter);
    setFilter(newFilter);
  };

  const handleExport = () => {
    startTransition(async () => {
      const response = await userWalletApiInAdmin.exportExcel(filter);

      notify('success', (response as any)?.message);
    });
  };

  const gotoDetail = (id) => {
    if (id) {
      push(`/admin/user-wallet-management/${id}`);
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      align: align.center,
      width: 50,
      render: () => <></>,
    },
    {
      title: t('EcomUserWalletPageClientInfo'),
      dataIndex: 'user',
      key: 'user',
      width: 200,
      render: (user: any) => (
        <div className="grid grid-cols-1">
          <span className="col-span-1">
            {user?.fullName ?? user?.lastName + ' ' + user?.firstName}
          </span>
          <span className="col-span-1 text-xs font-light leading-5">{user?.id}</span>
          <span className="col-span-1 text-xs font-light leading-5">{user?.email}</span>
        </div>
      ),
    },
    {
      title: t('EcomUserWalletPagePoint'),
      dataIndex: 'balancePoint',
      key: 'balancePoint',
      align: align.center,
      width: 200,
      render: (balancePoint) => <>{formatNumber(balancePoint)}</>,
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id) => (
        <div className="flex w-full items-center justify-center">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_userwallet.view,
          ]) && (
            <button className="mr-1" onClick={() => gotoDetail(id)}>
              {editIcon}
            </button>
          )}
        </div>
      ),
    },
  ];

  const renderFilter = () => {
    return (
      <div className="grid grid-cols-10 gap-x-2">
        <div className="col-span-8">
          <Form
            form={formFilter}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="grid w-full grid-cols-12 gap-x-2">
              <div className="col-span-12 lg:col-span-6">
                <AppSearchFilter
                  name="keyword"
                  label={t('EcomPropertyUserWalletPageSearchBarSearch')}
                  placeholder={t('EcomPropertyUserWalletPageSearchBarSearch')}
                  onChange={(value) => handleSearch('keyword', value?.target?.value)}
                />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <Form.Item name="createAt">
                  <RangeDateFilter
                    placeholder={t('EcomUserWalletPageSearchCreateAt')}
                    label={t('EcomUserWalletPageSearchCreateAt')}
                    onChange={(dates) => handleSearch('date', dates)}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className="col-span-2 flex justify-end">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_userwallet.export,
          ]) && (
            <ButtonPrimary
              isLoading={isPending}
              icon={excelIcon}
              text={comm('Export')}
              onClick={() => handleExport()}
            />
          )}
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_userwallet.view,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarUserWallet')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomLeftMenuBarUserWallet')}
            </h1>
          </div>
        </div>
        <div>{renderFilter()}</div>
        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: userWallets.total ?? 0,
              onChange: handleTableChange,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              className="custom-ant-table custom-ant-row"
              columns={columns}
              dataSource={userWallets?.data}
              scroll={{ x: 900, y: 500, scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default UserWalletPage;
