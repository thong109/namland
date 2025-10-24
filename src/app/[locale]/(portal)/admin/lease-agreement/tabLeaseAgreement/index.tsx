'use client';
import leaseAgreementApiService from '@/apiServices/externalApiServices/apiLeaseAgreementService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, plusIcon } from '@/libs/appComponents';
import {
  LAStatus,
  activeStatus,
  align,
  appPermissions,
  renderDate,
  roleAdminGod,
} from '@/libs/appconst';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertPhoneNumber84To0,
  validKey,
} from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import type { TableColumnsType } from 'antd';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
type IProps = {
  activeKey: string;
  tabKey: string;
};

const LeaseAgreement = (props: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const { push } = useRouter();

  const pathname = usePathname();

  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();
  const [listAgreement, setListAgreement] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListLeaseAgreement();
    }
  }, [filter, props.activeKey, props.tabKey]);

  const getListLeaseAgreement = async () => {
    const responseData: any = await leaseAgreementApiService.getListLA(filter);
    setListAgreement(responseData);
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

  const onEdit = (id: string) => {
    if (id) {
      push(`/admin/lease-agreement/${id}`);
    }
  };

  const columnsLeaseAgreement: TableColumnsType<any> = [
    {
      title: t('EcomProjectManagementPageListContractNumber'),
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      width: 130,
      render: (contractNumber, item) => (
        <div className="line-clamp-3 text-xs">{contractNumber}</div>
      ),
    },
    {
      title: t('EcomProjectManagementPageListClientName'),
      dataIndex: 'chbiet',
      key: 'chbiet',
      width: 110,
      align: align.center,
      ellipsis: true,
      render: (chbiet) => {
        return <div className="text-xs font-medium">{chbiet ?? '--'}</div>;
      },
    },
    {
      title: t('EcomProjectManagementPageListManagedBy'),
      dataIndex: 'chbiet',
      key: 'chbiet',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (chbiet) => {
        return <div className="text-xs">{chbiet ?? '--'}</div>;
      },
    },
    {
      title: t('EcomProjectManagementPageListCompany'),
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150,
      align: align.center,
      render: (companyName) => <div className="text-xs">{companyName}</div>,
    },
    {
      title: t('EcomProjectManagementPageListPhone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      align: align.center,
      render: (phone) => <div className="text-xs">{convertPhoneNumber84To0(phone)}</div>,
    },
    {
      title: t('EcomProjectManagementPageListUnitNo'),
      dataIndex: 'unitNo',
      key: 'unitNo',
      width: 150,
      align: align.center,
      render: (unitNo) => <div className="text-xs">{unitNo}</div>,
    },
    {
      title: t('EcomProjectManagementPageListStartDate'),
      dataIndex: 'starDate',
      key: 'starDate',
      width: 150,
      align: align.center,
      render: (starDate) => <div className="text-xs">{renderDate(starDate)}</div>,
    },
    {
      title: t('EcomProjectManagementPageListEndDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 150,
      align: align.center,
      render: (endDate) => <div className="text-xs">{renderDate(endDate)}</div>,
    },
    {
      title: t('EcomProjectManagementPageListRentalTerm'),
      dataIndex: 'rentalTerm',
      key: 'rentalTerm',
      width: 150,
      align: align.center,
      render: (rentalTerm) => <div className="text-xs">{rentalTerm}</div>,
    },
    {
      title: t('EcomProjectManagementPageListPDue'),
      dataIndex: 'pDue',
      key: 'pDue',
      width: 150,
      align: align.center,
      render: (pDue) => <div className="text-xs">{pDue}</div>,
    },
    {
      title: t('EcomProjectManagementPageListRent'),
      dataIndex: 'rent',
      key: 'rent',
      width: 150,
      align: align.center,
      render: (rent) => <div className="text-xs">{rent}</div>,
    },
    {
      title: t('EcomProjectManagementPageListLeaseStatus'),
      dataIndex: 'ttStatus',
      key: 'ttStatus',
      width: 150,
      align: align.center,
      render: (ttStatus) =>
        LAStatus.map(
          (item) =>
            item.id === ttStatus && (
              <div className={`rounded px-1 py-1 text-xs font-semibold ${item.classCode}`}>
                {comm(item.name)}
              </div>
            ),
        ),
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      fixed: 'right',
      render: (id) => (
        <div className="flex w-full items-center justify-center">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_la.update,
            appPermissions.portal_la.view,
            appPermissions.portal_la.admin,
          ]) && (
            <button className="mr-1" onClick={() => onEdit(id)}>
              {editIcon}
            </button>
          )}
        </div>
      ),
    },
  ];

  const renderFilterProject = () => {
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
                    label={t('EcomleaseAgreementPageSearchBarSearch')}
                    placeholder={t('EcomleaseAgreementPageSearchBarSearch')}
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
            <ButtonPrimary
              size="middle"
              icon={plusIcon}
              text={comm('AddNew')}
              onClick={() => push(`/admin/lease-agreement/${'add-new'}`)}
            />
          </div>
        </div>
      </div>
    );
  };

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_staff.view,
    appPermissions.portal_staff.admin,
  ]) ? (
    <>
      <div>{renderFilterProject()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: filter?.from / filter.size + 1,
            total: listAgreement?.total ?? 0,
            onChange: handleChangePage,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            columns={columnsLeaseAgreement}
            className="overflow-x-auto"
            dataSource={listAgreement?.data}
            scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default LeaseAgreement;
