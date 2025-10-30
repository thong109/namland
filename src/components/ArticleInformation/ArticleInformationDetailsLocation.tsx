'use client';

import GoogleMap from '@/components/GoogleMap';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import React from 'react';

interface ArticleInformationDetailsLocationProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ArticleInformationDetailsLocation: React.FC<ArticleInformationDetailsLocationProps> = ({
  locale,
  listingDetail,
}) => {
  const center = listingDetail?.location?.location;

  return (
    <div className='map-common-information'>
      <GoogleMap disabled initCenter={center} isMarker listMarker={[center]} />
    </div>
  );
};

export default React.memo(ArticleInformationDetailsLocation);
