import { Carousel, CarouselProps } from 'antd';
import clsx from 'clsx';
import React, { FC } from 'react';
import styles from './ListingCarousel.module.scss';

export interface IProps {
  items: React.JSX.Element[];
  hasArrow?: boolean;
  slidesPerRow?: number;
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return <div className={className} style={{ ...style, display: 'block' }} onClick={onClick} />;
}
const generatePages = (items: React.JSX.Element[], slidesPerRow: number) => {
  const pages: React.JSX.Element[][] = [];

  // Chia items thành từng nhóm theo slidesPerRow
  for (let i = 0; i < items.length; i += slidesPerRow) {
    pages.push(items.slice(i, i + slidesPerRow));
  }

  // Nếu trang cuối không đủ items, nối thêm từ đầu danh sách
  if (pages.length > 0 && pages[pages.length - 1].length < slidesPerRow) {
    const remainingItems = slidesPerRow - pages[pages.length - 1].length;
    pages[pages.length - 1] = [...pages[pages.length - 1], ...items.slice(0, remainingItems)];
  }

  return pages;
};

const CarouselWithArrow: FC<IProps & CarouselProps> = ({
  items,
  slidesPerRow = 3,
  hasArrow = true,
  ...props
}) => {
  const pages = generatePages(items, slidesPerRow);
  return (
    <div className={clsx('-mx-1', styles.customCarousel)}>
      <Carousel
        arrows={hasArrow}
        dots={false}
        slidesPerRow={slidesPerRow}
        nextArrow={<SampleNextArrow />}
        prevArrow={<SamplePrevArrow />}
        {...props}
      >
        {pages}
      </Carousel>
    </div>
  );
};

export default React.memo(CarouselWithArrow);
