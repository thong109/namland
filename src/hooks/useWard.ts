'use client';
import 'client-only';

import { useContext, useEffect, useState } from 'react';
import { GlobalSettingContext } from '../contexts/globalSettingContext';

function useWard() {
  const context = useContext(GlobalSettingContext);
  const [listWard, setListWard] = useState<any[] | []>([]);
  useEffect(() => {
    if (context.listWard != null) {
      setListWard(context.listWard);
    } else {
      context.getWard().then((ward) => {
        if (ward) {
          setListWard(ward);
        }
      });
    }
  }, [context]);
  const refreshWard = () => {
    context.getWard().then((listWard) => {
      if (listWard) {
        setListWard(listWard);
      }
    });
  };
  return { listWard: listWard, refreshWard };
}

export default useWard;
