import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
interface Attachment {
  bannerId: string;
  bannerImageUrl: string;
  bannerName: string;
  bannerLink: string;
  sequence: number;
}

export interface IProps {
  attachment: Attachment;
}

const TopBannerCarouselImage: FC<IProps> = async ({ attachment }) => {
  return (
    <Link href={attachment.bannerLink ?? ''} target={'_blank'} className="">
      <Image
        className="object-contain"
        src={attachment?.bannerImageUrl ?? ''}
        alt={attachment.bannerName ?? ''}
        sizes="80vw"
        width={1920}
        height={1080}
        loading={'lazy'}
      />
    </Link>
  );
};

export default React.memo(TopBannerCarouselImage);
