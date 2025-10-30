import { FC } from 'react';
import './TableResult.css';
import CardListing from '@/components/CardListing/CardListing';

export interface IProps {
  listings: any;
}

const TableResult: FC<IProps> = ({ listings }) => {
  return (
    <div className='table-common-result'>
      {listings.map((item: any) => (
        <div key={item.id} className='table-common-result__cell'>
          <CardListing listing={item} />
        </div>
      ))}
    </div>
  );
};

export default TableResult;
