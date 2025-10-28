import { assetsImages } from '@/assets/images/package';
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

  const { id, name, imageUrl, totalArea, address } = data;

  const projectDetailUrl = getProjectUrl(id, name);

  return (
    <div
      className={`flex h-full flex-col border border-portal-gray-border transition p-[22px] mobile:p-4 rounded-[10px] ${className}`}
    >
      <Link legacyBehavior href={projectDetailUrl}>
        <div className={`relative w-full overflow-hidden`}>
          <div className="relative pt-[calc(450/410*100%)] mb-[12px]">
            <Image
              alt="image"
              src={imageUrl}
              loading="lazy"
              fill
            />
          </div>
          <div className="grid grid-col gap-x-[4px] border-b border-portal-gray-border pb-[9px] mb-[6px]">
            <Typography className='text-portal-gray-7 font-semibold text-lg leading-1.3 mb-[4px]'>{name}</Typography>
            <Typography className='text-base text-portal-gray-8 leading-[1.5]'>{t('EcomProjectManagementPageNewHomeUnitArea')}: <span className="text-portal-gray-7">{totalArea} m²</span></Typography>
          </div>
          <div className="flex items-start">
            <Image
              alt=""
              src={assetsImages.commonIconLocation}
              className="h-[22px] w-[22px]"
              loading="eager"
            />
            <Typography className="text-base text-portal-gray-8 leading-[1.5] ml-[3px] min-h-[42px] line-clamp-2">
              {address}
            </Typography>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCardItem;
