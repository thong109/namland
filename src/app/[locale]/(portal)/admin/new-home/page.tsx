'use client';
import newHomeApiService from '@/apiServices/externalApiServices/apiNewHomeService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { align, appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertFilterDate,
  renderStatusActive,
} from '@/libs/helper';
import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState } from 'react';

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

const NewHomePage: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { push } = useRouter();

  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();
  const [userWallets, setUserWallets] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getListNewHome(filter);
  }, []);

  const currentPage = () => Math.floor(filter.from / filter.size) + 1;

  const getListNewHome = async (dataFilter) => {
    const newsResponse: any = await newHomeApiService.getAll(dataFilter);

    setUserWallets(newsResponse);
  };

  const handleSearch = debounce(async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getListNewHome(convertFilterDate(filter, value));
    } else {
      const newFilter = { ...filter, [name]: value };
      setFilter(newFilter);
      getListNewHome(newFilter);
    }
  }, 300);

  const gotoDetail = (id: number | null) => {
    if (id) {
      push(`/admin/new-home/${id}`);
    } else {
      push(`/admin/new-home/add-new`);
    }
  };

  const handleTableChange = (pagination: any) => {
    const newFilter = {
      ...filter,
      size: pagination?.pageSize,
      from: (pagination.current - 1) * pagination.pageSize,
    };

    getListNewHome(newFilter);
    setFilter(newFilter);
  };

  const columnsProject = [
    {
      title: t('EcomProjectManagementPageNewHomeTitle'),
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (title, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => gotoDetail(item?.id)}>
          {title}
        </a>
      ),
    },
    {
      title: t('EcomProjectManagementPageNewHomeInvestor'),
      dataIndex: 'investor',
      key: 'investor',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (investor) => {
        return <div className="text-xs">{investor ?? '--'}</div>;
      },
    },
    {
      title: t('EcomProjectManagementPageNewHomeTotalPrice'),
      dataIndex: 'fromPrice',
      key: 'fromPrice',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (fromPrice, record) => {
        return (
          <div className="text-xs">
            <NumberFormatPrice value={fromPrice}></NumberFormatPrice> -
            <NumberFormatPrice value={record?.toPrice}></NumberFormatPrice>
          </div>
        );
      },
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      align: align.center,
      render: (isActive) => renderStatusActive(isActive, t('Active'), t('InActive')),
    },
    {
      title: t('EcomProjectManagementPageListCreateBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      align: align.center,
      render: (createdBy) => <div className="text-xs">{createdBy}</div>,
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
                  label={t('EcomLeftMenuBarNewHomekeyword')}
                  placeholder={t('EcomLeftMenuBarNewHomekeyword')}
                  onChange={(value) => handleSearch('keyword', value?.target?.value)}
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
            appPermissions.newHomes.insert,
          ]) && <ButtonPrimary text={comm('AddNewHome')} onClick={() => gotoDetail(null)} />}
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [roleAdminGod, appPermissions.newHomes.view]) ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarNewHome')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomLeftMenuBarNewHome')}
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
              columns={columnsProject}
              dataSource={userWallets?.data}
              scroll={{ x: 800, y: 500, scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default NewHomePage;
