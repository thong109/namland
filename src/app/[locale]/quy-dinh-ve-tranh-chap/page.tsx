'use server';

import TsAndCsService from '@/apiServices/externalApiServices/apiTsAndCsService';
import { TypeModuleEnum } from '@/libs/appconst';
import PageClient from './PageClient';

const fetchData = async () => {
  const response = await TsAndCsService.getLandingPage({
    type: TypeModuleEnum.RegulationOnSettlement,
  });
  return {
    tsAndCs: response,
  };
};

const PageRegulationOnSettlement = async () => {
  const { tsAndCs } = await fetchData();
  return <PageClient data={tsAndCs} />;
};

export default PageRegulationOnSettlement;
