'use client';

import CarouselWithArrow from '@/app/[locale]/_components/CarouselWithArrow/CarouselWithArrow';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { FC, useMemo } from 'react';
import tempAgent from './temp-agent.jpg';

export interface IProps {}

const EntrustAgent: FC<IProps> = () => {
  const t = useTranslations('webLabel');

  const items = useMemo(() => {
    return [...Array(10).keys()].map((x) => (
      <div className={clsx('lg:h-96 lg:w-64 lg:px-2')} key={x}>
        <Image
          className="object-cover max-lg:size-36 max-lg:min-w-36 max-lg:rounded-full lg:rounded-2xl"
          src={tempAgent.src}
          alt="top-banner"
          width={1280}
          height={1920}
        />
      </div>
    ));
  }, []);
  return (
    <div className="container flex w-full flex-col gap-4">
      <h1 className="text-center text-3xl font-bold">{t('EcomHomePageEntrustAgent')}</h1>
      <CarouselWithArrow items={items} className="!hidden lg:!block">
        {items}
      </CarouselWithArrow>

      <div className={clsx('flex overflow-x-auto max-lg:gap-4 lg:hidden')}>{items}</div>
    </div>
  );
};

export default React.memo(EntrustAgent);
