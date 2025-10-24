'use client';
import apiTicketManagement from '@/apiServices/externalApiServices/apiTicketManagement';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon } from '@/libs/appComponents';
import { align, listStatusOwnInquiry, listStatusTicketFilter } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, convertPhoneNumber84To0, validKey } from '@/libs/helper';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
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

const OwnerInquiryCLient: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [ownerInquiries, setOwnerInquiries] = useState([] as any);
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
      getListOwnerInquiryClient();
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

  const getListOwnerInquiryClient = async () => {
    const responseData: any = await apiTicketManagement.getListOwnerInquiry(filter);
    setOwnerInquiries(responseData);
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
    if (values?.keyword?.startsWith('0')) {
      values.keyword = '84' + values?.keyword.substring(1);
    }
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
      push(`/client/own-inquiry/${id}`);
    }
  };

  const columns = [
    {
      title: t('EcomTicketManagementInforPageClientName'),
      dataIndex: 'clientName',
      key: 'clientName',
      width: 120,
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
      width: 120,
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
      ellipsis: true,
      align: align.center,
      render: (email) => {
        return (
          <div className="text-xs" style={{ whiteSpace: 'normal' }}>
            {email}
          </div>
        );
      },
    },
    {
      title: t('EcomTicketManagementInforPageSearchBarProject'),
      dataIndex: 'project',
      key: 'project',
      width: 140,
      align: align.center,
      render: (project) => <div className="text-xs">{project?.projectName}</div>,
    },

    {
      title: t('EcomTicketManagementInforPageOSAID'),
      dataIndex: 'osaId',
      key: 'osaId',
      width: 130,
      align: align.center,
      render: (osaId) => <div className="text-xs">{osaId}</div>,
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: align.center,
      render: (status: number) =>
        listStatusOwnInquiry.map(
          (item) =>
            item.id === status && (
              <label className={`text-xs font-medium ${item.classCode}`}>{comm(item?.name)}</label>
            ),
        ),
    },
    columnCreate(),
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 70,
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

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="status"
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
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Customer ? (
    <>
      <AppPageMeta title={t('EcomTicketManagementInforPageHeaderOwnerInquiry')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomTicketManagementInforPageHeaderOwnerInquiry')}
            </h1>
          </div>
        </div>

        <div>{renderFilter()}</div>

        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: ownerInquiries?.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={ownerInquiries?.data}
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

export default OwnerInquiryCLient;
