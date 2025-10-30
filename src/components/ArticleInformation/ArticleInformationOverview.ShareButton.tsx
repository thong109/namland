'use client';

import IconShare from '@/components/Icons/IconShare';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';
import { FacebookShareButton } from 'next-share';
import React from 'react';

interface Props {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ShareButton: React.FC<Props> = ({ listingDetail, locale }) => {
  const t = useTranslations('webLabel');

  return (
    <FacebookShareButton url={window.location.href} quote={listingDetail.title}>
      <span className="flex items-center gap-2">
        <IconShare className="[&_g_path]:fill-neutral-500" />
        {t('EcomPropertyDetailPageDetailShare')}
      </span>
    </FacebookShareButton>
  );
};

export default React.memo(ShareButton);
