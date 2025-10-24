'use client';
import otpApiInAdmin from '@/apiServices/externalApiServices/apiOtpInAdminhService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { align, appPermissions, renderDateTimeV2, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertPhoneNumber84To0,
  validKey,
} from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next-intl/client';
import React, { useEffect, useState } from 'react';

const OptManagementPage: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const pathname = usePathname();

  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();
  const [listOtp, setListOtp] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getListOtp();
  }, [filter]);

  const getListOtp = async () => {
    const list = await otpApiInAdmin.getListOtp(filter);

    setListOtp(list ?? undefined);
  };

  const handleChangePage = (pagination: any) => {
    const valuesFilter = {
      from: (pagination.current - 1) * pagination.pageSize,
      size: pagination.pageSize,
    };
    setFilter({ ...filter, ...valuesFilter });
  };

  const pushParamsFilterToHeader = (pageChange?: any) => {
    const values = formFilter.getFieldsValue();
    // if (values?.phone.startsWith('0')) {
    //   values.phone = '84' + values?.phone.substring(1);
    // }

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

  const columns = [
    {
      title: t('EcomOtpPagePhone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (phone) => {
        return <span className="text-xs">{convertPhoneNumber84To0(phone) ?? '--'}</span>;
      },
    },
    {
      title: t('EcomMemberPageListOtpCode'),
      dataIndex: 'otpCode',
      key: 'otpCode',
      width: 120,
      align: align.center,
      render: (otpCode) => otpCode,
    },
    {
      title: t('EcomMemberPageListVerifyFor'),
      dataIndex: 'verifyFor',
      key: 'verifyFor',
      width: 130,
      align: align.center,
      render: (verifyFor) => verifyFor,
    },
    {
      title: t('EcomOTPPageListStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 130,
      align: align.center,
      render: (status) => (
        <div className="text-xs">{status === 1 ? comm('sentSuccess') : comm('sentFaild')}</div>
      ),
    },
    columnCreate(),
    {
      title: t('EcomMemberPageListOtpExpiredDate'),
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      width: 120,
      align: align.center,
      render: (expiredDate) => <div className="text-xs">{renderDateTimeV2(expiredDate)}</div>,
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
              <div className="grid w-full grid-cols-12 gap-x-2">
                <div className="col-span-12 lg:col-span-4">
                  <AppSearchFilter
                    name="phone"
                    label={t('EcomOTPPageSearchBarSearch')}
                    placeholder={t('EcomOTPPageSearchBarSearch')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <ButtonPrimary
                    size="middle"
                    text={t('EcomPropertyListingPageSearchBarSearch')}
                    onClick={triggerSearch}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [roleAdminGod, appPermissions.portal_otp.view]) ? (
    <>
      <AppPageMeta title={t('EcomMemberPageListViewOTPManagement')} />
      <div className="w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomMemberPageListViewOTPManagement')}
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
              total: listOtp.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              className="overflow-x-auto"
              dataSource={listOtp?.data}
              scroll={{ x: 600, y: '65vh', scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default OptManagementPage;
