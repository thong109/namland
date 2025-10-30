import React from 'react';
import './CardListing.css';
import CardListingBasic from './CardListing.Basic';

interface CardListingProps {
  className?: string;
  listing: any;
}

const CardListing: React.FC<CardListingProps> = ({ className, listing }) => {
  return <CardListingBasic className={className} listing={listing} />;
};

export default React.memo(CardListing);
