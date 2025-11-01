import { getEcomEcomAccountGetByIdPublish } from '@/ecom-sadec-api-client';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import { UserInfo } from '@/models/userModel/userInfoModel';
import { getTranslator } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { FC } from 'react';

// const ArticleInformationRatings = dynamic(() => import('@/components/ArticleInformation/ArticleInformationRatings'), { ssr: false });

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

const pageRating: FC<IProps> = async ({ params }) => {
  const lastIndex = params.id.lastIndexOf('-');
  const brokerId = params.id.substring(lastIndex + 1);

  const broker = (await getEcomEcomAccountGetByIdPublish({
    id: brokerId,
  })) as ApiResponseModel<UserInfo>;

  if (!broker.success || !broker.data) {
    notFound();
  }
  return (
    <div className="h-full">
      {/* <ArticleInformationRatings broker={broker.data} /> */}
    </div>
  );
};

export default pageRating;
