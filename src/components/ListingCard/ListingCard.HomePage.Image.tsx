import Image from 'next/image';
import React from 'react';

interface ListingCardHomePageProps {
  urls: any;
}

const ListingCardHomePageImage: React.FC<ListingCardHomePageProps> = ({ urls }) => {
  if (!urls) {
    return null;
  }

  return (
    <Image src={urls[0]?.url} alt={'image'} className="object-cover" sizes="200px" fill priority />
  );
};

export default ListingCardHomePageImage;
