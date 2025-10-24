'use server';

import HomePageOurOwnerService from '@/app/[locale]/i-am-owner/_components/HomePageOurOwnerService';
import { getEcomOwnerGetDetail } from '@/ecom-sadec-api-client';
import { FC } from 'react';

export interface IProps {}

const SectionOurOwnerService: FC<IProps> = async () => {
  const response = await getEcomOwnerGetDetail();
  const data = (response as any).data?.ownerContentDetails.filter(
    (item) => item.type !== 'Contact Us',
  );
  return <HomePageOurOwnerService data={data} />;
};

export default SectionOurOwnerService;
