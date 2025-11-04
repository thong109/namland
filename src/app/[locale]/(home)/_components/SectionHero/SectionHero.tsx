'use client';

import Image from 'next/image';
import { FC } from 'react';
import { assetsImages } from '@/assets/images/package';
import SectionHeroForm from '../SectionHeroForm/SectionHeroForm';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import './SectionHero.css'
import { useTranslations } from 'next-intl';

export interface SectionHeroProps {
  className?: string;
  locale: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = '' }) => {
  const t = useTranslations('webLabel');
  
  return (
    <div className='section-home-hero'>
      <div className='container'>
        <div className='section-home-hero__wrapper'>
          <span className='section-home-hero__title'>
            {t('EcomEntrustSolution')}
          </span>
          <SectionHeroForm />
        </div>
        <div className='section-home-hero__visual'>
          <ButtonCore preset='directing' label={t('EcomPropertyListingDetailPageLocationDetail')} />
          <div className='section-home-hero__visual-wrapper'>
            <Image src={assetsImages.homeBackgroundHero} alt='Visual' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHero;
