'use client';
import { Col, Pagination, Row } from 'antd';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import './DataTable.scss';

const listNumber: number[] = [10, 20, 50, 100, 200];

export interface IDataTableProps {
  pagination?: any;
  showChangePageSize?: boolean;
  children?: React.ReactNode; // Add children property here
}

const DataTableAdvanced: React.FunctionComponent<IDataTableProps> = ({
  pagination,
  showChangePageSize,
  children,
  ...props
}) => {
  const t = useTranslations('Common');
  const handleOnChange = (page, pageSize) => {
    if (pagination.onChange) {
      pagination.onChange({ current: page, pageSize: pageSize });
    }
  };

  return (
    <>
      {children}
      {pagination && pagination.total > 0 && (
        <Row className="mt-3 pb-3">
          <Col sm={{ span: 24, offset: 0 }} style={{ textAlign: 'end' }}>
            <Pagination
              size="small"
              showTotal={(total) => <label>{t(`total_{total}_item`, { total })}</label>}
              {...pagination}
              onChange={handleOnChange}
              showSizeChanger={!!showChangePageSize}
              pageSizeOptions={listNumber}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default DataTableAdvanced;
