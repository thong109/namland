'use client';
import ratingApiService from '@/apiServices/externalApiServices/apiRatingService';
import AvatarDefault from '@/assets/images/avarta-default.svg';
import backToHome from '@/assets/images/backToHome.png';
import { caculateDiffYears } from '@/libs/helper';
import { Rate } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ButtonCore from '@/components/ButtonCore/ButtonCore';

export const ArticleInformationRatings = ({ listingDetail }) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const agentRating = listingDetail?.agentRating;
  const [ratings, setRatings] = useState<any[]>([]);
  const [from, setFrom] = useState<number>(0);
  const [disableViewMore, setDisableViewMore] = useState<boolean>(false);
  const onShowMoreRating = async (init: boolean) => {
    let values = [];
    if (init) {
      values = agentRating?.data ?? [];
      setRatings(agentRating?.data);
    } else {
      values = await ratingApiService.getAllByUserId({
        userId: listingDetail?.userInfo?.id,
        from: from,
        size: 10,
      });
      setFrom(from + 10);
      setRatings((prevRatings) => {
        const safePrev = prevRatings ?? [];
        const existingIds = new Set(safePrev.map((item) => item.id));
        const newValues = values.filter((item) => !existingIds.has(item.id));
        return [...safePrev, ...newValues];
      });
    }
    if (values.length < 1) {
      setDisableViewMore(true);
    } else {
      setDisableViewMore(false);
    }
  };
  useEffect(() => {
    onShowMoreRating(true);
    setDisableViewMore(false);
    setFrom(0);
  }, []);
  return (
    <div className='ratings-common-information'>
      <div className='ratings-common-information__profile'>
        <div className='ratings-common-information__profile-avatar'>
          <Image
            className='ratings-common-information__avatar-wrapper'
            src={listingDetail?.userInfo?.avatarUrl ?? AvatarDefault?.src}
            alt='avatar'
            width={120}
            height={120}
          />
          <span className='ratings-common-information__avatar-label'>{listingDetail?.userInfo?.fullName}</span>
        </div>
        <div className='ratings-common-information__profile-controller'>
          <ButtonCore
            className='w-full'
            type='submit'
            label='Gọi ngay'
          />
          <ButtonCore
            className='w-full'
            type='submit'
            label='Tư vấn ngay'
          />
        </div>
      </div>
      <span className='ratings-common-information__title'>{t('REAL_ESTATE_AGENT')}</span>
    </div>
  );
};
