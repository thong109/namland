'use client';

import Image from 'next/image';
import { FC } from 'react';
import { assetsImages } from '@/assets/images/package';
import SectionHeroForm from '../SectionHeroForm/SectionHeroForm';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import './SectionHero.css'

export interface SectionHeroProps {
  className?: string;
  locale: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = '' }) => {
  return (
    <div className='section-home-hero'>
      <div className='container'>
        <div className='section-home-hero__wrapper'>
          <span className='section-home-hero__title'>
            Giải pháp giao dịch bất động sản từ trực tuyến đến trực tiếp của Nam Long Living
          </span>
          <SectionHeroForm />
        </div>
        <div className='section-home-hero__visual'>
          <ButtonCore preset='directing' label='Xem chi tiết' />
          <div className='section-home-hero__visual-wrapper'>
            <Image src={assetsImages.homeBackgroundHero} alt='Visual' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHero;
