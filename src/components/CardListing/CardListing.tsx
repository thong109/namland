import React from 'react';
import './CardListing.css';
import CardListingBasic from './CardListing.Basic';
import CardListingGold from './CardListing.Gold';
import CardListingPlatinum from './CardListing.Platinum';

interface CardListingProps {
  className?: string;
  listing: any;
  variant: 'platinum' | 'gold' | 'basic';
}

const CardListing: React.FC<CardListingProps> = ({ className, listing, variant }) => {
  if (variant === 'platinum') {
    return <CardListingPlatinum className={className} listing={listing} />;
  } else if (variant === 'gold') {
    return <CardListingGold className={className} listing={listing} />;
  } else {
    return <CardListingBasic className={className} listing={listing} />;
  }
};

export default React.memo(CardListing);
