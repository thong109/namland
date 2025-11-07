import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface PropertyItemProps {
  image: string;
  selected?: boolean;
  label: string;
  className?: string;
  onClick?: () => void;
}

const PropertyItem: React.FC<PropertyItemProps> = ({
  image,
  className,
  selected = false,
  label,
  onClick,
}) => {
  return (
    <div className={clsx('flex cursor-pointer flex-col items-center', className)} onClick={onClick}>
      <div
        className={clsx('relative size-16 rounded-full border border-portal-primaryLiving', {
          'border-property-item-background-selected bg-property-item-background-selected':
            selected === true,
        })}
      >
        <div className="absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Image src={image} className={clsx('', { 'filter invert brightness-100': selected === true })} alt="property-image" fill />
        </div>
      </div>
      <div
        className={clsx('mt-1 text-center', {
          'font-semibold': selected === true,
        })}
      >
        {label}
      </div>
    </div>
  );
};

export default PropertyItem;
