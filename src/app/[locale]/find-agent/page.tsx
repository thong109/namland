'use server';
import Bg from '@/assets/images/banner-entrust-1.jpg';
import { getEcomOwnerGetDetail } from '@/ecom-sadec-api-client';
import { getTranslator } from 'next-intl/server';
import Image from 'next/image';
import { FC } from 'react';
import ContactUs from './_components/ContactUs';
import EntrustAgent from './_components/EntrustAgent';
import ServiceContent from './_components/ServiceContent';
import EntrustBannerHeader from './_components/entrustBannerHeader';
export interface IProps {
  params: any;
}

const PageEntrust: FC<IProps> = async ({ params: { locale } }) => {
  const t = await getTranslator(locale, 'webLabel');

  const response = await getEcomOwnerGetDetail();

  const contactUsContent = (response as any).data?.ownerContentDetails.find(
    (item) => item.type === 'Contact Us',
  );
  const serviceContents = (response as any).data?.ownerContentDetails.filter(
    (item) => item.type !== 'Contact Us',
  );

  return (
    <div className="container pb-5 pt-5">
      <div>
        <EntrustBannerHeader />
        <ServiceContent data={serviceContents} />
        <ContactUs data={contactUsContent} />
        <div className="relative mt-6 h-40 w-full lg:h-96">
          <Image
            className="h-full w-full object-cover"
            src={Bg.src}
            alt={`banner`}
            loading="lazy"
            fill
          />
        </div>
        <EntrustAgent />
      </div>
    </div>
  );
};

export default PageEntrust;
