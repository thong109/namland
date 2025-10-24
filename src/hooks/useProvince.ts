'use client';
import 'client-only';

import { useContext, useEffect, useState } from 'react';
import { GlobalSettingContext } from '../contexts/globalSettingContext';

function useProvince() {
  const context = useContext(GlobalSettingContext);
  const [listProvince, setListProvince] = useState<any[] | []>([]);
  useEffect(() => {
    if (context.listProvince != null) {
      setListProvince(context.listProvince);
    } else {
      context.getProvince().then((province) => {
        if (province) {
          setListProvince(province);
        }
      });
    }
  }, [context]);
  const refreshProvince = () => {
    context.getProvince().then((listProvince) => {
      if (listProvince) {
        setListProvince(listProvince);
      }
    });
  };
  return { listProvince: listProvince, refreshProvince };
}

export default useProvince;
