import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { FC, useMemo } from 'react';
import ribbonStyle from './Ribbon.module.scss';

export interface IProps {
  variant: 'new' | 'sale';
}

const CardListingRibbon: FC<IProps> = ({ variant }) => {
  const t = useTranslations('webLabel');

  const label = useMemo(() => {
    if (variant === 'new') {
      return t('EcomPropertyListingDetailPageLocationStatus');
    } else if (variant === 'sale') {
      return t('EcomPropertyListingDetailPageLocationSale');
    }
  }, [variant, t]);

  return (
    <span className={clsx('card-common-listing__visual-status')}>
      {label}
    </span>
  );
};

export default React.memo(CardListingRibbon);
