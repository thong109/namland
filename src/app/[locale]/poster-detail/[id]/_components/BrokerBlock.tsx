import AvatarDefault from '@/assets/images/avarta-default.svg';
import { UserInfo } from '@/models/userModel/userInfoModel';
import { getTranslator } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

interface Props {
  broker: UserInfo;
  locale: string;
}

const BrokerBlock: React.FC<Props> = async ({ broker, locale }) => {
  const t = await getTranslator(locale, 'webLabel');
  return (
    <div className='flex w-full flex-col gap-4 lg:flex-row'>
      <div className='size-80 rounded-2xl bg-neutral-0 p-4'>
        <div className='relative size-full'>
          <Image
            className='object-cover'
            src={broker?.avatarUrl ?? AvatarDefault?.src}
            alt={broker?.fullName}
            layout='fill'
          />
        </div>
      </div>
      <div className='flex flex-grow flex-col gap-4 rounded-2xl bg-neutral-0 p-4'>
        <div className='text-xl font-bold uppercase text-green'>{broker?.fullName}</div>
        <div className='grid grid-cols-1 gap-4 text-sm lg:grid-cols-2'>
          <div className='col-span-1'>
            <div>{t('EcomPosterDetailBrokerPageEmail')}</div>
            <div className='border border-neutral-300 px-2 py-3'>{broker?.email}</div>
          </div>
          <div className='col-div-1'>
            <div>{t('EcomPosterDetailBrokerPageMobile')}</div>
            <div className='border border-neutral-300 px-2 py-3'>
              {broker?.contactNumber ?? broker?.phone}
            </div>
          </div>
        </div>
        <div>
          <div>{t('EcomPosterDetailBrokerPageDescription')}</div>
          <div className='border border-neutral-300 px-2 py-3'>{broker?.aboutMe}</div>
        </div>
      </div>
    </div>
  );
};

export default BrokerBlock;
