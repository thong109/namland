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
    <div className="bg-cover" style={{ backgroundImage: `url(${FindHomeBg.src})` }}>
      <div className="container">
        <div
          className="relative flex gap-6 mobile:gap-4 h-[70vh] w-full mobile:flex-col items-center justify-center">
          <Link legacyBehavior href={'/toi-muon-tim-nha'}>
            <div className="flex w-[40%] mobile:w-full cursor-pointer items-center justify-center bg-white py-3 font-semibold shadow-md transition hover:bg-gray-100">
              {t('FindAHomeLandingPage')}
            </div>
          </Link>
          <Link legacyBehavior href={'/find-agent'}>
            <div className="flex w-[40%] mobile:w-full cursor-pointer items-center justify-center bg-portal-primaryLiving py-3 font-semibold text-white shadow-md transition hover:opacity-90">
              {t('SellAndRentMyHome')}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyRequestHome;
