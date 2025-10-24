'use client';
import staffApiService from '@/apiServices/externalApiServices/apiStaffService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { activeIcon, deleteIcon, editIcon, moreActionIcon, plusIcon } from '@/libs/appComponents';
import { activeStatus, align, appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertPhoneNumber84To0,
  renderStatusActive,
  validKey,
} from '@/libs/helper';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Dropdown, Menu, Modal, Table } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

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

const StaffPage: React.FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [listStaff, setListStaff] = useState([] as any);
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
      getStaffList();
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

  const getStaffList = async () => {
    const staffsResponse: any = await staffApiService.getListStaff(filter);

    setListStaff(staffsResponse);
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
    Modal.confirm({
      // icon: <ExclamationCircleOutlined />,
      content: t('EcomMemberChangeStatusAcount'),
      title: item.isActive
        ? t('EcomMemberChangeStatusAcountFalse')
        : t('EcomMemberChangeStatusAcountTrue'),
      okText: t('YES'),
      cancelText: t('NO'),
      centered: true,
      okType: 'default',
      async onOk() {
        await staffApiService.activeOrInActiveMember({
          isActive: !item.isActive,
          id: item.id,
        });
        setTimeout(() => {
          getStaffList();
        }, 1000);

        notify('success', success('updateAPI'));
      },
      onCancel() {},
    });
  };

  const onEdit = (id: string) => {
    if (id) {
      push(`/admin/quan-ly-nhan-vien/${id}`);
    }
  };
  const columns = [
    {
      title: t('EcomMemberPageListViewStaffUser'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      render: (fullName, item) => {
        return (
          <div className="group flex w-full items-center justify-between">
            <div className="flex w-[95%]">
              <div className="flex w-full truncate">
                <a
                  onClick={() =>
                    checkPermissonAcion(userInfo?.accesses, [
                      roleAdminGod,
                      appPermissions.portal_staff.update,
                      appPermissions.portal_staff.view,
                      appPermissions.portal_staff.admin,
                    ])
                      ? onEdit(item.id)
                      : undefined
                  }
                  className="self-center"
                >
                  <span className="w-full text-sm">
                    {fullName ?? `${item?.firstName + ' ' + item?.lastName}`}
                  </span>
                </a>
              </div>
            </div>
            <div className="hidden w-[5%] group-hover:block">
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    {/* <Menu.Item>
                      <div className="flex items-center justify-start ">
                        {comm("BTN_PUSH_WS")}
                      </div>
                    </Menu.Item> */}
                  </Menu>
                }
                placement="bottomLeft"
              >
                <button className="self-center">{moreActionIcon}</button>
              </Dropdown>
            </div>
            <div className="block w-[5%] group-hover:hidden"></div>
          </div>
        );
      },
    },
    {
      title: t('EcomCreateAPropertyPageDetailContactInformation'),
      dataIndex: 'phone',
      key: 'phone',
      width: 110,
      align: align.center,
      render: (phone, item) => (
        <div className="text-xs">
          {convertPhoneNumber84To0(phone) ?? '--'}
          <br />
          {item?.email ?? '--'}
        </div>
      ),
    },
    {
      title: t('EcomMemberPageListViewStaffRole'),
      dataIndex: 'accessGroupName',
      key: 'accessGroupName',
      width: 90,
      align: align.center,
      render: (accessGroupName) => accessGroupName,
    },
    {
      title: t('EcomMemberPageListViewStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 90,
      align: align.center,
      render: (isActive) => renderStatusActive(isActive, t('Active'), t('InActive')),
    },
    columnCreate(),
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 90,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          <button className="mr-1" onClick={() => onEdit(item.id)}>
            {editIcon}
          </button>
          <button onClick={() => onActiveOrInactive(item)}>
            <div className="flex items-center justify-start">
              {item.isActive ? deleteIcon : activeIcon}
            </div>
          </button>
        </div>
      ),
    },
  ];
  const renderFilter = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          <Form
            form={formFilter}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12 lg:col-span-4">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomStaffPageSearchBarSearch')}
                    placeholder={t('EcomStaffPageSearchBarSearch')}
                    onChange={triggerSearch}
                  />
                </div>

                <div className="col-span-12 lg:col-span-2">
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
        <div className="col-span-2 flex justify-end">
          <div className="w-fit">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_staff.insert,
              appPermissions.portal_staff.admin,
            ]) && (
              <ButtonPrimary
                size="middle"
                icon={plusIcon}
                text={comm('AddNew')}
                onClick={() => push(`/admin/quan-ly-nhan-vien/${'add-new'}`)}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_staff.view,
      appPermissions.portal_staff.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomMemberPageListViewStaffManagement')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomMemberPageListViewStaffManagement')}
          </h1>
        </div>
        <div>{renderFilter()}</div>
        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: listStaff.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={listStaff?.data}
              scroll={{ y: '65vh', scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default StaffPage;
