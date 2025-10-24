'use client';
import { Pagination, PaginationProps } from 'antd';
import React from 'react';

import './table.scss';
export interface IDataTableProps {
  pagination?: any;
  onChange?: (paginnatin: any) => void;
}

const PaginationComponent: React.FunctionComponent<IDataTableProps> = ({
  pagination,
  onChange,
}) => {
  const handleOnChange = (page: any, pageSize: any) => {
    if (onChange) {
      onChange({ current: page, pageSize: pageSize });
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
  return (
    <div className="mt-3 flex w-full justify-center pb-3">
      <Pagination
        size="middle"
        {...pagination}
        showSizeChanger={false}
        onChange={handleOnChange}
        itemRender={itemRender}
      />
    </div>
  );
};

export default PaginationComponent;
