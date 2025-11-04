'use client';

import CarouselWithArrow from '@/app/[locale]/_components/CarouselWithArrow/CarouselWithArrow';
import { getEcomEcomFindAgentGetList } from '@/ecom-sadec-api-client';
import { Typography } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

export interface IProps { }

const EntrustAgent: FC<IProps> = () => {
  const t = useTranslations('webLabel');
  const [listAgent, setListAgent] = useState<any>([]);
  const [slidesPerRow, setSlidesPerRow] = useState(4);

  const getData = useCallback(async () => {
    try {
      const response = await getEcomEcomFindAgentGetList();
      setListAgent((response as any)?.data);
    } catch (error) {
      console.error('Failed to fetch agents', error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const items = useMemo(() => {
    return listAgent.map((item: any) => (
      <div className={clsx('lg:h-fit lg:w-fit lg:px-2')} key={item.id}>
        <Image
          className="object-cover max-lg:size-64 max-lg:min-w-64"
          src={item.imageUrl}
          alt={item.name || 'Agent'}
          width={1280}
          height={1920}
        />
      </div>
    ));
  }, [listAgent]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesPerRow(2);
      else setSlidesPerRow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="my-16 flex w-full flex-col gap-4">
      <p className="mb-1 text-xl md:text-[30px] font-semibold text-black leading-1">
        {t('EcomHomePageEntrustAgent')}
      </p>
      <CarouselWithArrow
        items={items}
        className="block"
        slidesPerRow={slidesPerRow}
      >{items}</CarouselWithArrow>
    </div>
  );
};

export default React.memo(EntrustAgent);
