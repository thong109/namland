import ChipSelectionField from '@/_components/ChipSelectionField/ChipSelectionField';
import { ListingTypeEnum } from '@/ecom-sadec-api-client';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

interface PropertyTypeSelectorProps {
  multiple?: boolean;
  propertyTypes?: any[];
  type?: ListingTypeEnum;
  onChange?: (values: any) => void;
}

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({
  multiple = false,
  type,
  onChange = () => {},
  propertyTypes,
}) => {
  const [selected, setSelected] = useState<string | string[]>(multiple ? [] : undefined);
  const [initialSelectionSet, setInitialSelectionSet] = useState(false);

  useEffect(() => {
    if (propertyTypes && !initialSelectionSet) {
      const defaultSelection = propertyTypes?.find((item) => item.type === type)?.id;
      setSelected(defaultSelection || undefined);
      setInitialSelectionSet(true);
    }
  }, [propertyTypes, type, multiple, initialSelectionSet]);

  useEffect(() => {
    if (initialSelectionSet) {
      onChange(selected);
    }
  }, [selected]);

  return (
    <div className="overflow-x-auto">
      <ChipSelectionField
        multiple={multiple}
        allowClear={false}
        options={_.uniq(propertyTypes?.filter((item) => item.type === type))}
        value={selected}
        onChange={setSelected}
      />
    </div>
  );
};

export default PropertyTypeSelector;
