'use client';
import 'client-only';

import { useContext, useEffect, useState } from 'react';
import { GlobalSettingContext } from '../contexts/globalSettingContext';

function usePropertyType() {
  const context = useContext(GlobalSettingContext);
  const [propertyTypes, setPropertyTypes] = useState<any[] | []>([]);

  useEffect(() => {
    if (context.listPropertyType != null) {
      const dataSort = context.listPropertyType.sort(function (a, b) {
        return a.order - b.order;
      });
      setPropertyTypes(dataSort);
    } else {
      context.getPropertyType().then((listPropertyType) => {
        if (listPropertyType) {
          setPropertyTypes(listPropertyType);
        }
      });
    }
  }, [context]);
  const refreshPropertyType = () => {
    context.getPropertyType().then((listPropertyType) => {
      if (listPropertyType) {
        setPropertyTypes(listPropertyType);
      }
    });
  };
  return { propertyTypes: propertyTypes, refreshPropertyType };
}

export default usePropertyType;
