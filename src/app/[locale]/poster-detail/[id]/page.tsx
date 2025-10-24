import { getEcomEcomAccountGetByIdPublish } from '@/ecom-sadec-api-client';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import { UserInfo } from '@/models/userModel/userInfoModel';
import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import BrokerBlock from './_components/BrokerBlock';
import SectionListingForRent from './_components/SectionListingForRent';
import SectionListingForSale from './_components/SectionListingForSale';

export interface IProps {
  params: { locale: string; id: string };
}

export async function generateMetadata({ params }: IProps) {
  const lastIndex = params.id.lastIndexOf('-');
  const brokerId = params.id.substring(lastIndex + 1);
  const broker = (await getEcomEcomAccountGetByIdPublish({
    id: brokerId,
  })) as ApiResponseModel<UserInfo>;

  const t = await getTranslator(params.locale);

  if (!broker.success || !broker.data) {
    return null;
  }

  return {
    title: t.rich('webLabel.EcomPosterDetailBrokerPageTitle', {
      broker: () => broker.data.fullName,
    }),
  };
}

const PosterDetail: FC<IProps> = async ({ params }) => {
  const lastIndex = params.id.lastIndexOf('-');
  const brokerId = params.id.substring(lastIndex + 1);
  const locale = useLocale();

  const broker = (await getEcomEcomAccountGetByIdPublish({
    id: brokerId,
  })) as ApiResponseModel<UserInfo>;

  if (!broker.success || !broker.data) {
    notFound();
  }
  return (
    <div className="container flex flex-col gap-4 pb-20 pt-5">
      <BrokerBlock broker={broker.data} locale={locale} />
      <SectionListingForSale brokerId={brokerId} locale={locale} />
      <SectionListingForRent brokerId={brokerId} locale={locale} />
    </div>
  );
};

export default PosterDetail;
