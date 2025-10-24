import './styles.scss';

import { Carousel } from 'antd';
import Image from 'next/image';
type IProps = {
  data: any;
};

const ImageBanner: React.FC<IProps> = ({ data, ...props }) => {
  return (
    <div className="swiper-iamowner mb-20">
      <Carousel
        responsive={[
          {
            breakpoint: 768,
            settings: {
              className: 'hiden-arrow',
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: '30px',
            },
          },
        ]}
        slidesToShow={4}
        arrows
        className="lg:px-7"
      >
        {data?.map((bannerItem, index) => {
          return (
            <div key={`iib-${index}`} className="p-2">
              <div className="relative flex aspect-[290/500] w-full items-center justify-center overflow-hidden rounded-2xl bg-white drop-shadow-md">
                <Image
                  className="h-full w-fit object-scale-down"
                  src={bannerItem?.url}
                  alt={bannerItem.fileName}
                  loading="lazy"
                  fill
                />
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default ImageBanner;
