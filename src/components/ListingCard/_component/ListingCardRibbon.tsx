import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { FC, useMemo } from 'react';
import ribbonStyle from './Ribbon.module.scss';

export interface IProps {
  variant: 'platinum' | 'gold' | 'basic';
  className?: any;
}

const ListingCardRibbon: FC<IProps> = ({ variant, className }) => {
  const t = useTranslations('enum');

  const label = useMemo(() => {
    if (variant === 'platinum') {
      return t('ListPropertyStatusEnum.Platinum');
    } else if (variant === 'gold') {
      return t('ListPropertyStatusEnum.Gold');
    } else {
      return t('ListPropertyStatusEnum.Basic');
    }
  }, [variant, t]);

  const classNamStyle = useMemo(() => {
    if (variant === 'platinum') {
      return `${className} bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 text-neutral-900`;
    } else if (variant === 'gold') {
      return `${className} bg-gradient-to-r from-yellow via-neutral-0 to-yellow text-neutral-900`;
    }
  }, [variant]);

  return (
    <div
      className={clsx(
        'absolute left-0 top-2 z-30 flex items-center justify-center px-10 py-1 pr-14 font-semibold',
        classNamStyle,
        ribbonStyle.ribbon,
      )}
    >
      <div className="absolute left-0 top-1 h-[1px] w-full border-t border-t-neutral-500"></div>
      {label}
      <div className="absolute bottom-1 left-0 h-[1px] w-full border-t border-t-neutral-500"></div>
    </div>
  );
};

export default React.memo(ListingCardRibbon);
