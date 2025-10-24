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

const AddToFavoriteButton: React.FC<Props> = ({ className, position = 'absolute', ...props }) => {
  const [_, setIsModalOpen] = ModalLoginOpen();
  const { status } = useAuthStore();
  const { toggleFavorite, myFavorites, removeFavorite, addFavorite } = useMyFavouriteStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const isThisFavorite = useMemo(
    () => (myFavorites ?? []).findIndex((x) => x.id === props.listingDetail.id) > -1,
    [myFavorites, props.listingDetail.id],
  );

  const handleClick = async () => {
    if (status === 'unauthenticated') {
      setIsModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);

      const exist = isThisFavorite;
      const result = await toggleFavorite(props.listingDetail.id, !exist);

      if (result && !exist) {
        addFavorite(props.listingDetail);
      } else if (result && exist) {
        removeFavorite(props.listingDetail);
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
        'flex size-4 cursor-pointer items-center justify-center rounded-full bg-none transition-colors duration-300 ease-out',
        // isThisFavorite ? 'bg-portal-primaryButtonAdmin' : 'bg-neutral-300',
        isLoading && 'pointer-events-none animate-spin drop-shadow-none',
        !isLoading && 'drop-shadow-xl',
        position === 'absolute' && 'absolute left-2 top-2 z-20',
        className,
      )}
      onClick={() => !isLoading && handleClick()}
    >
      <HeartIcon
        height={32}
        width={32}
        className={clsx(isThisFavorite && 'fill-portal-primaryButtonAdmin stroke-none')}
      />
    </div>
  );
};

export default AddToFavoriteButton;
