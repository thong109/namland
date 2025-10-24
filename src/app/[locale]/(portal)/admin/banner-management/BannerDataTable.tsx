'use client';
import bannerApiService from '@/apiServices/externalApiServices/bannerApiService';
import memberApiService from '@/apiServices/externalApiServices/memberApiService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { plusIcon } from '@/libs/appComponents';
import {
  align,
  appPermissions,
  listPositionBanner,
  renderDate,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, renderStatusActive, validKey } from '@/libs/helper';
import { BannerListModel } from '@/models/propertyModel/bannerListModal';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const props: (keyof IStaffFilterModelInAdmin)[] = [
  'keyword',
  'fromDate',
  'toDate',
  'createdBy',
  'type',
  'isActive',
  'from',
  'size',
];

const BannerDataTable: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [listUser, setListUser] = useState<any[]>([]);
  const [banners, setBanners] = useState([] as any);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getParamFromUrl();
    initDataFilter();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      getListData();
    }
  }, [filter]);

  const initDataFilter = async () => {
    const users = await memberApiService.getListAccount('');
    setListUser(users.data || []);
  };

  const setFormFilter = (valuesFilter, prop: string) => {
    if (searchParams.get(prop) !== null && typeof searchParams.get(prop) !== 'undefined') {
      switch (prop) {
        case 'fromDate':
          valuesFilter[prop] = dayjs(searchParams.get(prop));
          break;
        case 'toDate':
          valuesFilter[prop] = dayjs(searchParams.get(prop));
          break;
        case 'multipleStatusListting':
          const multipleStatusListting = searchParams.get(prop).split(',').map(Number);
          valuesFilter[prop] = multipleStatusListting;

          break;
        default:
          valuesFilter[prop] = searchParams.get(prop);
          break;
      }
    }
    if (valuesFilter?.fromDate && valuesFilter?.toDate) {
      valuesFilter.publishedDate = [valuesFilter?.fromDate, valuesFilter?.toDate];
    }
  };

  const getParamFromUrl = () => {
    let valuesFilter: any = {
      createdBy: null,
      type: null,
      fromDate: null,
      toDate: null,
      isActive: null,
      from: 0,
      size: 10,
    };

    props.forEach((key: keyof IStaffFilterModelInAdmin) => setFormFilter(valuesFilter, key));

    formFilter.setFieldsValue({
      ...valuesFilter,
    });
    setFilter({ ...valuesFilter });
    setInitialLoad(false);
  };

  const getListData = async () => {
    const response = await bannerApiService.getBannerList(filter);

    setBanners(response);
  };

  const handleChangePage = (pagination: any) => {
    const valuesFilter = pushParamsFilterToHeader({
      from: (pagination.current - 1) * pagination.pageSize,
      size: pagination.pageSize,
    });
    setFilter({ ...valuesFilter });
  };
  const triggerSearch = debounce(async () => {
    const valuesFilter = pushParamsFilterToHeader({ from: 0 });

    setFilter((prevFilter) => ({
      ...prevFilter,
      ...valuesFilter,
      from: 0,
    }));
  }, 300);

  const pushParamsFilterToHeader = (pageChange?: any) => {
    const values = formFilter.getFieldsValue();

    const queryStr = Object.keys(values)
      .filter((key) => validKey(values, key))
      .map((key) => {
        if (
          key === 'publishedDate' &&
          values.publishedDate?.some((item) => item !== null && item !== undefined)
        ) {
          return `fromDate=${values[key][0]}&toDate=${values[key][1]}`;
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
    return {
      ...values,
      from: pageChange?.from ?? filter.from,
      size: pageChange?.size ?? filter.size,
    };
  };
  const onEdit = (id: string) => {
    if (id) {
      push(`/admin/banner-management/banner/${id}`);
    }
  };

  const columns: ColumnsType<BannerListModel> = [
    {
      title: t('EcomBannerManagementPageCreateCampaignTitle'),
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string, item: BannerListModel) => (
        <div>
          <a
            onClick={() =>
              checkPermissonAcion(userInfo?.accesses, [
                roleAdminGod,
                appPermissions.portal_banner.view,
                appPermissions.portal_banner.update,
                appPermissions.portal_banner.admin,
              ])
                ? onEdit(item.id)
                : undefined
            }
            className="line-clamp-2 text-xs"
          >
            {text ?? '--'}
          </a>
        </div>
      ),
    },
    {
      title: t('EcomBannerManagementPageCreatePosition'),
      dataIndex: 'position',
      key: 'position',
      align: align.center,
      width: 130,
      render: (text: string, item: BannerListModel) => (
        <div className="text-xs">
          {t(listPositionBanner.find((x) => x.id === item.position)?.name)}
        </div>
      ),
    },
    {
      title: t('EcomBannerManagementPageCreateStartDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      align: align.center,
      render: (startDate) => (
        <div className="text-xs">{startDate ? renderDate(startDate) : '--'}</div>
      ),
    },
    {
      title: t('EcomBannerManagementPageCreateEndDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      align: align.center,
      render: (endDate) => <div className="text-xs">{endDate ? renderDate(endDate) : '--'}</div>,
    },
    columnCreate(),
    {
      title: t('EcomBannerManagementPageAdBannerListViewStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: align.center,
      render: (isActive) => renderStatusActive(isActive, t('Active'), t('InActive')),
    },
  ];

  const renderFilter = () => {
    return (
      <div className="grid grid-cols-12 gap-x-2">
        <div className="col-span-10">
          <Form
            form={formFilter}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="grid grid-cols-12 gap-x-2">
              <div className="col-span-12 lg:col-span-6">
                <AppSearchFilter
                  name="keyword"
                  placeholder={t('EcomPropertyListingPageSearchBannernamePlaceholder')}
                  onChange={triggerSearch}
                />
              </div>
              <div className="col-span-5">
                <AppSelectFilter
                  onChange={triggerSearch}
                  placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  label={t('EcomBannerManagementPageAdBannerListViewPosition')}
                  options={listPositionBanner?.map((x) => ({
                    value: x.id,
                    label: t(x.name),
                  }))}
                  name={'position'}
                />
              </div>

              <div className="col-span-4">
                <Form.Item name="date">
                  <RangeDateFilter
                    label={t('EcomPropertyListingPageSearchBarDate')}
                    // onChange={(value) => onfilterTable('date', value)}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className="col-span-2 flex items-center justify-end">
          <ButtonPrimary
            size="middle"
            icon={plusIcon}
            text={comm('AddNew')}
            onClick={() => push(`/admin/banner-management/banner/${'add-new'}`)}
          />
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_banner.view,
      appPermissions.portal_banner.admin,
    ]) ? (
    <>
      <div>{renderFilter()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: filter?.from / filter.size + 1,
            total: banners.total ?? 0,
            onChange: handleChangePage,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            columns={columns}
            className="overflow-x-auto"
            dataSource={banners?.data}
            scroll={{ y: '65vh', scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default BannerDataTable;
