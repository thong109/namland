'use client';

import CarouselWithArrow from '@/app/[locale]/_components/CarouselWithArrow/CarouselWithArrow';
import { getEcomEcomFindAgentGetList } from '@/ecom-sadec-api-client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import "./EntrustAgent.css";
import { assetsImages } from '@/assets/images/package';

export interface IProps { }

const parentItems = [
  {
    id: 1,
    imageUrl: assetsImages.topLogo1,
    name: 'BEST HOUSE',
    phone: '+84-909 197 412',
    email: 'jenny.besthouse@gmail.com',
    address: 'Số 38 Đường Nội Khu Hưng Gia 4, Phường Tân Hưng, TP. HCM'
  },
  {
    id: 2,
    imageUrl: assetsImages.topLogo2,
    name: 'DAI PHAT GROUP',
    phone: '+84-961 607 399',
    email: 'congtambds@gmail.com',
    address: 'SA1/1 đường Cảnh Viên 1, Khu Phú Mỹ Hưng, Phường Tân Phú, Quận 7'
  },
  {
    id: 3,
    imageUrl: assetsImages.topLogo3,
    name: 'GREEN HOUSE',
    phone: '+84-902 400 919',
    email: 'hoalegd@gmail.com',
    address: 'Số 27 Đường O, Phường Tân Hưng, TP. HCM'
  },
  {
    id: 4,
    imageUrl: assetsImages.topLogo4,
    name: 'NTBT REAL ESTATE',
    phone: '+84-76 860 6345',
    email: 'ntbt.real@gmail.com',
    address: 'Số 34 Đường Số 16, The Sympho- ny - Midtown M6, Phường Tân Mỹ, TP. HCM'
  },
];

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
    return parentItems?.map((item: any) => (
      <div className='agent__viewport' key={item.id}>
        <div className="agent__wrapper">
          <div className="agent__image">
            <Image
              className="object-contain w-auto h-full"
              src={item.imageUrl}
              alt={item.name || 'Agent'}
              width={1280}
              height={170}
            />
          </div>
          <div className="agent__content">
            <span className="agent__content-name">{item.name}</span>
            <span className="agent__content-phone">{item.phone}</span>
            <span className="agent__content-email">
              <strong>Email</strong>
              <span className="block">{item.email}</span>
            </span>
            <span className="agent__content-address">
              <strong>Địa chỉ</strong>
              <span className="block">{item.address}</span>
            </span>
          </div>
        </div>
      </div>
    ));
  }, [listAgent]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesPerRow(1);
      else if (window.innerWidth < 1250) setSlidesPerRow(2);
      else setSlidesPerRow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="agent__container">
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
