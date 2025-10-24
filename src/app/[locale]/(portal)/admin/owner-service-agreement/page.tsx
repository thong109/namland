'use client';
import apiOSAService from '@/apiServices/externalApiServices/apiOSAmanagement';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, plusIcon } from '@/libs/appComponents';
import { align, appPermissions, listStatusOSA, renderDate, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, validKey } from '@/libs/helper';
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

const OwnerServiceAgreementPage: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();

  const [wnerService, setOwnerService] = useState([] as any);
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
      getListOwnService();
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

  const getListOwnService = async () => {
    const responseData: any = await apiOSAService.getListOSA(filter);
    setOwnerService(responseData);
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
      push(`/admin/owner-service-agreement/${id}`);
    }
  };

  const columns = [
    {
      title: t('EcomTicketManagementInforAgreementName'),
      dataIndex: 'agreementName',
      key: 'agreementName',
      width: 120,
      render: (agreementName, item) => (
        <a
          className="line-clamp-3 text-xs"
          onClick={() =>
            checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_osa.insert,
              appPermissions.portal_osa.admin,
            ])
              ? onEdit(item.id)
              : undefined
          }
        >
          {agreementName}
        </a>
      ),
    },
    {
      title: t('EcomTicketManagementInforStartDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      align: align.center,
      ellipsis: true,
      render: (startDate) => <div className="text-xs">{renderDate(startDate)}</div>,
    },
    {
      title: t('EcomTicketManagementInforEndDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 130,
      ellipsis: true,
      align: align.center,
      render: (endDate) => <div className="text-xs">{renderDate(endDate)}</div>,
    },
    {
      title: t('EcomTicketManagementInforProject'),
      dataIndex: 'projectName',
      key: 'projectName',
      width: 140,
      align: align.center,
      render: (projectName) => <div className="text-xs">{projectName}</div>,
    },
    {
      title: t('EcomTicketManagementInforPageOSAID'),
      dataIndex: 'ownerServiceAgreementId',
      key: 'ownerServiceAgreementId',
      width: 130,
      align: align.center,
      render: (ownerServiceAgreementId) => <div className="text-xs">{ownerServiceAgreementId}</div>,
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: align.center,
      render: (status: number) =>
        listStatusOSA.map(
          (item) =>
            item.value === status && (
              <label className={`text-xs font-medium ${item.classCode}`}>{comm(item?.name)}</label>
            ),
        ),
    },
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
                <div className="col-span-12 lg:col-span-4">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomOSAPageSearchBarSearch')}
                    placeholder={t('EcomOSAPageSearchBarSearch')}
                    onChange={triggerSearch}
                  />
                </div>

                <div className="col-span-12 lg:col-span-2">
                  <AppSelectFilter
                    name="status"
                    label={t('EcomTicketManagementInforPageSearchStage')}
                    options={listStatusOSA.map((x) => ({
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
        <div className="col-span-2 flex justify-end">
          <div className="w-fit">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_osa.insert,
              appPermissions.portal_osa.admin,
            ]) && (
              <ButtonPrimary
                className="rounded-lg p-3"
                size="middle"
                icon={plusIcon}
                text={comm('AddNew')}
                onClick={() => push(`/admin/owner-service-agreement/${'add-new'}`)}
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
      appPermissions.portal_osa.view,
      appPermissions.portal_osa.admin,
    ]) ? (
    <>
      <AppPageMeta title={t('EcomTicketManagementInforPageHeaderOwnerServiceAgreement')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomTicketManagementInforPageHeaderOwnerServiceAgreement')}
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
              total: wnerService?.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={wnerService?.data}
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

export default OwnerServiceAgreementPage;
