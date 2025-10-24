import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';
import PropertyItem from './PropertyItem';

interface PropertySelectionFieldProps {
  value?: any;
  onChange?: (values: any) => void;

  multiple?: boolean;
  options?: PropertyTypeModel[];
}

const PropertySelectionField: React.FC<PropertySelectionFieldProps> = ({
  value = [],
  onChange = () => {},
  multiple = false,
  options = [],
  ...props
}) => {
  const t = useTranslations('webLabel');

  const handleClick = useCallback(
    (propertyType: string | number | boolean) => {
      if (!multiple) {
        onChange([propertyType]);
      } else if (value.includes(propertyType)) {
        onChange([...value.filter((type) => type !== propertyType)]);
      } else {
        value.push(propertyType);
        onChange([...value]);
      }
    },
    [value, onChange, multiple],
  );

  return (
    <div
      className={`scrollbar-hidden flex gap-2 space-x-4 overflow-x-auto lg:grid lg:space-x-0 ${
        options?.length < 8
          ? `lg:grid-cols-${options.length}` // Tạo số cột bằng với số lượng item
          : 'lg:grid-cols-8' // Nếu có từ 8 item trở lên, sử dụng 8 cột
      }`}
    >
      {options?.map((o, index) => (
        <PropertyItem
          key={index}
          className="w-1/4 max-w-[calc(100%/4)] flex-shrink-0 lg:col-span-1 lg:w-full lg:max-w-full"
          image={o.iconUrl}
          onClick={() => handleClick(o.id)}
          selected={value.includes(o.id)}
          label={o.name}
        />
      ))}
    </div>
  );
};

export default PropertySelectionField;
