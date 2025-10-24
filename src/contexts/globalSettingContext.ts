'use client';

import GlobalSettingContextModel from '@/contexts/globalSettingContextModel';
import GlobalSettingModel from '@/contexts/globalSettingModel';
import { createContext } from 'react';

export const getGlobalSettingInitValue = (): GlobalSettingModel => {
  return {
    currentUser: null,
    keyword: [],
    allSettingLandingPage: null,
    listProvince: [],
    listDistrict: [],
    listWard: [],
    listPropertyType: null,
  };
};

export const GlobalSettingContext = createContext<GlobalSettingContextModel>(
  // @ts-ignore
  getGlobalSettingInitValue(),
);
