import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import React, { useCallback } from 'react';
import ItemRadio from './components/ItemRadio';

interface PropertySelectionFieldProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  multiple?: boolean;
  options?: PropertyTypeModel[];
  disabled?: boolean;
}

const SelectItemHaveIcon: React.FC<PropertySelectionFieldProps> = ({
  value = [],
  onChange = () => {},
  multiple = false,
  options = [],
  disabled = false,
  ...props
}) => {
  const handleClick = useCallback(
    (propertyType: PropertyTypeModel) => {
      if (!multiple) {
        onChange([propertyType.id]);
      } else if (value.includes(propertyType.id)) {
        onChange([...value.filter((item) => item !== propertyType.id)]);
      } else {
        value.push(propertyType.id);
        onChange([...value]);
      }
    },
    [value, onChange, multiple],
  );

  return (
    <div className="grid grid-cols-12 gap-4 lg:grid-cols-8">
      {options?.map((o, index) => (
        <ItemRadio
          key={index}
          className="col-span-3 lg:col-span-1"
          image={o.iconUrl}
          onClick={disabled ? undefined : () => handleClick(o)}
          selected={value.includes(o.id)}
          label={o.name}
        />
      ))}
    </div>
  );
};

export default SelectItemHaveIcon;
