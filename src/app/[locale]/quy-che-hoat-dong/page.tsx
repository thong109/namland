'use server';

import TsAndCsService from '@/apiServices/externalApiServices/apiTsAndCsService';
import { TypeModuleEnum } from '@/libs/appconst';
import PageClient from './PageClient';

const fetchData = async () => {
  const response = await TsAndCsService.getLandingPage({
    type: TypeModuleEnum.OperatingRegulations,
  });
  return {
    tsAndCs: response,
  };
};

const PageConditions = async () => {
  const { tsAndCs } = await fetchData();
  return <PageClient data={tsAndCs} />;
};

export default PageConditions;
