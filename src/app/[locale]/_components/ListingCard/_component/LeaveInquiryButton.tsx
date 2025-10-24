'use client';

import IconChat from '@/components/Icons/IconChat';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

interface LeaveInquiryButtonProps {
  listingDetail: any;
  className?: string;
}

const LeaveInquiryButton: React.FC<LeaveInquiryButtonProps> = ({ listingDetail, className }) => {
  const t = useTranslations('webLabel');

  return (
    <div
      className={clsx(
        'absolute flex cursor-pointer items-center gap-3 rounded-[36px] border border-green bg-neutral-0 px-2 py-1',
        className,
      )}
    >
      <div className="flex size-5 items-center justify-center rounded-full bg-cyan">
        <IconChat />
      </div>
      <div className="text-sm font-semibold text-portal-primaryLiving">
        {t('EcomHomePageListingLeaveAnInquiry')}
      </div>
    </div>
  );
};

export default React.memo(LeaveInquiryButton);
