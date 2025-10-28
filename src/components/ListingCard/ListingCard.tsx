import React from 'react';
import ListingCardBasic from './ListingCard.Basic';
import ListingCardGold from './ListingCard.Gold';
import ListingCardPlatinum from './ListingCard.Platinum';

interface ListingCardProps {
  className?: string;
  listing: any;
  variant: 'platinum' | 'gold' | 'basic';
}

const ListingCard: React.FC<ListingCardProps> = ({ className, listing, variant }) => {
  if (variant === 'platinum') {
    return <ListingCardPlatinum className={className} listing={listing} />;
  } else if (variant === 'gold') {
    return <ListingCardGold className={className} listing={listing} />;
  } else {
    return <ListingCardBasic className={className} listing={listing} />;
  }
};

export default React.memo(ListingCard);
