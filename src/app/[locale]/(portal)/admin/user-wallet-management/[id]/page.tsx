'use client';
import userWalletApiInAdmin from '@/apiServices/externalApiServices/apiUserWallet';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  align,
  appPermissions,
  CashReceipt,
  listPackage,
  listStatusProject,
  renderDateTime,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, convertFilterDate, formatNumber } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { useEffect, useState, useTransition } from 'react';

const UserWalletDetailPage = ({ params }: { params: { id: string } }) => {
  const [formFilter] = Form.useForm();

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { userInfo } = useGlobalStore();
  const { back } = useRouter();

  const [isPending, startTransition] = useTransition();
  const [userTransactions, setUserTransactions] = useState([] as any);

  const currentPage = () => Math.floor(filter.from / filter.size) + 1;

  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getListTransaction(filter);
  }, []);

  const getListTransaction = async (dataFilter) => {
    if (params?.id) {
      const param = {
        ...dataFilter,
        cashAdvanceId: params.id,
      };
      const newsResponse: any = await userWalletApiInAdmin.getUserTransction(param);

      setUserTransactions(newsResponse);
    }
  };

  const handleSearch = async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getListTransaction(convertFilterDate(filter, value));
    } else {
      const newFilter = { ...filter, [name]: value };
      setFilter(newFilter);
      getListTransaction(newFilter);
    }
  };

  const handleTableChange = (pagination: any) => {
    const newFilter = {
      ...filter,
      size: pagination?.pageSize,
      from: (pagination.current - 1) * pagination.pageSize,
    };

    getListTransaction(newFilter);
    setFilter(newFilter);
  };

  const handleExport = () => {
    const body = {
      ...filter,
      cashAdvanceId: params.id,
    };
    startTransition(async () => {
      await userWalletApiInAdmin.exportCashAdvance(body);
    });
  };

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={back} />
      </div>
    );
  };

  const columns = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      align: align.center,
      width: 10,
      render: () => <></>,
    },
    {
      title: t('EcomListPackageDetailListingType'),
      dataIndex: 'cashAdvanceDetail',
      key: 'cashAdvanceDetail',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (cashAdvanceDetail) => {
        return cashAdvanceDetail?.type !== null ? (
          <div className="text-xs">
            {t(listStatusProject?.find((item) => item?.id === cashAdvanceDetail?.type)?.name)}
          </div>
        ) : (
          ''
        );
      },
    },
    {
      title: t('EcomUserWalletPageTransaction'),
      dataIndex: 'balancePoint',
      key: 'balancePoint',
      width: 110,
      align: align.center,
      ellipsis: true,
      render: (balancePoint, item) => {
        return (
          <>
            <label className="text-xs">
              {comm(
                CashReceipt?.find(
                  (record) => record?.id === item?.cashAdvanceDetail?.transactionType,
                )?.name,
              )}
            </label>{' '}
            {item?.cashAdvanceDetail?.packageType !== null && (
              <label className="text-xs">
                -{' '}
                {comm(
                  listPackage?.find((record) => record?.id === item?.cashAdvanceDetail?.packageType)
                    ?.name,
                )}
              </label>
            )}
          </>
        );
      },
    },
    {
      title: t('EcomPackagePagePackageName'),
      dataIndex: 'cashAdvanceDetail',
      key: 'cashAdvanceDetail',
      width: 130,
      align: align.center,
      render: (cashAdvanceDetail) =>
        [
          { id: 1, name: '1Listing' },
          { id: 2, name: '10Listing' },
          { id: 3, name: '30Listing' },
          { id: 4, name: 'SpecialPromotion' },
        ].map((item) => {
          if (item.id === cashAdvanceDetail?.package)
            return <span className="text-xs">{comm(item.name) ?? '--'}</span>;
        }),
    },
    {
      title: t('EcomUserWalletPagePoint'),
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      align: align.center,
      width: 150,
      render: (totalPoint) => (
        <div
          className={totalPoint < 0 ? 'font-semibold text-red-600' : 'font-semibold text-green-500'}
        >
          {formatNumber(totalPoint)}
        </div>
      ),
    },
    {
      title: t('EcomUserWalletCreateAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: align.center,
      width: 200,
      render: renderDateTime,
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
            </div>
          </Form>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_userwallet.view,
          ]) && (
            <ButtonPrimary
              isLoading={isPending}
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
    <WrapPageScroll renderActions={renderAction}>
      <div className="m-3 w-full pt-6">
        <h1 className="w-full text-3xl font-semibold text-portal-primaryMainAdmin">
          {userTransactions?.data?.length > 0
            ? userTransactions?.data[0]?.userCreatedBy?.fullName
            : ''}{' '}
        </h1>

        <div className="text-3xl font-semibold text-portal-primaryMainAdmin">
          {t('EcomUserWalletPagePointBlance')}:{' '}
          {userTransactions?.data?.length > 0
            ? formatNumber(userTransactions?.data[0]?.balancePoint)
            : 0}{' '}
          {t('EcomListPackageDetailListingPoint')}
        </div>
      </div>

      <div>{renderFilter()}</div>
      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: currentPage(),
            total: userTransactions.total ?? 0,
            onChange: handleTableChange,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            className="custom-ant-table custom-ant-row"
            columns={columns}
            dataSource={userTransactions?.data}
            scroll={{ x: 900, y: 450, scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default UserWalletDetailPage;
