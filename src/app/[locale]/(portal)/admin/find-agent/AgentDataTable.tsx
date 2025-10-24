'use client';
import agentApiService from '@/apiServices/externalApiServices/findAgentService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import SortDrawerImage from '@/components/SortImage';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { moreActionIcon, plusIcon } from '@/libs/appComponents';
import { activeStatus, align, appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, renderStatusActive, validKey } from '@/libs/helper';
import { BannerListModel } from '@/models/propertyModel/bannerListModal';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Dropdown, Menu, Table } from 'antd';
import Form from 'antd/es/form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import AgentDetailModal from './components/AgentDetailModal';

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

const AgentDataTable: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [agents, setAgents] = useState([] as any);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });
  const [idDetail, setIdDetail] = useState<any>();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [showSort, setShowSort] = useState<boolean>(false);
  const [dataSort, setDataSort] = useState<any[]>([]);

  useEffect(() => {
    getParamFromUrl();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      getListData();
    }
  }, [filter]);

  const setFormFilter = (valuesFilter, prop: string) => {
    if (searchParams.get(prop) !== null && typeof searchParams.get(prop) !== 'undefined') {
      switch (prop) {
        case 'fromDate':
          valuesFilter[prop] = dayjs(searchParams.get(prop));
          break;
        case 'toDate':
          valuesFilter[prop] = dayjs(searchParams.get(prop));
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
    const response = await agentApiService.getAgentList(filter);

    setAgents(response);
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
  const onEdit = (id?: string) => {
    if (id) {
      setIdDetail(id);
    } else {
      setIdDetail(null);
    }

    setIsVisible(true);
  };

  const closeModal = (isReload: boolean) => {
    setIdDetail(null);
    setIsVisible(false);
    if (isReload) {
      getListData();
    }
  };

  const openOrCloseDrawer = async () => {
    if (showSort) {
      setShowSort(false);
    } else {
      const listData: any = await agentApiService.getListNoFilter();
      const dataSort = listData.sort(function (a, b) {
        return a.order - b.order;
      });

      setDataSort(dataSort ?? []);
      setShowSort(true);
    }
  };

  const updateOrder = async (ids) => {
    if (ids.length > 0) {
      await agentApiService.updateOrder(ids);
      notify('success', success('updateAPI'));
    }
  };

  const deleteAgent = async (item) => {
    try {
      await agentApiService.delete(item.id);
      notify('success', success('updateAPI'));
      setTimeout(() => getListData(), 400);
    } catch {
      notify('error', errorNoti('updateAPI'));
    }
  };

  const columns: ColumnsType<BannerListModel> = [
    {
      title: t('EcomFavoritesPageListAgentImage'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: '30%',
      render: (imageUrl, item) => {
        return (
          <div className="group flex w-full items-center justify-between">
            <div className="flex w-[95%]">
              <div className="flex w-full items-center truncate">
                <div
                  className="mr-2 w-full"
                  onClick={() =>
                    checkPermissonAcion(userInfo?.accesses, [
                      roleAdminGod,
                      appPermissions.portal_find_agent.view,
                      appPermissions.portal_find_agent.update,
                      appPermissions.portal_find_agent.admin,
                    ])
                      ? onEdit(item.id)
                      : undefined
                  }
                >
                  <img style={{ height: '136px', width: '156px' }} src={`${imageUrl}`} />
                </div>
              </div>
            </div>
            <div className="hidden w-[5%] group-hover:block">
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    {checkPermissonAcion(userInfo?.accesses, [
                      roleAdminGod,
                      appPermissions.portal_find_agent.delete,
                    ]) && (
                      <Menu.Item onClick={() => deleteAgent(item)}>
                        <div className="flex items-center justify-start">{comm('BTN_DELETE')}</div>
                      </Menu.Item>
                    )}
                  </Menu>
                }
                placement="bottomLeft"
              >
                {moreActionIcon}
              </Dropdown>
            </div>
          </div>
        );
      },
    },
    columnCreate(),
    {
      title: t('EcomBannerManagementPageAdBannerListViewStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: '00%',
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
              <div className="col-span-12 lg:col-span-3">
                <AppSelectFilter
                  name="isActive"
                  label={t('EcomPropertyListingPageSearchBarStatus')}
                  options={activeStatus.map((x) => ({
                    value: x.id,
                    label: t(x.name),
                    id: x.id,
                  }))}
                  onChange={triggerSearch}
                  placeholder={t('EcomPropertyListingPageSearchBarAll')}
                />
              </div>
            </div>
          </Form>
        </div>

        <div className="col-span-2 flex items-center justify-end">
          <ButtonPrimary
            size="middle"
            className="mr-1"
            text={comm('SORT_LIST')}
            onClick={() => openOrCloseDrawer()}
          />

          <ButtonPrimary
            size="middle"
            icon={plusIcon}
            text={comm('AddNew')}
            onClick={() => onEdit()}
          />
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_find_agent.view,
      appPermissions.portal_find_agent.admin,
    ]) ? (
    <>
      <div>{renderFilter()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: filter?.from / filter.size + 1,
            total: agents.total ?? 0,
            onChange: handleChangePage,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            columns={columns}
            className="overflow-x-auto"
            dataSource={agents?.data}
            scroll={{ y: '65vh', scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>

      <AgentDetailModal
        open={isVisible}
        closeModal={(isReload) => closeModal(isReload)}
        idDetail={idDetail}
      />

      <SortDrawerImage
        visible={showSort}
        setVisibleDrawer={openOrCloseDrawer}
        data={dataSort}
        handleSave={updateOrder}
      />
    </>
  ) : (
    <WaringPermission />
  );
};

export default AgentDataTable;
