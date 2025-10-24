'use client';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Pagination, PaginationProps, Space, Table } from 'antd';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';
import IconEdit from '../Icons/IconEdit';
import IconRemove from '../Icons/IconRemove';
import './table.scss';
export interface IDataTableProps {
  title?: string;
  keywordPlaceholder?: string;
  onRefresh?: () => void;
  disable?: boolean;
  pagination?: any;
  onChangePagination?: (value) => void;
  createPermission?: string;
  handleRefresh?: (key?: any, value?: any) => void;
  actionComponent?: () => void;
  children?: ReactNode;
  columns: any[];
  dataSource: any[];
  loading?: boolean;
  hasRemove?: boolean;
  onRemove?: (index: number) => void;
  hasEdit?: boolean;
  onEdit?: (index: number) => void;
  pageSize?: number;
  scroll?: any;
}

const DataTable: React.FunctionComponent<IDataTableProps> = ({
  title,
  onRefresh,
  pagination,
  disable,
  createPermission,
  actionComponent,
  children,
  columns,
  dataSource,
  loading = false,
  hasRemove = false,
  onRemove,
  hasEdit = false,
  onEdit,
  onChangePagination,
  pageSize = 5,
  scroll = { x: 1000, scrollToFirstRowOnChange: true, y: '70vh' },
  ...props
}) => {
  const t = useTranslations('Common');

  const handleRefresh = () => {
    onRefresh && onRefresh();
  };
  const handleOnChange = (page: any, pageSize: any) => {
    if (onChangePagination) {
      onChangePagination({ current: page, pageSize: pageSize });
    }
  };
  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <div className="flex h-full items-center justify-center">
          <svg
            className="h-[12px] w-[12px] text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
        </div>
      );
    }
    if (type === 'next') {
      return (
        <div className="ml-1 flex h-full items-center justify-center">
          <svg
            className="h-[12px] w-[12px] text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </div>
      );
    }
    return originalElement;
  };

  if (hasRemove || hasEdit) {
    columns.push({
      dataIndex: '',
      key: '',
      title: t('action'),
      width: '10%',
      render: (value, record, index) => (
        <Space size="small">
          {hasRemove && onRemove && (
            <div
              onClick={() => onRemove(index)}
              className="cursor-pointer rounded-xl bg-portal-gray-1 p-2"
            >
              <IconRemove />
            </div>
          )}
          {hasEdit && onEdit && (
            <div
              onClick={() => onEdit(index)}
              className="cursor-pointer rounded-xl bg-portal-gray-1 p-2"
            >
              <IconEdit />
            </div>
          )}
        </Space>
      ),
    });
  }
  return (
    <div className="overflow-auto">
      <div className="d-flex justify-content-between my-1">
        <div className="d-flex align-items-center">
          {onRefresh && (
            <Button
              className="button-primary"
              shape={'round'}
              icon={<ReloadOutlined />}
              disabled={disable}
              onClick={handleRefresh}
              style={{ boxShadow: '0px 4px 8px rgba(110, 186, 196, 0.2)' }}
            ></Button>
          )}
        </div>
      </div>
      <Table
        size="middle"
        className={`shadow-md sm:rounded-lg`}
        rowKey={(record) => record?.id}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        scroll={scroll}
      />
      {pagination && pagination.total > 0 && (
        <div className="mt-3 w-full pb-3">
          <Pagination
            size="middle"
            showTotal={(total) => <label>{t(`total_{total}_item`, { total })}</label>}
            current={pagination.current}
            total={pagination.total}
            {...pagination}
            showSizeChanger={false}
            onChange={handleOnChange}
            itemRender={itemRender}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
