import IconBathTub from '@/components/Icons/IconBathTub';
import IconBedSingle from '@/components/Icons/IconBedSingle';
import IconMaximize from '@/components/Icons/IconMaximize';
import clsx from 'clsx';
import React from 'react';

interface PropertyInfoBoxProps {
  listingDetail: any;
  className?: string;
  overrideBasedStyle?: boolean;
}

const PropertyInfoBox: React.FC<PropertyInfoBoxProps> = ({
  listingDetail,
  className,
  overrideBasedStyle = false,
}) => {
  return (
    <div
      className={clsx(
        !overrideBasedStyle &&
          'absolute flex gap-3 rounded-[36px] bg-neutral-300 px-2 py-1 drop-shadow',
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <div className="flex size-5 items-center justify-center">
          <IconBedSingle />
        </div>
        <span className="text-xs font-normal">
          {listingDetail?.bedrooms ? listingDetail?.bedrooms : 0}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex size-5 items-center justify-center">
          <IconBathTub />
        </div>
        <span className="text-xs font-normal">
          {listingDetail?.bathrooms ? listingDetail?.bathrooms : 0}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex size-5 items-center justify-center">
          <IconMaximize />
        </div>
        <span className="text-xs font-normal">
          {listingDetail?.size ? listingDetail?.size : 0} m<sup>2</sup>
        </span>
      </div>
    </div>
  );
};

export default React.memo(PropertyInfoBox);
