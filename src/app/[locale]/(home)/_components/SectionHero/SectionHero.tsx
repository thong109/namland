import BgHome from '@/assets/images/bg-home-2.webp';
import Image from 'next/image';
import { FC } from 'react';
import HomeRealEstateSearchForm from '../HomeRealEstateSearchForm/HomeRealEstateSearchForm';

export interface SectionHeroProps {
  className?: string;
  locale: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = '' }) => {
  return (
    <div className={`nc-SectionHero relative ${className}`} data-nc-id="SectionHero">
      <div className="absolute inset-y-0 left-0 w-full flex-grow">
        <Image className="object-cover" src={BgHome.src} alt="hero" fill />
      </div>
      <div className="relative px-2 py-5 lg:px-0 lg:py-20">
        {/* <div className="hidden w-full lg:mt-20 lg:block"> */}
        <HomeRealEstateSearchForm />
        {/* </div> */}
      </div>
    </div>
  );
};

export default SectionHero;
