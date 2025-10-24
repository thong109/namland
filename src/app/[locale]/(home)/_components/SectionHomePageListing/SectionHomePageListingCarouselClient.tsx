import CarouselWithArrow from '@/app/[locale]/_components/CarouselWithArrow/CarouselWithArrow';
import ListingCardHomePage from '@/app/[locale]/_components/ListingCard/ListingCard.HomePage';
import { Spin } from 'antd';
import clsx from 'clsx';
import { FC } from 'react';

interface IProps {
  isLoading: boolean;
  listingState: any;
}

export const SectionHomePageListingCarouselClient: FC<IProps> = ({ isLoading, listingState }) => {
  return (
    <Spin spinning={isLoading}>
      <CarouselWithArrow
        className="!hidden lg:!block"
        slidesPerRow={4}
        items={listingState?.data?.data?.map((item) => (
          <div key={item.id} className="h-full">
            <ListingCardHomePage listing={item} className="px-2" />
          </div>
        ))}
      />

      <div className={clsx('flex overflow-x-auto max-lg:gap-4 lg:hidden')}>
        {listingState?.data?.data?.map((item) => (
          <div key={item.id} className={clsx('h-full max-lg:w-80 max-lg:min-w-80', 'lg:square')}>
            <ListingCardHomePage listing={item} className="px-2" />
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default SectionHomePageListingCarouselClient;
