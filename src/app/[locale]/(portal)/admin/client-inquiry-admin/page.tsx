'use client';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon } from '@/libs/appComponents';
import {
  align,
  appPermissions,
  listStatusTicketFilter,
  renderDateTime,
  roleAdminGod,
  typeInquiry,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertPhoneNumber84To0,
  formatNumber,
  validKey,
} from '@/libs/helper';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table, Tabs } from 'antd';
import Form from 'antd/es/form';
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
const tabKeys = {
  tabAllInquiry: 'TAB_ALL_INQUIRY',
  tabInquiryForMy: 'TAB_INQUIRY_FOR_ME',
  tabInquiryNewHomeForStaff: 'TAB_INQUIRY_NEW_HOME_FOR_STAFF',
  tabInquiryFindAHome: 'TAB_FIND_A_HOME',
};
const { TabPane } = Tabs;

const ClientInquiryAdmin: React.FC = () => {
  const t = useTranslations('webLabel');

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabAllInquiry);

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [myTickets, setMyTickets] = useState([] as any);
  const [ticketForMe, setTicketForMe] = useState([] as any);
  const [tickNewHomeForStaff, setTickNewHomeForStaff] = useState([] as any);
  const [ticketForFindAHome, setTicketForFindAHome] = useState([] as any);

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
      if (selectedIndex === tabKeys.tabAllInquiry) {
        getListAllInquiry();
      }

      if (selectedIndex === tabKeys.tabInquiryNewHomeForStaff) {
        getAllTicketNewHomeByStaff();
      }
      if (selectedIndex === tabKeys.tabInquiryFindAHome) {
        getAllTicketForFindAHome();
      }
    }
  }, [filter]);

  const getAllTicketForFindAHome = async () => {
    const responseData: any = await apiTicketManagement.getAllTicketForFindAHome(filter);

    setTicketForFindAHome(responseData);
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

  const getListAllInquiry = async () => {
    const responseData: any = await apiTicketManagement.getListTicketForStaffWithBoardView(filter);

    setMyTickets(responseData);
  };

  const getAllTicketNewHomeByStaff = async () => {
    const responseData: any = await apiTicketManagement.getAllTicketNewHomeByStaff(filter);

    setTickNewHomeForStaff(responseData);
  };

  const getListTicketForMe = async () => {
    const responseData: any = await apiTicketManagement.getListTicket(
      filter,
      typeInquiry.inquiryForMe,
    );
    setTicketForMe(responseData);
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
      push(`/admin/client-inquiry-admin/${id}`);
    }
  };

  const onEditInquiryNewHomeStaff = (id: string) => {
    if (id) {
      push(`/admin/new-home-inquiry-admin/${id}`);
    }
  };

  const onEditInquiryFindAHome = (id: string) => {
    if (id) {
      push(`/admin/find-a-home-detail/${id}`);
    }
  };

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
    formFilter.resetFields();
    setFilter({
      from: 0,
      size: 10,
    });
    setSelectedIndex(tabKey);
    if (tabKey === tabKeys.tabInquiryForMy) {
      getListTicketForMe();
    }
    if (tabKey === tabKeys.tabAllInquiry) {
      getListAllInquiry();
    }

    if (tabKey === tabKeys.tabInquiryNewHomeForStaff) {
      getAllTicketNewHomeByStaff();
    }
    if (tabKey === tabKeys.tabInquiryFindAHome) {
      getAllTicketForFindAHome();
    }
  };

  const columns = [
    {
      title: t('EcomTicketManagementInforPageClientName'),
      dataIndex: 'clientName',
      key: 'clientName',
      width: 130,
      render: (clientName, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => onEdit(item.id)}>
          {clientName}
        </a>
      ),
    },
    {
      title: t('EcomTicketManagementInforPageSearchBarOwnerPhone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 110,
      align: align.center,
      ellipsis: true,
      render: (phone) => {
        return <div className="text-xs">{convertPhoneNumber84To0(phone) ?? '--'}</div>;
      },
    },
    {
      title: t('EcomTicketManagementInforPageSearchBarOwnerEmail'),
      dataIndex: 'email',
      key: 'email',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (email) => {
        return <div className="whitespace-normal text-xs">{email ?? '--'}</div>;
      },
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarProject'),
      dataIndex: 'project',
      key: 'project',
      width: 150,
      align: align.center,
      render: (project) => <div className="text-xs">{project?.projectName}</div>,
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarStatus'),
      dataIndex: 'ticketStatus',
      key: 'ticketStatus',
      width: 140,
      align: align.center,
      render: (ticketStatus: number) =>
        listStatusTicketFilter.map(
          (status) =>
            status.value === ticketStatus && (
              <label className={`text-xs font-medium ${status.classCode}`}>{t(status?.name)}</label>
            ),
        ),
    },
    {
      title: t('EcomCommentManagementTableCreateAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 80,
      align: align.center,
      render: (createdAt) => <p className="text-xs">{renderDateTime(createdAt)}</p>,
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_ticket.view,
            appPermissions.portal_ticket.admin,
          ]) && (
            <button className="mr-1" onClick={() => onEdit(item.id)}>
              {editIcon}
            </button>
          )}
        </div>
      ),
    },
  ];

  const columnsNewHomeForStaff = [
    {
      title: t('EcomTicketManagementInforPageClientName'),
      dataIndex: 'clientName',
      key: 'clientName',
      width: 130,
      render: (clientName, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => onEditInquiryNewHomeStaff(item.id)}>
          {clientName}
          <br />
          {item?.phone}
          <br />
          {item?.email}
        </a>
      ),
    },
    {
      title: t('EcomProjectManagementPageNewHomeTitle'),
      dataIndex: 'newHomes',
      key: 'newHomes',
      width: 160,
      render: (newHomes) => <a className="line-clamp-3 text-xs">{newHomes?.title}</a>,
    },
    {
      title: t('EcomTicketManagementDetailPageDetailLocation'),
      dataIndex: 'newHomes',
      key: 'newHomes',
      width: 150,
      align: align.center,
      render: (newHomes) => {
        return <div className="line-clamp-3 text-xs">{newHomes?.location?.address ?? '--'}</div>;
      },
    },
    {
      title: t('EcomProjectManagementPageNewHomeTotalPrice'),
      dataIndex: 'newHomes',
      key: 'newHomes',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (newHomes) => {
        return (
          <div className="text-xs">
            {formatNumber(newHomes?.fromPrice)} - {formatNumber(newHomes?.toPrice)}{' '}
          </div>
        );
      },
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarCreatedDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      align: align.center,
      render: renderDateTime,
    },
  ];

  const columnsFindAHome = [
    {
      title: t('EcomTicketManagementInforPageClientName'),
      dataIndex: 'name',
      key: 'name',
      width: 130,
      render: (name, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => onEditInquiryFindAHome(item.id)}>
          {name}
        </a>
      ),
    },
    {
      title: t('FindHoneRequesLeaseTerm'),
      dataIndex: 'leaseTerm',
      key: 'leaseTerm',
      width: 150,
      render: (leaseTerm) => <a className="line-clamp-3 text-xs">{leaseTerm}</a>,
    },
    {
      title: t('FindHoneRequestBudgetRendRange'),
      dataIndex: 'budget',
      key: 'budget',
      width: 150,
      align: align.center,
      render: (budget) => {
        return <div className="line-clamp-3 text-xs">{budget ?? '--'}</div>;
      },
    },
    {
      title: t('FindHoneRequestTypeOfProperty'),
      dataIndex: 'typeOfProperty',
      key: 'typeOfProperty',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (typeOfProperty) => {
        return <div className="text-xs">{typeOfProperty}</div>;
      },
    },
    {
      title: t('FindHoneRequestMoveInDate'),
      dataIndex: 'moveInDate',
      key: 'moveInDate',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (moveInDate) => {
        return <div className="text-xs">{moveInDate}</div>;
      },
    },
    {
      title: t('EcomTicketManagementInforPageSearchBarCreatedDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      align: align.center,
      render: renderDateTime,
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          <button className="mr-1" onClick={() => onEditInquiryFindAHome(item.id)}>
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
                    label={t('EcomClientInquiryPageSearchBarSearch')}
                    placeholder={t('EcomClientInquiryPageSearchBarSearch')}
                    onChange={triggerSearch}
                  />
                </div>

                {selectedIndex !== tabKeys.tabInquiryNewHomeForStaff &&
                  selectedIndex !== tabKeys.tabInquiryFindAHome && (
                    <div className="col-span-12 lg:col-span-2">
                      <AppSelectFilter
                        name="ticketStatus"
                        label={t('EcomTicketManagementInforPageSearchStage')}
                        options={listStatusTicketFilter.map((x) => ({
                          value: x.id,
                          label: t(x.name),
                          id: x.id,
                        }))}
                        onChange={triggerSearch}
                        placeholder={t('EcomTicketManagementInforPageSearchStage')}
                      />
                    </div>
                  )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_ticket.view,
      appPermissions.portal_ticket.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomTicketManagementInforPageHeaderClientInquiryStaff')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomTicketManagementInforPageHeaderClientInquiryStaff')}
            </h1>
          </div>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabAllInquiry)} key={tabKeys.tabAllInquiry}>
            <div>{renderFilter()}</div>

            <div className="w-full sm:rounded-lg">
              <DataTableAdvanced
                showChangePageSize
                pagination={{
                  pageSize: filter?.size,
                  current: filter?.from / filter.size + 1,
                  total: myTickets?.total ?? 0,
                  onChange: handleChangePage,
                }}
              >
                <Table
                  size={'middle'}
                  pagination={false}
                  columns={columns}
                  className="overflow-x-auto"
                  dataSource={myTickets?.data}
                  scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
                />
              </DataTableAdvanced>
            </div>
          </TabPane>

          {/* <TabPane tab={t(tabKeys.tabInquiryForMy)} key={tabKeys.tabInquiryForMy}>
            <div>{renderFilter()}</div>

            <div className="w-full sm:rounded-lg">
              <DataTableAdvanced
                showChangePageSize
                pagination={{
                  pageSize: filter?.size,
                  current: filter?.from / filter.size + 1,
                  total: ticketForMe?.total ?? 0,
                  onChange: handleChangePage,
                }}
              >
                <Table
                  size={'middle'}
                  pagination={false}
                  columns={columns}
                  className="overflow-x-auto"
                  dataSource={ticketForMe?.data}
                  scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
                />
              </DataTableAdvanced>
            </div>
          </TabPane> */}

          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.newHomes.view,
          ]) && (
            <TabPane
              tab={t(tabKeys.tabInquiryNewHomeForStaff)}
              key={tabKeys.tabInquiryNewHomeForStaff}
            >
              <div>{renderFilter()}</div>

              <div className="w-full sm:rounded-lg">
                <DataTableAdvanced
                  showChangePageSize
                  pagination={{
                    pageSize: filter?.size,
                    current: filter?.from / filter.size + 1,
                    total: ticketForMe?.total ?? 0,
                    onChange: handleChangePage,
                  }}
                >
                  <Table
                    size={'middle'}
                    pagination={false}
                    columns={columnsNewHomeForStaff}
                    className="overflow-x-auto"
                    dataSource={tickNewHomeForStaff?.data}
                    scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
                  />
                </DataTableAdvanced>
              </div>
            </TabPane>
          )}

          <TabPane tab={t(tabKeys.tabInquiryFindAHome)} key={tabKeys.tabInquiryFindAHome}>
            <div>{renderFilter()}</div>

            <div className="w-full sm:rounded-lg">
              <DataTableAdvanced
                showChangePageSize
                pagination={{
                  pageSize: filter?.size,
                  current: filter?.from / filter.size + 1,
                  total: ticketForFindAHome?.total ?? 0,
                  onChange: handleChangePage,
                }}
              >
                <Table
                  size={'middle'}
                  pagination={false}
                  columns={columnsFindAHome}
                  className="overflow-x-auto"
                  dataSource={ticketForFindAHome?.data}
                  scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
                />
              </DataTableAdvanced>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ClientInquiryAdmin;
