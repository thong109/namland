'use client';
import apiPaymentService from '@/apiServices/externalApiServices/apiPaymentService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { align, appPermissions, renderDateTime, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertFilterDate,
  convertPhoneNumber84To0,
  formatNumber,
} from '@/libs/helper';
import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import TopupPointModal from './components/TopupPointModal';

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

const TopupPointPage: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();
  const [userWallets, setUserWallets] = useState([] as any);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getListTransactionTopup(filter);
  }, []);

  const currentPage = () => Math.floor(filter.from / filter.size) + 1;

  const getListTransactionTopup = async (dataFilter) => {
    const newsResponse: any = await apiPaymentService.getListTransactionTopup(dataFilter);

    setUserWallets(newsResponse);
  };

  const handleSearch = debounce(async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getListTransactionTopup(convertFilterDate(filter, value));
    } else {
      const newFilter = { ...filter, [name]: value };
      setFilter(newFilter);
      getListTransactionTopup(newFilter);
    }
  }, 300);

  const onOpenTopup = () => {
    setShowModal(true);
  };

  const handleCloseModal = (isReload: boolean) => {
    setShowModal(false);
    if (isReload) {
      getListTransactionTopup(filter);
    }
  };

  const handleTableChange = (pagination: any) => {
    const newFilter = {
      ...filter,
      size: pagination?.pageSize,
      from: (pagination.current - 1) * pagination.pageSize,
    };

    getListTransactionTopup(newFilter);
    setFilter(newFilter);
  };

  const columns = [
    {
      title: t('topupPointId'),
      dataIndex: 'id',
      key: 'id',
      align: align.center,
      width: 220,
      render: (id) => <div className="text-sm">{id}</div>,
    },
    {
      title: t('TopupContracNumber'),
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      align: align.center,
      width: 180,
      render: (contactNumber) => <div className="text-sm">{contactNumber}</div>,
    },
    {
      title: t('topupPointClientName'),
      dataIndex: 'fullName',
      key: 'fullName',
      align: align.center,
      width: 150,
      render: (fullName) => <div className="text-sm">{fullName}</div>,
    },
    {
      title: t('topupPointClientPhone'),
      dataIndex: 'user',
      key: 'user',
      width: 130,
      render: (user) => (
        <div className="text-sm">{user?.phone && convertPhoneNumber84To0(user?.phone)}</div>
      ),
    },
    {
      title: t('noteBeforeVAT'),
      dataIndex: 'baseAmount',
      key: 'baseAmount',
      align: align.center,
      width: 150,
      render: (baseAmount) => <>{formatNumber(baseAmount)}</>,
    },
    {
      title: 'VAT',
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      align: align.center,
      width: 150,
      render: (vatAmount) => <>{formatNumber(vatAmount)}</>,
    },

    {
      title: t('TopupAmountWithVAT'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: align.center,
      width: 150,
      render: (totalAmount) => <>{formatNumber(totalAmount)}</>,
    },

    {
      title: t('topupPointClientPoint'),
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      align: align.center,
      width: 150,
      render: (totalPoint) => <>{formatNumber(totalPoint)}</>,
    },
    // {
    //   title: t('TopupExpiryDate'),
    //   dataIndex: 'paymentExpiredDate',
    //   key: 'paymentExpiredDate',
    //   align: align.center,
    //   width: 150,
    //   render: (paymentExpiredDate) => renderDateTime(paymentExpiredDate),
    // },
    {
      title: t('EcomTransactionPagePaymentMethod'),
      dataIndex: 'paymentChannel',
      key: 'paymentChannel',
      align: align.center,
      width: 150,
      render: (paymentChannel) => (paymentChannel === 'Bank' ? comm('Bank') : comm('Other')),
    },
    {
      title: t('topupPointCreateDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: align.center,
      width: 150,
      render: (createdAt) => renderDateTime(createdAt),
    },
    {
      title: t('topupPointPIC'),
      dataIndex: 'userCreatedBy',
      key: 'userCreatedBy',
      align: align.center,
      width: 150,
      render: (userCreatedBy) => <div className="text-xs">{userCreatedBy?.fullName}</div>,
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
              <div className="col-span-12 lg:col-span-4">
                <AppSearchFilter
                  name="keyword"
                  label={t('EcomLeftMenuBarTopupPointkeyword')}
                  placeholder={t('EcomLeftMenuBarTopupPointkeyword')}
                  onChange={(value) => handleSearch('keyword', value?.target?.value)}
                />
              </div>
              <div className="col-span-12 lg:col-span-3">
                <AppSelectFilter
                  name="paymentChannels"
                  label={t('EcomTransactionPagePaymentMethod')}
                  options={[
                    { label: 'Bank', value: 1 },
                    { label: 'Other', value: 6 },
                  ].map((x) => ({
                    value: x.value,
                    label: comm(x.label),
                    id: x.value,
                  }))}
                  onChange={(value) => handleSearch('paymentChannels', value)}
                  placeholder={t('EcomTransactionPagePaymentMethod')}
                />
              </div>
              <div className="col-span-12 lg:col-span-5">
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
          </Form>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_point.insert,
          ]) && <ButtonPrimary text={comm('TopupPoint')} onClick={onOpenTopup} />}
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [roleAdminGod, appPermissions.portal_point.view]) ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarTopupPoint')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomLeftMenuBarTopupPoint')}
            </h1>
          </div>
        </div>
        <div>{renderFilter()}</div>
        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: currentPage(),
              total: userWallets?.total ?? 0,
              onChange: handleTableChange,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              className="custom-ant-table custom-ant-row"
              columns={columns}
              dataSource={userWallets?.data}
              scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>
      <TopupPointModal isVisible={showModal} closeModal={handleCloseModal} />
    </>
  ) : (
    <WaringPermission />
  );
};

export default TopupPointPage;
