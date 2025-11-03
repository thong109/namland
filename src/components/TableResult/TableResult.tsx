'use client';

import { FC, use } from 'react';
import clsx from 'clsx';
import './TableResult.css';
import CardListing from '@/components/CardListing/CardListing';

export interface IProps {
  className?: string;
  listings: any;
}

const TableResult: FC<IProps> = ({ 
  className,
  listings 
}) => {
  return (
    <div className={clsx('table-common-result', className)}>
      {listings.map((item: any) => (
        <div key={item.id} className='table-common-result__cell'>
          <CardListing listing={item} />
        </div>
      ))}
    </div>
  );
};

export default TableResult;
