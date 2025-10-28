import Image from 'next/image';
import React from 'react';

interface CardListingHomePageProps {
  urls: any;
}

const CardListingHomePageImage: React.FC<CardListingHomePageProps> = ({ urls }) => {
  if (!urls) {
    return null;
  }

  return (
    <Image src={urls[0]?.url} alt={'image'} className="object-cover" sizes="200px" fill priority />
  );
};

export default CardListingHomePageImage;
