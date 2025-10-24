'use server';
import FindHomeBg from '@/assets/images/find-home-backgound.webp';
import Link from 'next-intl/link';
import { getTranslator } from 'next-intl/server';
import { FC } from 'react';
export interface IProps {
  params: any;
}

const MyRequestHome: FC<IProps> = async ({ params: { locale } }) => {
  const t = await getTranslator(locale, 'webLabel');

  return (
    <div
      className="relative flex h-[70vh] w-[100vw] flex-col items-center justify-center bg-cover"
      style={{ backgroundImage: `url(${FindHomeBg.src})` }}
    >
      <Link legacyBehavior href={'/toi-muon-tim-nha'}>
        <div className="mb-2 flex w-[70vw] cursor-pointer items-center justify-center bg-white py-3 font-semibold shadow-md transition hover:bg-gray-100 lg:w-[40vw]">
          {t('FindAHomeLandingPage')}
        </div>
      </Link>
      <Link legacyBehavior href={'/find-agent'}>
        <div className="mb-2 flex w-[70vw] cursor-pointer items-center justify-center bg-portal-primaryButtonAdmin py-3 font-semibold text-white shadow-md transition hover:opacity-90 lg:w-[40vw]">
          {t('SellAndRentMyHome')}
        </div>
      </Link>
    </div>
  );
};

export default MyRequestHome;
