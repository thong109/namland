'use client';
import listingCategoriApiService from '@/apiServices/externalApiServices/apiListingCategoryService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import SortDrawer from '@/components/SortDrawer';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, moreActionIcon, plusIcon } from '@/libs/appComponents';
import {
  activeStatus,
  align,
  appPermissions,
  listStatusProject,
  listingType,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, renderStatusActive, validKey } from '@/libs/helper';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { SortAscendingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import ModalDetail from './components/ModalDetail';

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

const ProductTypePage: React.FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const pathname = usePathname();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [idDetail, setIdDetail] = useState(undefined);
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [productTypes, setProductTypes] = useState([] as any);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });
  const [showSort, setShowSort] = useState<boolean>(false);
  const [dataSort, setDataSort] = useState<any[]>([]);
  useEffect(() => {
    getParamFromUrl();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      getProductType();
    }
  }, [filter]);

  const openOrCloseDrawer = async (typeCategory: number) => {
    if (showSort) {
      setShowSort(false);
    } else {
      const response = await listingCategoriApiService.getPropertyTypes({ type: typeCategory });
      const dataSort = response.data.sort(function (a, b) {
        return a.order - b.order;
      });

      setDataSort(dataSort ?? []);
      setShowSort(true);
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

    // props.forEach((key: keyof IStaffFilterModelInAdmin) => setFormFilter(valuesFilter, key));

    formFilter.setFieldsValue({
      ...valuesFilter,
    });
    setFilter({ ...valuesFilter });
    setInitialLoad(false);
  };

  const getProductType = async () => {
    const response = await listingCategoriApiService.getAll(filter);

    setProductTypes(response);
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

  const onActiveOrInactive = async (item) => {
    try {
      await listingCategoriApiService.activeOrInActice(item.id);
      notify('success', success('updateAPI'));
      setTimeout(() => getProductType(), 400);
    } catch {
      notify('error', errorNoti('updateAPI'));
    }
  };

  const updateOrder = async (ids) => {
    if (ids.length > 0) {
      await listingCategoriApiService.updateOrder(ids);
      notify('success', success('updateAPI'));
    }
  };

  const onShowDetail = (id: string) => {
    if (id) {
      setIdDetail(id);
    } else {
      setIdDetail(null);
    }
    setIsShowDetail(true);
  };

  const onCloseDetail = (isReload: boolean) => {
    setIsShowDetail(false);
    if (isReload) {
      getProductType();
    }
  };

  const columns = [
    {
      title: t('EcomMemberPageListProductTypeName'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name, item) => (
        <div className="group flex min-h-[25px] w-full items-center justify-between">
          <div className="flex w-[95%]">
            <label className="text-xs"> {name ?? '--'}</label>
          </div>
          <div className="hidden w-[5%] group-hover:block">
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() =>
                      checkPermissonAcion(userInfo?.accesses, [
                        roleAdminGod,
                        appPermissions.portal_listingcategory.update,
                        appPermissions.portal_listingcategory.admin,
                      ])
                        ? onActiveOrInactive(item)
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-start">
                      {item.isActive ? comm('BTN_INACTIVE') : comm('BTN_ACTIVE')}
                    </div>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              {moreActionIcon}
            </Dropdown>
          </div>
        </div>
      ),
    },
    {
      title: t('EcomBannerManagementPageProductTypeType'),
      dataIndex: 'type',
      key: 'type',
      align: align.center,
      width: 100,
      render: (type) => <>{t(listStatusProject.find((item) => item.id === type)?.name)}</>,
    },
    columnCreate(),
    {
      title: t('EcomMemberPageListProductTypeStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      align: align.center,
      width: 100,
      render: (isActive) => renderStatusActive(isActive, t('Active'), t('InActive')),
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 90,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          <button className="mr-1" onClick={() => onShowDetail(id)}>
            {editIcon}
          </button>
        </div>
      ),
    },
  ];

  const renderFilter = () => (
    <div className="grid grid-cols-12">
      <div className="col-span-9">
        <Form
          form={formFilter}
          layout="horizontal"
          size="middle"
          onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
        >
          <div className="w-full lg:flex lg:justify-between">
            <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
              <div className="col-span-12 lg:col-span-5">
                <AppSearchFilter
                  name="keyword"
                  label={t('EcomPropertyListingPageSearchBarSearch')}
                  placeholder={t('EcomPropertyLProductTypePageSearchBarPlaceholder')}
                  onChange={triggerSearch}
                />
              </div>
              <div className="col-span-12 lg:col-span-3">
                <AppSelectFilter
                  name="type"
                  label={t('EcomBannerManagementPageProductTypeType')}
                  options={listStatusProject.map((x) => ({
                    value: x.id,
                    label: t(x.name),
                    id: x.id,
                  }))}
                  onChange={triggerSearch}
                  placeholder={t('EcomBannerManagementPageProductTypeType')}
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
          </div>
        </Form>
      </div>
      <div className="col-span-3 flex justify-end">
        <div className="flex w-fit">
          <Dropdown
            trigger={['click']}
            className="mr-1"
            overlay={
              <Menu>
                <Menu.Item>
                  <Button
                    size="middle"
                    type="text"
                    onClick={() => openOrCloseDrawer(listingType.sale)}
                  >
                    {comm('SORT_SALE')}
                  </Button>
                </Menu.Item>

                <Menu.Item>
                  <Button
                    size="middle"
                    type="text"
                    onClick={() => openOrCloseDrawer(listingType.rent)}
                  >
                    {comm('SORT_RENT')}
                  </Button>
                </Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
          >
            <ButtonPrimary size="middle" icon={<SortAscendingOutlined />} text={''} />
          </Dropdown>

          <ButtonPrimary
            size="middle"
            icon={plusIcon}
            text={comm('AddNew')}
            onClick={() => onShowDetail(null)}
          />
        </div>
      </div>
    </div>
  );

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_listingcategory.view,
      appPermissions.portal_listingcategory.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomMemberPageListProductType')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomMemberPageListProductType')}
          </h1>
        </div>
        <div>{renderFilter()}</div>
        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: productTypes.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={productTypes?.data}
              scroll={{ y: '65vh', scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>

      <ModalDetail open={isShowDetail} idDetail={idDetail} closeModal={onCloseDetail} />
      <SortDrawer
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

export default ProductTypePage;
