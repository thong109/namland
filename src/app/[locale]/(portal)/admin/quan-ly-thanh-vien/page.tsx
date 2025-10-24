'use client';
import memberApiService from '@/apiServices/externalApiServices/memberApiService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import LabelStatus from '@/components/LabelStatus/LabelStatus';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, moreActionIcon } from '@/libs/appComponents';
import {
  activeStatus,
  align,
  appPermissions,
  listAccountType,
  listAccountTypeFilter,
  roleAdminGod,
} from '@/libs/appconst';
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

const MemberPage: React.FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [members, setMembers] = useState([] as any);
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
      getMemberList();
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

  const getMemberList = async () => {
    let members: any;
    const membersResponse = await memberApiService.getListmember(filter);
    members = membersResponse ?? undefined;
    setMembers(members);
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

  const onEdit = (fullname: string, id: string) => {
    if (fullname) {
      push(`/admin/quan-ly-thanh-vien/memberId=${id}`);
    } else {
      push(`/admin/quan-ly-thanh-vien/memberId=${id}`);
    }
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
        await memberApiService.ActiveOrInActiveMember({
          isActive: !item.isActive,
          id: item.id,
        });
        setTimeout(() => {
          getMemberList();
        }, 1000);

        notify('success', success('updateAPI'));
      },
      onCancel() {},
    });
  };

  const handleExport = debounce(async () => {
    await memberApiService.exportMembers(filter);
  }, 300);

  const columns = [
    {
      title: t('EcomMemberPageListViewMember'),
      dataIndex: 'EcomLeftMenuBarMember',
      key: 'EcomLeftMenuBarMember',
      width: 160,
      render: (member, item) => {
        return (
          <div className="group flex w-full items-center justify-between">
            <div className="flex w-[95%]">
              <div className="line-clamp-2 flex w-full">
                <a
                  onClick={() =>
                    checkPermissonAcion(userInfo?.accesses, [
                      roleAdminGod,
                      appPermissions.portal_member.view,
                      appPermissions.portal_member.update,
                      appPermissions.portal_member.admin,
                    ])
                      ? onEdit(item.fullName, item.id)
                      : undefined
                  }
                  className="self-center"
                >
                  <span> {item.fullName ?? '--'}</span>
                </a>
              </div>
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
                          appPermissions.portal_member.update,
                          appPermissions.portal_member.admin,
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
                <button
                  // onClick={() => onEdit(item.id, item.status)}
                  className="self-center"
                >
                  {moreActionIcon}
                </button>
              </Dropdown>
            </div>
            <div className="block w-[5%] group-hover:hidden"></div>
          </div>
        );
      },
    },

    {
      title: t('EcomContactListDetailPageDetailPhone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      align: align.center,
      render: (phone) => <span className="text-xs">{convertPhoneNumber84To0(phone) ?? '--'}</span>,
    },
    {
      title: t('EcomContactListDetailPageDetailEmail'),
      dataIndex: 'email',
      key: 'email',
      width: 160,
      align: align.center,
      render: (email) => <span className="w-full text-xs">{email ?? '--'}</span>,
    },
    {
      title: t('EcomContactListDetailPageDetailTypeMember'),
      dataIndex: 'accountType',
      key: 'accountType',
      width: 150,
      align: align.center,
      render: (text, item) =>
        listAccountType.map(
          (value) =>
            value.value === item?.accountType && (
              <LabelStatus
                text={comm(value?.name)}
                textColor="text-[#111820] text-xs"
                backgroundColor="bg-[#DEE3ED]"
              />
            ),
        ),
    },
    columnCreate(),
    {
      title: t('EcomMemberPageListViewStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: align.center,
      render: (isActive) => renderStatusActive(isActive, t('Active'), t('InActive')),
    },

    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_member.view,
            appPermissions.portal_member.update,
            appPermissions.portal_member.admin,
          ]) && (
            <button className="mr-1" onClick={() => onEdit(item.fullName, item.id)}>
              {editIcon}
            </button>
          )}
          {/* <button onClick={() => onActiveOrInactive(item)}>{icon.delete}</button> */}
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
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2">
                <div className="col-span-12 lg:col-span-4">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomMemberPageSearchBarSearch')}
                    placeholder={t('EcomMemberPageSearchBarSearch')}
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
                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="accountType"
                    label={t('EcomPropertyListingPageSearchBarStatus')}
                    options={listAccountTypeFilter.map((x) => ({
                      value: x.value,
                      label: comm(x.name),
                      id: x.value,
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
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_member.export,
            appPermissions.portal_member.admin,
          ]) && <ButtonPrimary text={comm('Export')} onClick={handleExport} />}
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
      <AppPageMeta title={t('EcomMemberPageListViewMemberManagement')} />
      <div className="w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomMemberPageListViewMemberManagement')}
          </h1>
        </div>
        <div>{renderFilter()}</div>

        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: members.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={members?.data}
              scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default MemberPage;
