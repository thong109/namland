'use client';
import 'client-only';

import { useContext, useEffect, useState } from 'react';
import { GlobalSettingContext } from '../contexts/globalSettingContext';

function useDistrict() {
  const context = useContext(GlobalSettingContext);
  const [listDistrict, setListDistrict] = useState<any[] | []>([]);
  useEffect(() => {
    if (context.listDistrict != null) {
      setListDistrict(context.listDistrict);
    } else {
      context.getDistrict().then((district) => {
        if (district) {
          setListDistrict(district);
        }
      });
    }
  }, [context]);
  const refreshDistrict = () => {
    context.getDistrict().then((listDistrict) => {
      if (listDistrict) {
        setListDistrict(listDistrict);
      }
    });
  };
  return { listDistrict: listDistrict, refreshDistrict };
}

export default useDistrict;
