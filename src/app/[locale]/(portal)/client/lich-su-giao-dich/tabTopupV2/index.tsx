'use client';
import transactionApiInAdmin from '@/apiServices/externalApiServices/apiTransactionService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import { excelIcon } from '@/libs/appComponents';
import {
  align,
  listPaymentMethod,
  listStatusTopUpTransaction,
  paymentMethods,
  renderDateTimeV2,
} from '@/libs/appconst';
import { blockKeyEnter, convertFilterDate, formatNumber } from '@/libs/helper';

import { Table } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';

type IProps = {
  activeKey: string;
  tabKey: string;
};

const TopupPage = (props: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formFilterProject] = Form.useForm();
  const [listTransaction, setListTransaction] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListTransactionTopup(filter);
    }
  }, [props.activeKey, props.tabKey]);

  const getListTransactionTopup = async (dataFilter) => {
    const responseData: any = await transactionApiInAdmin.getMyTransactionTopupV2(dataFilter);
    setListTransaction(responseData);
  };

  const handleSearch = async (name, value) => {
    if (name === 'publishedDate') {
      setFilter(convertFilterDate(filter, value));
      getListTransactionTopup(convertFilterDate(filter, value, 'fromDate', 'toDate'));
    } else if (name === 'expiredDate') {
      setFilter(convertFilterDate(filter, value));
      getListTransactionTopup(convertFilterDate(filter, value, 'fromExpiredDate', 'toExpiredDate'));
    } else {
      const newFilter = { ...filter };

      newFilter[name] = value;
      setFilter(newFilter);
      getListTransactionTopup(newFilter);
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

  const handleExport = () => {
    const { size, from, ...body } = filter;

    startTransition(async () => {
      await transactionApiInAdmin.exportMyTransaction(body);
    });
  };

  const columnTopup = [
    {
      title: 'Dom Dom ID',
      dataIndex: 'id',
      key: 'id',
      width: 190,
      render: (id, item) => <span className="line-clamp-3 text-xs">{id}</span>,
    },
    {
      title: t('EcomTransactionPagePayMeTransactionId'),
      dataIndex: 'transId',
      key: 'transId',
      width: 130,
      align: align.center,
      render: (transId) => {
        return <div className="text-xs">{transId}</div>;
      },
    },

    {
      title: t('EcomTransactionPageAmountWithoutTax'),
      dataIndex: 'baseAmount',
      key: 'baseAmount',
      width: 140,
      align: align.center,
      render: (baseAmount) => {
        return <div className="text-xs">{formatNumber(baseAmount)}</div>;
      },
    },
    {
      title: t('EcomTransactionPageTaxAmount'),
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      width: 130,
      align: align.center,
      render: (vatAmount) => {
        return <div className="text-xs">{formatNumber(vatAmount)}</div>;
      },
    },
    {
      title: t('EcomTransactionPageAmountWithinTax'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 145,
      align: align.center,
      render: (totalAmount) => {
        return <div className="text-xs">{formatNumber(totalAmount)}</div>;
      },
    },
    {
      title: t('EcomTransactionPagePaymentTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (createdAt) => (
        <div className="line-clamp-3 text-xs">{createdAt ? renderDateTimeV2(createdAt) : null}</div>
      ),
    },
    {
      title: t('EcomTransactionPagePaymentMethod'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 160,
      align: align.center,
      render: (paymentMethod) =>
        listPaymentMethod.map(
          (method) =>
            method?.name === paymentMethod && (
              <label className="flex items-center text-xs font-medium">
                <Image
                  className="mr-2 object-contain"
                  src={method?.labelNode}
                  alt="Payment method"
                  width={20}
                  height={20}
                />
                {t(method?.label)}
              </label>
            ),
        ),
    },
    {
      title: t('EcomProjectManagementPageListContractNumber'),
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      width: 110,
      align: align.center,
      render: (contactNumber) => contactNumber,
    },
    {
      title: t('EcomTransactionPagePaymentMethodType'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 90,
      align: align.center,
      render: (paymentMethod) => (
        <label className="text-xs">
          {paymentMethod === 'CREDIT_INTERNATIONAL' ? comm('NOT_VIETNAM') : comm('IN_VIETNAM')}
        </label>
      ),
    },
    {
      title: t('EcomTransactionPageStatus'),
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 130,
      align: align.center,
      render: (orderStatus: number) =>
        listStatusTopUpTransaction.map(
          (status) =>
            status.value === orderStatus && (
              <label className={`text-xs font-medium ${status.classCode}`}>{t(status?.name)}</label>
            ),
        ),
    },
    {
      title: t('EcomTransactionPagePoint'),
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      width: 130,
      align: align.center,
      render: (totalPoint, item) => {
        return (
          <div className="text-xs">
            {(item?.orderStatus === 1 && //  1: thành công, thành công mới cho hiển thị số điểm
              formatNumber(totalPoint)) ??
              '--'}
          </div>
        );
      },
    },
    {
      title: t('EcomTransactionPagePointsExpiryDate'),
      dataIndex: 'pointExpiredDate',
      key: 'pointExpiredDate',
      width: 180,
      align: align.center,
      render: (pointExpiredDate) => {
        return (
          <div className="text-xs">
            {pointExpiredDate ? renderDateTimeV2(pointExpiredDate) : null}
          </div>
        );
      },
    },
  ];

  const renderFilterProject = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <Form
            form={formFilterProject}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2">
                <div className="col-span-12 lg:col-span-6">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomTransactionUserWalletPageSearchBarSearch')}
                    placeholder={t('EcomTransactionUserWalletPageSearchBarSearch')}
                    onChange={(value) => handleSearch('keyword', value?.target?.value)}
                  />
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <Form.Item name="publishedDate">
                    <RangeDateFilter
                      placeholders={
                        [t('fromPublishedDate'), t('toPublishedDate')] as [string, string]
                      }
                      label={t('EcomTransactiongPageSearchBarDate')}
                      onChange={(dates) => handleSearch('publishedDate', dates)}
                      className="flex w-[100%] items-end"
                    />
                  </Form.Item>
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    isMultiple={true}
                    name="status"
                    label={t('EcomTransactionPagePaymentStatusFilter')}
                    options={listStatusTopUpTransaction.map((x) => ({
                      value: x.id,
                      label: t(x.name),
                      id: x.id,
                    }))}
                    onChange={(value) => handleSearch('status', value)}
                    placeholder={t('EcomTransactionPagePaymentStatusFilter')}
                  />
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    isMultiple={true}
                    name="paymentMethods"
                    label={t('EcomTransactionPagePaymentMethod')}
                    options={paymentMethods.map((x) => ({
                      value: x.value,
                      label: t(x.name),
                      id: x.value,
                    }))}
                    onChange={(value) => handleSearch('paymentMethods', value)}
                    placeholder={t('EcomTransactionPagePaymentMethod')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <Form.Item name="expiredDate">
                    <RangeDateFilter
                      placeholders={[t('fromExpryDate'), t('toExpryDate')] as [string, string]}
                      label={t('EcomTransactiongPageSearchBarDate')}
                      onChange={(dates) => handleSearch('expiredDate', dates)}
                      className="flex w-[100%] items-end"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="col-span-12 flex justify-end">
          <ButtonPrimary
            isLoading={isPending}
            icon={excelIcon}
            text={comm('Export')}
            onClick={() => handleExport()}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div>{renderFilterProject()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: filter?.from / filter.size + 1,
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
  );
};

export default TopupPage;
