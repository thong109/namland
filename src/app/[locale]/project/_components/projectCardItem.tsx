import { getProjectUrl } from '@/utils/urlUtil';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';

type IProps = {
  data: any;
  className?: string;
};

const ProjectCardItem: React.FC<IProps> = ({ data, className = '', ...props }) => {
  const t = useTranslations('webLabel');

  const { id, name, imageUrl, saleCount, rentCount, logoImage } = data;

  const projectDetailUrl = getProjectUrl(id, name);

  return (
    <div
      className={`flex h-full flex-col border border-portal-border transition lg:hover:scale-[1.03] ${className}`}
    >
      <Link legacyBehavior href={projectDetailUrl}>
        <div className={`relative h-64 w-full overflow-hidden`}>
          <div className="absolute z-10 h-full w-full bg-gradient-to-b from-[rgba(1,1,1,0.0)] from-65% via-[rgba(1,1,1,0.5)] to-[rgba(1,1,1,0.7)] to-100%" />
          <Image
            alt="image"
            src={logoImage?.thumbUrl}
            className="h-full w-full"
            loading="lazy"
            fill
          />
          <div className="absolute bottom-0 z-20 flex w-full flex-col items-center p-4">
            <Typography className={`line-clamp-1 text-base font-semibold text-white`}>
              {name}
            </Typography>
            <div className="mt-2 grid grid-cols-2 gap-6">
              <Typography className={`text-sm text-white underline underline-offset-2`}>
                {t('ProjectListingItemSale')} {saleCount}
              </Typography>
              <Typography className={`text-sm text-white underline underline-offset-2`}>
                {t('ProjectListingItemLease')} {rentCount}
              </Typography>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCardItem;
