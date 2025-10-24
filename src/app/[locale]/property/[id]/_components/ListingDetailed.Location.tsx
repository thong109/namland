'use client';

import GoogleMap from '@/components/GoogleMap';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import React from 'react';

interface ListingDetailedLocationProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ListingDetailedLocation: React.FC<ListingDetailedLocationProps> = ({
  locale,
  listingDetail,
}) => {
  const center = listingDetail?.location?.location;

  return (
    <div className="h-80 w-full overflow-hidden lg:rounded-3xl">
      <GoogleMap disabled initCenter={center} isMarker listMarker={[center]} />
    </div>
  );
};

export default React.memo(ListingDetailedLocation);
