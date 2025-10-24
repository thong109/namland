'use client';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyFavouriteStore } from '@/stores/useMyFavouriteStore';
import { HeartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useMemo } from 'react';

interface Props {
  className?: string;
  listingDetail: any;
  position?: 'normal' | 'absolute';
}

const AddToFavoriteButtonNewHome: React.FC<Props> = ({
  className,
  position = 'absolute',
  ...props
}) => {
  const [_, setIsModalOpen] = ModalLoginOpen();
  const { status } = useAuthStore();
  const { toggleFavoriteNewHome, myFavoritesNewHome, removeFavoriteNewHome, addFavoriteNewHome } =
    useMyFavouriteStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const isThisFavorite = useMemo(
    () => (myFavoritesNewHome ?? []).findIndex((x) => x.id === props.listingDetail.id) > -1,
    [myFavoritesNewHome, props.listingDetail.id],
  );

  const handleClick = async (e) => {
    e.stopPropagation();
    if (status === 'unauthenticated') {
      setIsModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);

      const exist = isThisFavorite;
      const result = await toggleFavoriteNewHome(props.listingDetail.id, !exist);

      if (result && !exist) {
        addFavoriteNewHome(props.listingDetail);
      } else if (result && exist) {
        removeFavoriteNewHome(props.listingDetail);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HeartIcon
      onClick={(e) => !isLoading && handleClick(e)}
      height={32}
      width={32}
      className={clsx(isThisFavorite && 'fill-portal-primaryButtonAdmin stroke-none')}
    />
  );
};

export default AddToFavoriteButtonNewHome;
