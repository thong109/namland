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

const ItemIconRadio: React.FC<PropertyItemProps> = ({
  image,
  className,
  selected = false,
  label,
  onClick,
}) => {
  return (
    <div
      className={clsx('custom-itemRadio flex cursor-pointer flex-col items-center', className)}
      onClick={onClick}
    >
      <div
        className={clsx('relative size-16 rounded-full border border-[#D1D4D6]', {
          'border-property-item-background-selected bg-property-item-background-selected':
            selected === true,
        })}
      >
        <div className="absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Image src={image} alt="property-image" fill />
        </div>
      </div>
      <div className="text-center">{label}</div>
    </div>
  );
};

export default ItemIconRadio;
