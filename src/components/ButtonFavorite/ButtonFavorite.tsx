'use client';

import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import IconHeart from '@/components/Icons/IconHeart';
import ListingModel from '@/models/listingModel/listingModel';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyFavouriteStore } from '@/stores/useMyFavouriteStore';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import * as pixel from '@/utils/pixel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import './ButtonFavorite.css'

interface Props {
  locale: string;
  listingDetail: listingPropertyModel | ListingModel | ProjectDetailModel;
}

const ButtonFavorite: React.FC<Props> = ({ listingDetail, locale }) => {
  const t = useTranslations('webLabel');
  const [_, setIsModalOpen] = ModalLoginOpen();
  const { status } = useAuthStore();
  const { toggleFavorite, myFavorites, removeFavorite, addFavorite } = useMyFavouriteStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const isThisFavorite = useMemo(
    () => (myFavorites ?? []).findIndex((x) => x.id === listingDetail.id) > -1,
    [myFavorites, listingDetail.id],
  );
  const handleClick = async () => {
    if (status === 'unauthenticated') {
      setIsModalOpen(true);
      return;
    }
    try {
      setIsLoading(true);
      const exist = (myFavorites ?? []).findIndex((x) => x.id === listingDetail.id) > -1;
      const result = await toggleFavorite(listingDetail.id, !exist);
      if (result && !exist) {
        addFavorite(listingDetail as ListingModel);
        pixel.addToWishlist(listingDetail.id);
      } else if (result && exist) {
        removeFavorite(listingDetail as ListingModel);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={clsx(
        'button-common-favorite',
        isThisFavorite && 'is-state-active',
      )}
      onClick={handleClick}
    >
      <svg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M18.75 5.25C18.75 2.765 16.651 0.75 14.062 0.75C12.127 0.75 10.465 1.876 9.75 3.483C9.035 1.876 7.373 0.75 5.437 0.75C2.85 0.75 0.75 2.765 0.75 5.25C0.75 12.47 9.75 17.25 9.75 17.25C9.75 17.25 18.75 12.47 18.75 5.25Z' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    </div>
  );
};

export default React.memo(ButtonFavorite);
