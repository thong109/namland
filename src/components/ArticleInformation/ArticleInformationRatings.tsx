'use client';
import ratingApiService from '@/apiServices/externalApiServices/apiRatingService';
import AvatarDefault from '@/assets/images/avarta-default.svg';
import { Rate } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import dynamic from 'next/dynamic';
import './ArticleInformationRatings.css';

const ArticleInformationRatingsInquiry = dynamic(() => import('@/components/ArticleInformation/ArticleInformationRatingsInquiry'), { ssr: false });

export const ArticleInformationRatings = ({ listingDetail, locale }) => {
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
          <div className='ratings-common-information__avatar-wrapper'>
            <Image
              src={listingDetail?.userInfo?.avatarUrl ?? AvatarDefault?.src}
              alt='avatar'
              width={131}
              height={131}
            />
          </div>
          <span className='ratings-common-information__avatar-label'>{listingDetail?.userInfo?.fullName}</span>
        </div>
        <div className='ratings-common-information__profile-controller'>
          <ButtonCore
            className='w-full'
            type='submit'
            preset='secondary-reversed'
            label='Gọi ngay'
          />
          <ArticleInformationRatingsInquiry listingDetail={listingDetail} locale={locale} />
        </div>
      </div>
      <span className='ratings-common-information__title'>{t('REAL_ESTATE_AGENT')}</span>
      <ul className='ratings-common-information__wrapper'>
        <li className='ratings-common-information__item'>
          <span className='ratings-common-information__item-score'>0</span>
          <span className='ratings-common-information__item-label'>Đánh giá</span>
        </li>
        <li className='ratings-common-information__item'>
          <span className='ratings-common-information__item-score'>0</span>
          <span className='ratings-common-information__item-label'>Xếp hạng sao</span>
        </li>
        <li className='ratings-common-information__item'>
          <span className='ratings-common-information__item-score'>0</span>
          <span className='ratings-common-information__item-label'>Đánh giá</span>
        </li>
        <li className='ratings-common-information__item'>
          <span className='ratings-common-information__item-score'>0</span>
          <span className='ratings-common-information__item-label'>Xếp hạng sao</span>
        </li>
      </ul>
      <ul className='ratings-common-information__description'>
        <li className='ratings-common-information__description-item'>Tính chuyên nghiệp</li>
        <li className='ratings-common-information__description-item'>Dịch vụ</li>
        <li className='ratings-common-information__description-item'>Trải nghiệm dịch vụ</li>
        <li className='ratings-common-information__description-item'>Tốc độ phản hồi</li>
        <li className='ratings-common-information__description-item'>Độ chính xác</li>
        <li className='ratings-common-information__description-item'>Đánh giá</li>
      </ul>
    </div>
  );
};
