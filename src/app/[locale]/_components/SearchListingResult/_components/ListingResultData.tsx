import { ListPropertyStatusEnum } from '@/libs/enums/ListPropertyStatusEnum';
import { FC } from 'react';
import ListingCard from '../../ListingCard/ListingCard';

export interface IProps {
  listings: any;
}

const ListingResultData: FC<IProps> = ({ listings }) => {
  const getVariant = (type) => {
    if (type === ListPropertyStatusEnum.Platinum) {
      return 'platinum';
    } else if (type === ListPropertyStatusEnum.Gold) {
      return 'gold';
    } else {
      return 'basic';
    }
  };

  // Group the listings by their status
  const platinumListings = listings.filter(
    (item) => item.priorityStatus === ListPropertyStatusEnum.Platinum,
  );
  const goldListings = listings.filter(
    (item) => item.priorityStatus === ListPropertyStatusEnum.Gold,
  );
  const basicListings = listings.filter(
    (item) => item.priorityStatus === ListPropertyStatusEnum.Basic,
  );

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="hidden grid-cols-6 gap-4 lg:grid">
        {/* Render Platinum Listings */}
        {platinumListings.map((item) => (
          <div key={item.id} className="col-span-6">
            <ListingCard key={item.id} listing={item} variant={getVariant(item.priorityStatus)} />
          </div>
        ))}
      </div>{' '}
      <div className="hidden grid-cols-6 gap-4 lg:grid">
        {/* Render Gold Listings */}
        {goldListings.map((item) => (
          <div key={item.id} className="col-span-3">
            <ListingCard key={item.id} listing={item} variant={getVariant(item.priorityStatus)} />
          </div>
        ))}
      </div>{' '}
      <div className="hidden grid-cols-6 gap-4 lg:grid">
        {/* Render Basic Listings */}
        {basicListings.map((item) => (
          <div key={item.id} className="col-span-2">
            <ListingCard key={item.id} listing={item} variant={getVariant(item.priorityStatus)} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 lg:hidden">
        {listings.map((item) => (
          <div key={item.id} className="min-w-60 grow">
            <ListingCard listing={item} variant="basic" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingResultData;
