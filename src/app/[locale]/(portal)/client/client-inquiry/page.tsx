'use client';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon } from '@/libs/appComponents';
import { align, listStatusTicketFilter, renderDateTime, typeInquiry } from '@/libs/appconst';
import UserAccountTypeConstant from '@/libs/constants/userAccountType';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, convertPhoneNumber84To0, formatNumber, validKey } from '@/libs/helper';
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
  tabMyInquiry: 'TAB_INQUIRY_FOR_ME',
  tabInquiryForMy: 'TAB_MY_INQUIRY',
  tabNewHomeInquiry: 'TAB_NEW_HOME_INQUIRY',
  tabInquiryNewHomeForPIC: 'TAB_INQUIRY_NEW_HOME_FOR_PIC',
  tabInquiryFindAHome: 'TAB_FIND_A_HOME',
  tabInquiryForMyFindAHome: 'TAB_INQUIRY_FOR_MY_FIND_A_HOME',
};
const { TabPane } = Tabs;

const ClientInquiryMember: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabMyInquiry);

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [myTickets, setMyTickets] = useState([] as any);
  const [ticketForMe, setTicketForMe] = useState([] as any);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });
  const [tickNewHomeForMe, setTickNewHomeForMe] = useState([] as any);

  const [tickNewHomeForPIC, setTickNewHomeForPIC] = useState([] as any);

  const [ticketForMyFindAHome, setTicketForMyFindAHome] = useState([] as any);
  const [ticketForFindAHome, setTicketForFindAHome] = useState([] as any);

  useEffect(() => {
    getParamFromUrl();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      if (selectedIndex === tabKeys.tabInquiryForMy) {
        getListTicketForMe();
      }
      if (selectedIndex === tabKeys.tabMyInquiry) {
        getListMyTicket();
      }
      if (selectedIndex === tabKeys.tabNewHomeInquiry) {
        getAllTicketNewHomeByMe();
      }
      if (selectedIndex === tabKeys.tabInquiryNewHomeForPIC) {
        getAllTicketNewHomeByPIC();
      }
      if (selectedIndex === tabKeys.tabInquiryForMyFindAHome) {
        getAllTicketForMyFindAHome();
      }
      if (selectedIndex === tabKeys.tabInquiryFindAHome) {
        getAllTicketForFindAHome();
      }
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

  const getListMyTicket = async () => {
    const responseData: any = await apiTicketManagement.getListTicket(
      filter,
      typeInquiry.myInquiry,
    );
    setMyTickets(responseData);
  };

  const getListTicketForMe = async () => {
    const responseData: any = await apiTicketManagement.getListTicket(
      filter,
      typeInquiry.inquiryForMe,
    );
    setTicketForMe(responseData);
  };

  const getAllTicketNewHomeByMe = async () => {
    const responseData: any = await apiTicketManagement.getAllTicketNewHomeByMe(filter);

    setTickNewHomeForMe(responseData);
  };

  const getAllTicketNewHomeByPIC = async () => {
    const responseData: any = await apiTicketManagement.getAllTicketNewHomeByPIC(filter);

    setTickNewHomeForPIC(responseData);
  };

  const getAllTicketForMyFindAHome = async () => {
    const responseData: any = await apiTicketManagement.getAllTicketForMyFindAHome(filter);

    setTicketForMyFindAHome(responseData);
  };

  const getAllTicketForFindAHome = async () => {
    const responseData: any = await apiTicketManagement.getAllTicketForFindAHome(filter);

    setTicketForFindAHome(responseData);
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
      push(`/client/client-inquiry/${id}`);
    }
  };

  const onEditInquiryFindAHome = (id: string) => {
    if (id) {
      if (selectedIndex === tabKeys.tabInquiryForMyFindAHome) {
        push(`/client/find-a-home-client/${id}`);
      }
      if (selectedIndex === tabKeys.tabInquiryFindAHome) {
        push(`/client/find-a-home-agent/${id}`);
      }
    }
  };

  const onEditInquiryNewHomeByMe = (id: string) => {
    if (id) {
      push(`/client/new-home-inquiry-client/${id}`);
    }
  };

  const onEditInquiryNewHomePIC = (id: string) => {
    if (id) {
      push(`/client/new-home-inquiry-pic/${id}`);
    }
  };

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
    formFilter.resetFields();
    setFilter({
      from: 0,
      size: 10,
    });
    if (tabKey === tabKeys.tabInquiryForMy) {
      getListTicketForMe();
    }
    if (tabKey === tabKeys.tabMyInquiry) {
      getListMyTicket();
    }
    if (tabKey === tabKeys.tabNewHomeInquiry) {
      getAllTicketNewHomeByMe();
    }
    if (tabKey === tabKeys.tabInquiryNewHomeForPIC) {
      getAllTicketNewHomeByPIC();
    }
    if (tabKey === tabKeys.tabInquiryForMyFindAHome) {
      getAllTicketForMyFindAHome();
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
        return (
          <div className="text-xs" style={{ whiteSpace: 'normal' }}>
            {email ?? '--'}
          </div>
        );
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
          <button className="mr-1" onClick={() => onEdit(item.id)}>
            {editIcon}
          </button>
        </div>
      ),
    },
  ];

  const columnsNewHomeForMe = [
    {
      title: t('EcomTicketManagementInforPageClientName'),
      dataIndex: 'clientName',
      key: 'clientName',
      width: 130,
      render: (clientName, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => onEditInquiryNewHomeByMe(item.id)}>
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
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          <button className="mr-1" onClick={() => onEdit(item.id)}>
            {editIcon}
          </button>
        </div>
      ),
    },
  ];

  const columnsFindAHomeForMe = [
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

  const columnsNewHomeForPIC = [
    {
      title: t('EcomTicketManagementInforPageClientName'),
      dataIndex: 'clientName',
      key: 'clientName',
      width: 130,
      render: (clientName, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => onEditInquiryNewHomePIC(item.id)}>
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
      width: 150,
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
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          <button className="mr-1" onClick={() => onEditInquiryNewHomePIC(item.id)}>
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
                <div className="col-span-12 lg:col-span-6">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomClientInquiryPageSearchBarSearch')}
                    placeholder={t('EcomClientInquiryPageSearchBarSearch')}
                    onChange={triggerSearch}
                  />
                </div>

                {selectedIndex !== tabKeys.tabNewHomeInquiry &&
                  selectedIndex !== tabKeys.tabInquiryNewHomeForPIC &&
                  selectedIndex !== tabKeys.tabInquiryForMyFindAHome &&
                  selectedIndex !== tabKeys.tabInquiryFindAHome && (
                    <div className="col-span-12 lg:col-span-3">
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

  return userInfo?.type === UserTypeConstant.Customer ? (
    <>
      <AppPageMeta title={t('EcomTicketManagementInforPageHeaderClientInquiryMember')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomTicketManagementInforPageHeaderClientInquiryMember')}
            </h1>
          </div>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabMyInquiry)} key={tabKeys.tabMyInquiry}>
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

          <TabPane tab={t(tabKeys.tabInquiryForMy)} key={tabKeys.tabInquiryForMy}>
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
          </TabPane>

          <TabPane tab={t(tabKeys.tabNewHomeInquiry)} key={tabKeys.tabNewHomeInquiry}>
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
                  columns={columnsNewHomeForMe}
                  className="overflow-x-auto"
                  dataSource={tickNewHomeForMe?.data}
                  scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
                />
              </DataTableAdvanced>
            </div>
          </TabPane>
          <TabPane tab={t(tabKeys.tabInquiryNewHomeForPIC)} key={tabKeys.tabInquiryNewHomeForPIC}>
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
                  columns={columnsNewHomeForPIC}
                  className="overflow-x-auto"
                  dataSource={tickNewHomeForPIC?.data}
                  scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
                />
              </DataTableAdvanced>
            </div>
          </TabPane>

          <TabPane tab={t(tabKeys.tabInquiryForMyFindAHome)} key={tabKeys.tabInquiryForMyFindAHome}>
            <div>{renderFilter()}</div>

            <div className="w-full sm:rounded-lg">
              <DataTableAdvanced
                showChangePageSize
                pagination={{
                  pageSize: filter?.size,
                  current: filter?.from / filter.size + 1,
                  total: ticketForMyFindAHome?.total ?? 0,
                  onChange: handleChangePage,
                }}
              >
                <Table
                  size={'middle'}
                  pagination={false}
                  columns={columnsFindAHomeForMe}
                  className="overflow-x-auto"
                  dataSource={ticketForMyFindAHome?.data}
                  scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
                />
              </DataTableAdvanced>
            </div>
          </TabPane>

          {userInfo?.accountType === UserAccountTypeConstant.Owner && (
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
          )}
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ClientInquiryMember;
