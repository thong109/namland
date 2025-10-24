'use server';
import { getEcomOwnerGetDetail } from '@/ecom-sadec-api-client';
import { Typography } from 'antd';
import { getTranslator } from 'next-intl/server';
import { FC } from 'react';
import ContactUs from './_components/ContactUs';
import ImageBanner from './_components/ImageBanner';
import ServiceContent from './_components/ServiceContent';

export interface IProps {
  params: any;
}

const PageIAmOwner: FC<IProps> = async ({ params: { locale } }) => {
  const t = await getTranslator(locale, 'webLabel');

  const response = await getEcomOwnerGetDetail();

  // if ((response as any).success) {
  const imageBanner = (response as any).data?.imageBanner;
  const contactUsContent = (response as any).data?.ownerContentDetails.find(
    (item) => item.type === 'Contact Us',
  );
  const serviceContents = (response as any).data?.ownerContentDetails.filter(
    (item) => item.type !== 'Contact Us',
  );

  // }

  return (
    <div className="container pb-20 pt-5">
      <Typography className="mb-10 text-center text-3xl font-bold uppercase text-portal-primaryLiving">
        {t('EcomIAmOwnerAmOwner')}
      </Typography>
      <div>
        <ImageBanner data={imageBanner} />
        <div className="lg:px-10">
          <ServiceContent data={serviceContents} />
          <ContactUs data={contactUsContent} />
        </div>
      </div>
    </div>
  );
};

export default PageIAmOwner;
