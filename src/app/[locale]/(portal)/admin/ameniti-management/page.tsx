'use client';
import apiAmenityService from '@/apiServices/externalApiServices/apiAmenityService';
import listingCategoriApiService from '@/apiServices/externalApiServices/apiListingCategoryService';
import AppRadioFilter from '@/components/AppFormFilter/AppRadioFilter.tsx/AppRadioFilter';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, plusIcon } from '@/libs/appComponents';
import {
  ListamenityType,
  activeStatus,
  align,
  amenityType,
  appPermissions,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, renderStatusActive, validKey } from '@/libs/helper';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import AmenitiDetailPopup from './components/AmenitiDetailPopup';

const props: (keyof IStaffFilterModelInAdmin)[] = ['keyword', 'type', 'from', 'size'];

const AmenitiManagementPage: React.FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [idDetail, setIdDetail] = useState(undefined);
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [amenities, setAmenities] = useState([] as any);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getParamFromUrl();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      getListAmenity();
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
      keyWord: undefined,
      type: amenityType.In,
      status: undefined,
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

  const getListAmenity = async () => {
    const response = await apiAmenityService.getAll(filter);

    setAmenities(response);
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
      setTimeout(() => getListAmenity(), 400);
    } catch {
      notify('error', errorNoti('updateAPI'));
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
      getListAmenity();
    }
  };

  const columns = [
    {
      title: t('EcomMemberPageListAmenityTitle'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name, item) => (
        <div className="group flex min-h-[25px] w-full items-center justify-between">
          <div className="flex w-[95%]">
            <label className="text-xs"> {name ?? '--'}</label>
          </div>
          {/* <div className="hidden w-[5%] group-hover:block">
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
              {icon.moreAction}
            </Dropdown>
          </div> */}
        </div>
      ),
    },
    {
      title: t('EcomMemberPageListAmenityIcon'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 150,
      align: align.center,
      render: (imageUrl, item) => (
        <div className="flex justify-center">
          <Image src={imageUrl} width={20} height={20} alt={item?.name} />
        </div>
      ),
    },
    {
      title: t('EcomMemberPageListProductAmenityStatus'),
      dataIndex: 'status',
      key: 'status',
      align: align.center,
      width: 150,
      render: (status) => renderStatusActive(status, t('Active'), t('InActive')),
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

  const renderFilter = () => {
    return (
      <div className="ite grid grid-cols-12">
        <div className="col-span-10">
          <Form
            form={formFilter}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12">
                  <AppRadioFilter
                    name="type"
                    onChange={triggerSearch}
                    options={ListamenityType.map((item) => ({
                      id: item.id,
                      name: comm(item.name),
                    }))}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomPropertyListingPageSearchBarSearch')}
                    placeholder={t('EcomAmenityPageSearchBarPlaceholder')}
                    onChange={triggerSearch}
                  />
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="isActive"
                    label={t('EcomPropertyListingPageSearchBarStatus')}
                    placeholder={t('EcomPropertyListingPageSearchBarStatus')}
                    options={activeStatus.map((x) => ({
                      value: x.id,
                      label: t(x.name),
                      id: x.id,
                    }))}
                    onChange={triggerSearch}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="col-span-2 flex items-end justify-end">
          <div className="w-fit">
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
  };

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
            {t('EcomMemberPageListAmenity')}
          </h1>
        </div>
        <div>{renderFilter()}</div>
        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: amenities.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={amenities?.data}
              scroll={{ y: '65vh', scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>

      <AmenitiDetailPopup open={isShowDetail} idDetail={idDetail} closeModal={onCloseDetail} />
    </>
  ) : (
    <WaringPermission />
  );
};

export default AmenitiManagementPage;
