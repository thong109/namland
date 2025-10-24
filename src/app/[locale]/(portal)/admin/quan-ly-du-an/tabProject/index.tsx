'use client';
import projectApiInAdmin from '@/apiServices/externalApiServices/apiProjectInAdmin';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { editIcon, plusIcon } from '@/libs/appComponents';
import { activeStatus, align, appPermissions, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, checkPermissonAcion, renderStatusActive, validKey } from '@/libs/helper';
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

const ProjectPage = (props: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const { push } = useRouter();
  const pathname = usePathname();
  const { userInfo } = useGlobalStore();
  const [formFilterProject] = Form.useForm();
  const [projectList, setProjectList] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
    isActive: 'true',
  });

  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListProject();
    }
  }, [filter, props.activeKey, props.tabKey]);

  const getListProject = async () => {
    const responseData: any = await projectApiInAdmin.getProjectList(filter);
    setProjectList(responseData);
  };

  const handleChangePage = (pagination: any) => {
    const valuesFilter = pushParamsFilterToHeader({
      from: (pagination.current - 1) * pagination.pageSize,
      size: pagination.pageSize,
    });
    setFilter({ ...valuesFilter });
  };

  const pushParamsFilterToHeader = (pageChange?: any) => {
    const values = formFilterProject.getFieldsValue();

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

  const onEditProject = (id: string) => {
    if (id) {
      push(`/admin/quan-ly-du-an/${id}`);
    }
  };

  const columnsProject = [
    {
      title: t('EcomProjectManagementPageListProjectName'),
      dataIndex: 'name',
      key: 'name',
      width: 130,
      render: (name, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => onEditProject(item.id)}>
          {name}
        </a>
      ),
    },
    {
      title: t('EcomProjectManagementPageListProjectOwner'),
      dataIndex: 'owner',
      key: 'owner',
      width: 110,
      align: align.center,
      ellipsis: true,
      render: (owner) => {
        return <div className="text-xs">{owner ?? '--'}</div>;
      },
    },
    {
      title: t('EcomProjectManagementPageListManagedBy'),
      dataIndex: 'managedBy',
      key: 'managedBy',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (managedBy) => {
        return <div className="text-xs">{managedBy ?? '--'}</div>;
      },
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      align: align.center,
      render: (isActive) => renderStatusActive(isActive, t('Active'), t('InActive')),
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
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          <button className="mr-1" onClick={() => onEditProject(item.id)}>
            {editIcon}
          </button>
        </div>
      ),
    },
  ];

  const renderFilterProject = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          <Form
            form={formFilterProject}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12 lg:col-span-4">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomProjectPageSearchBarSearch')}
                    placeholder={t('EcomProjectPageSearchBarSearch')}
                    onChange={triggerSearch}
                  />
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    allowClear
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
              text={comm('AddNewProject')}
              onClick={() => push(`/admin/quan-ly-du-an/${'add-new'}`)}
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
      <div>{renderFilterProject()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: filter?.from / filter.size + 1,
            total: projectList?.total ?? 0,
            onChange: handleChangePage,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            columns={columnsProject}
            className="overflow-x-auto"
            dataSource={projectList?.data}
            scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ProjectPage;
