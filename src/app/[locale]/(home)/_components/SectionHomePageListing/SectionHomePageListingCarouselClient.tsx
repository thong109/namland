import CarouselWithArrow from '@/app/[locale]/_components/CarouselWithArrow/CarouselWithArrow';
import CardListingHomePage from '@/components/CardListing/CardListingHomePage';
import { Spin } from 'antd';
import { FC, useEffect, useState } from 'react';

interface IProps {
  isLoading: boolean;
  listingState: any;
}

export const SectionHomePageListingCarouselClient: FC<IProps> = ({ isLoading, listingState }) => {
  const [slidesPerRow, setSlidesPerRow] = useState(4);

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
    <Spin spinning={isLoading}>
      <CarouselWithArrow
        className="block"
        slidesPerRow={slidesPerRow}
        items={listingState?.data?.data?.map((item) => (
          <div key={item.id} className="mobile:px-2 laptop-sm:px-[6px] desktop:px-[15px]">
            <CardListingHomePage listing={item} />
          </div>
        ))}
      />
    </Spin>
  );
};

export default SectionHomePageListingCarouselClient;
