import { FC } from 'react';

export interface BadgeVipProps {
  className?: string;
  desc?: string;
}

const BadgeVip: FC<BadgeVipProps> = ({ className = '', desc = '' }) => {
  return (
    <div
      className={`nc-SaleOffBadge flex items-center justify-center rounded bg-portal-primaryLiving px-3 py-0.5 text-xs font-bold text-red-50 ${className}`}
      data-nc-id="SaleOffBadge"
    >
      {desc}
    </div>
  );
};

export default BadgeVip;
