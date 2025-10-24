'use client';
import roleApiService from '@/apiServices/externalApiServices/apiRoleService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, moreActionIcon, plusIcon } from '@/libs/appComponents';
import { activeStatus, align, appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, renderStatusActive, validKey } from '@/libs/helper';
import { ISRolelterModelInAdmin } from '@/models/roleModel/roleFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Dropdown, Menu, Table } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const props: (keyof ISRolelterModelInAdmin)[] = [
  'keyword',
  'fromDate',
  'toDate',
  'createdBy',
  'isActive',
  'from',
  'size',
];

const RolesPage: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [listRole, setListRole] = useState([] as any);
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
      getRoleList();
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
      createdBy: null,
      userApproveOrReject: null,
      type: null,
      fromDate: null,
      toDate: null,
      isActive: null,
      from: 0,
      size: 10,
    };

    props.forEach((key: keyof ISRolelterModelInAdmin) => setFormFilter(valuesFilter, key));

    formFilter.setFieldsValue({
      ...valuesFilter,
    });
    setFilter({ ...valuesFilter });
    setInitialLoad(false);
  };

  const getRoleList = async () => {
    const staffsResponse: any = await roleApiService.getListRole(filter);

    setListRole(staffsResponse);
  };

  const handleChangePage = (pagination: any) => {
    const valuesFilter = pushParamsFilterToHeader({
      from: (pagination.current - 1) * pagination.pageSize,
      size: pagination.pageSize,
    });
    setFilter({ ...valuesFilter });
  };

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

  const triggerSearch = debounce(async () => {
    const valuesFilter = pushParamsFilterToHeader({ from: 0 });

    setFilter((prevFilter) => ({
      ...prevFilter,
      ...valuesFilter,
      from: 0,
    }));
  }, 300);

  const onEdit = (id: string) => {
    if (id) {
      push(`/admin/quan-ly-phan-quyen/${id}`);
    }
  };

  const columns = [
    {
      title: t('EcomMemberPageListViewRoleName'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name, item) => {
        return (
          <div className="group flex w-full items-center justify-between">
            <div className="flex w-[95%]">
              <div className="flex w-full truncate">
                <a
                  onClick={() =>
                    checkPermissonAcion(userInfo?.accesses, [
                      roleAdminGod,
                      appPermissions.portal_roles.update,
                      appPermissions.portal_roles.admin,
                    ])
                      ? onEdit(item.id)
                      : undefined
                  }
                  className="self-center"
                >
                  <span className="w-full text-sm">{name ?? '--'}</span>
                </a>
              </div>
            </div>
            <div className="hidden w-[5%] group-hover:block">
              <Dropdown trigger={['click']} overlay={<Menu></Menu>} placement="bottomLeft">
                <button className="self-center">{moreActionIcon}</button>
              </Dropdown>
            </div>
            <div className="block w-[5%] group-hover:hidden"></div>
          </div>
        );
      },
    },
    {
      title: t('EcomMemberPageListViewRoleNote'),
      dataIndex: 'note',
      key: 'note',
      width: 200,
      align: align.center,
      render: (note) => note,
    },
    {
      title: t('EcomMemberPageListViewStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
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
          <button
            className="mr-1"
            onClick={() =>
              checkPermissonAcion(userInfo?.accesses, [
                roleAdminGod,
                appPermissions.portal_roles.update,
                appPermissions.portal_roles.admin,
              ])
                ? onEdit(item.id)
                : undefined
            }
          >
            {editIcon}
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
                    label={t('EcomRolePageSearchBarSearch')}
                    placeholder={t('EcomRolePageSearchBarSearch')}
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
              appPermissions.portal_roles.insert,
              appPermissions.portal_roles.admin,
            ]) && (
              <ButtonPrimary
                size="middle"
                icon={plusIcon}
                text={comm('AddNew')}
                onClick={() => push(`/admin/quan-ly-phan-quyen/${'add-new'}`)}
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
      appPermissions.portal_roles.view,
      appPermissions.portal_roles.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarRoleManagement')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomLeftMenuBarRoleManagement')}
          </h1>
        </div>
        <div>{renderFilter()}</div>
        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: listRole.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={listRole?.data}
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

export default RolesPage;
