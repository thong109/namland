'use client';
import 'client-only';

import { useContext, useEffect, useState } from 'react';
import { GlobalSettingContext } from '../contexts/globalSettingContext';

function useAllSettingLandingPage() {
  const context = useContext(GlobalSettingContext);
  const [allSettingLandingPage, setAllSettingLandingPage] = useState<any[] | []>(
    context.allSettingLandingPage ?? [],
  );

  useEffect(() => {
    if (context.allSettingLandingPage != null && !allSettingLandingPage) {
      setAllSettingLandingPage(context.allSettingLandingPage);
    } else if (!allSettingLandingPage) {
      context.getAllSettingLandingPage().then((allSettingLandingPage) => {
        if (allSettingLandingPage) {
          setAllSettingLandingPage(allSettingLandingPage);
        }
      });
    }
  }, [context, allSettingLandingPage]);

  const refreshAllSetting = () => {
    context.getKeywordBlacklist().then((allSettingLandingPage) => {
      if (allSettingLandingPage) {
        setAllSettingLandingPage(allSettingLandingPage);
      }
    });
  };
  return { allSettingLandingPage: allSettingLandingPage, refreshAllSetting };
}

export default useAllSettingLandingPage;
