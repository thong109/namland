'use client';

import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import IconHeart from '@/components/Icons/IconHeart';
import ListingModel from '@/models/listingModel/listingModel';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyFavouriteStore } from '@/stores/useMyFavouriteStore';
import * as pixel from '@/utils/pixel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

interface Props {
  locale: string;
  listingDetail: listingPropertyModel | ListingModel;
}

const FavoriteButton: React.FC<Props> = ({ listingDetail, locale }) => {
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
    <span className="flex cursor-pointer items-center gap-2" onClick={handleClick}>
      <IconHeart
        className={clsx(
          '[&_g_path]:stroke-neutral-500',
          isThisFavorite && 'fill-portal-primaryButtonAdmin',
        )}
      />
      {t('EcomPropertyDetailPageDetailFavorite')}
    </span>
  );
};

export default React.memo(FavoriteButton);
