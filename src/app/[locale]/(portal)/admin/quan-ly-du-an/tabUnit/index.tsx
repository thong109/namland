'use client';
import unitApiInAdmin from '@/apiServices/externalApiServices/apiUnitInAdmin';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, plusIcon } from '@/libs/appComponents';
import { activeStatus, align, appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, formatNumber, validKey } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
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

const UnitPage = (props: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const { push } = useRouter();
  const pathname = usePathname();
  const { userInfo } = useGlobalStore();
  const [formFilterUnit] = Form.useForm();
  const [unitList, setUnitList] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });
  const [propertyTypes, setPropertyType] = useState<any[]>([]);

  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListUnit();
      getPropertyTypes();
    }
  }, [filter, props.activeKey, props.tabKey]);

  const getPropertyTypes = async () => {
    const res = await propertyApiService.getPropertyTypes();
    setPropertyType(res.data);
  };

  const getListUnit = async () => {
    const responseData: any = await unitApiInAdmin.getUnitList(filter);
    setUnitList(responseData);
  };

  const pushParamsFilterToHeader = (pageChange?: any) => {
    const values = formFilterUnit.getFieldsValue();

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

  const onEditUnit = (id: string) => {
    if (id) {
      push(`/admin/quan-ly-can-ho/${id}`);
    }
  };

  const columnsUnit = [
    {
      title: t('EcomProjectManagementPageListProjectCode'),
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 130,
      render: (projectCode, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => onEditUnit(item.id)}>
          {projectCode ?? '--'}
        </a>
      ),
    },
    {
      title: t('EcomProjectManagementPageListUnitNo'),
      dataIndex: 'unitNo',
      key: 'unitNo',
      width: 110,
      align: align.center,
      ellipsis: true,
      render: (unitNo) => {
        return <div className="text-xs">{unitNo ?? '--'}</div>;
      },
    },
    {
      title: t('EcomProjectManagementPageListUnitType'),
      dataIndex: 'typeName',
      key: 'typeName',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (typeName) => {
        return <div className="text-xs">{typeName ?? '--'}</div>;
      },
    },

    {
      title: t('EcomProjectManagementPageListUnitArea'),
      dataIndex: 'area',
      key: 'area',
      width: 150,
      align: align.center,
      render: (area) => <div className="text-xs">{formatNumber(area)}</div>,
    },

    {
      title: t('EcomProjectManagementPageListCreateBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      align: align.center,
      render: (createdBy) => <div className="text-xs">{createdBy}</div>,
    },
    {
      title: t('EcomProjectManagementPageListStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: align.center,
      render: (status) =>
        status === 1 ? (
          <span
            style={{
              fontSize: 12,
              backgroundColor: '#E2EEFE',
              color: '#1178F5',
              padding: '6px 8px',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            {comm('active')}
          </span>
        ) : (
          <span
            style={{
              fontSize: 12,
              backgroundColor: '#E2EEFE',
              color: '#1178F5',
              padding: '6px 8px',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            {comm('inActive')}
          </span>
        ),
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id) => (
        <div className="flex w-full items-center justify-center">
          <button className="mr-1" onClick={() => onEditUnit(id)}>
            {editIcon}
          </button>
        </div>
      ),
    },
  ];

  const renderFilterUnit = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          <Form
            form={formFilterUnit}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12 lg:col-span-4">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomUnitPageSearchBarSearch')}
                    placeholder={t('EcomUnitPageSearchBarSearch')}
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
                    name="typeId"
                    label={t('EcomBannerManagementPageUnitType')}
                    options={propertyTypes.map((x) => ({
                      value: x.id,
                      label: x.name,
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
              className="rounded-lg p-3"
              size="middle"
              icon={plusIcon}
              text={comm('AddNewUnit')}
              onClick={() => push(`/admin/quan-ly-can-ho/${'add-new'}`)}
            />
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
      <div>{renderFilterUnit()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: filter?.from / filter.size + 1,
            total: unitList?.total ?? 0,
            onChange: handleChangePage,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            columns={columnsUnit}
            className="overflow-x-auto"
            dataSource={unitList?.data}
            scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default UnitPage;
