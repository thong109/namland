import React from 'react';
import RecentPropertiesClient from './RecentPropertiesClient';
const RecentPropertiesForSale = async () => {
  return (
    <div className="pt-12 md:pt-[46px] pb-8 md:pb-[60px]">
      <div className="container">
        <RecentPropertiesClient />
      </div>
    </div>
  );
};

export default RecentPropertiesForSale;
