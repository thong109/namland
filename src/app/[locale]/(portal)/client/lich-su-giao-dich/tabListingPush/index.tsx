'use client';
import transactionApiInAdmin from '@/apiServices/externalApiServices/apiTransactionService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreateDate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import { excelIcon } from '@/libs/appComponents';
import {
  align,
  listPackage,
  listStatusProject,
  PackageExpiredStatus,
  renderDateTimeV2,
} from '@/libs/appconst';
import { blockKeyEnter, formatNumber, validKey } from '@/libs/helper';
import { Table } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
type IProps = {
  activeKey: string;
  tabKey: string;
};

const ListingPushPage = (props: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const [formFIlter] = Form.useForm();
  const [listTransaction, setListTransaction] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListTransactionListPush();
    }
  }, [filter, props.activeKey, props.tabKey]);

  const getListTransactionListPush = async () => {
    const responseData: any = await transactionApiInAdmin.getListTransactionListPush(filter);
    setListTransaction(responseData);
  };

  const handleChangePage = (pagination: any) => {
    const valuesFilter = pushParamsFilterToHeader({
      from: (pagination.current - 1) * pagination.pageSize,
      size: pagination.pageSize,
    });
    setFilter({ ...valuesFilter });
  };

  const pushParamsFilterToHeader = (pageChange?: any) => {
    const values = formFIlter.getFieldsValue();

    const queryStr = Object.keys(values)
      .filter((key) => validKey(values, key))
      .map((key) => {
        if (
          key === 'publishedDate' &&
          values.publishedDate?.some((item) => item !== null && item !== undefined)
        ) {
          return `fromDate=${dayjs(values[key][0]).toJSON()}&toDate=${dayjs(values[key][1]).toJSON()}`;
        } else if (key !== 'priceRange') {
          return `${key}=${values[key]}`;
        } else {
          return '';
        }
      })
      .filter((x) => x != null && x != '')
      .concat([`from=${pageChange?.from ?? filter.from}`])
      .concat([`size=${pageChange?.size ?? filter.size}`])
      .join('&');

    window.history.pushState({}, '', pathname + '?' + queryStr);

    if (values.publishedDate) {
      values.fromDate = dayjs(values.publishedDate[0]).toJSON();
      values.toDate = dayjs(values.publishedDate[1]).toJSON();
      delete values.publishedDate;
    }

    return {
      ...values,
      from: pageChange?.from ?? filter.from,
      size: pageChange?.size ?? filter.size,
    };
  };
  const triggerSearch = debounce(async () => {
    const valuesFilter = pushParamsFilterToHeader({ from: 0 });

    setFilter((prevFilter) => ({
      ...prevFilter,
      ...valuesFilter,
      from: 0,
    }));
  }, 300);

  const handleExport = () => {
    const { size, from, ...body } = filter;

    startTransition(async () => {
      await transactionApiInAdmin.exportMyTransactionPush(body);
    });
  };

  const columnTopup = [
    {
      title: t('EcomTransactionPageIdTransaction'),
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 170,
      render: (transactionId) => <a className="line-clamp-3 text-xs">{transactionId}</a>,
    },
    {
      title: t('EcomTransactionPageIdTransactionPackage'),
      dataIndex: 'listingPackageType',
      key: 'listingPackageType',
      width: 110,
      align: align.center,

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
      dataIndex: 'numberOfPush',
      key: 'numberOfPush',
      width: 110,
      align: align.center,
      ellipsis: true,
      render: (numberOfPush) => {
        return <div className="text-xs">{numberOfPush}</div>;
      },
    },
    {
      title: t('EcomTransactionPageIdTransactionPoint'),
      dataIndex: 'totalPoint',
      key: 'totalPoint',
      width: 130,
      align: align.center,
      render: (managedBy) => {
        return <div className="text-xs">{formatNumber(managedBy) ?? '--'}</div>;
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
  ];

  const renderFilterProject = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          <Form
            form={formFIlter}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <div className="w-full lg:flex lg:justify-between">
                  <div className="grid w-full grid-cols-12 gap-x-2">
                    <div className="col-span-12 lg:col-span-4">
                      <AppSearchFilter
                        name="keyword"
                        label={t('EcomTransactionPageSearchBarSearch')}
                        placeholder={t('EcomTransactionPageSearchBarPlaceholder')}
                        onChange={triggerSearch}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-2">
                      <AppSelectFilter
                        name="packageType"
                        label={t('EcomPackagePagePackageType')}
                        options={listPackage.map((x) => ({
                          value: x.id,
                          label: comm(x.name),
                          id: x.id,
                        }))}
                        onChange={triggerSearch}
                        placeholder={t('EcomPackagePagePackageType')}
                      />
                    </div>

                    <div className="col-span-12 lg:col-span-2">
                      <AppSelectFilter
                        name="type"
                        label={t('EcomListPackageDetailListingType')}
                        options={listStatusProject.map((x) => ({
                          value: x.id,
                          label: t(x.name),
                          id: x.id,
                        }))}
                        onChange={triggerSearch}
                        placeholder={t('EcomListPackageDetailListingType')}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <Form.Item name="publishedDate">
                        <RangeDateFilter
                          placeholder={t('EcomTransactionPageSearchBarDate')}
                          label={t('EcomTransactiongPageSearchBarDate')}
                          onChange={(value) => {
                            if (value && value[0] !== null && value[1] !== null) {
                              triggerSearch();
                            }
                            if (value === null) {
                              triggerSearch();
                            }
                          }}
                          className="flex w-[100%] items-end"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="col-span-2 flex justify-end">
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
            onChange: handleChangePage,
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

export default ListingPushPage;
