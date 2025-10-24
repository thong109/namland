import ProjectDefault from '@/assets/images/projectDefault.png';
import { ProjectListModel } from '@/models/projectModel/projectListModel';
import { Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { FC } from 'react';
export interface CardProjectProps {
  className?: string;
  project: ProjectListModel;
}

const CardProject: FC<CardProjectProps> = ({ className = '', project }) => {
  const t = useTranslations('webLabel');
  const locale = useLocale();

  const { address, logoUrl, id, name, nameEn, nameKr, listingCount, imageUrl } = project;

  const getProjectName = () => {
    let result = locale === 'vi' ? name : locale === 'en' ? nameEn : nameKr;
    return result ?? name;
  };

  return (
    <Link
      href={{ pathname: `du-an/${id}` }}
      className={`flex flex-col rounded border border-portal-border ${className}`}
    >
      <div
        className={`relative h-96 w-full flex-shrink-0 overflow-hidden rounded-t border-b border-portal-border sm:h-56`}
      >
        <img
          alt="project-image"
          src={imageUrl || ProjectDefault.src}
          className="h-full w-full object-fill"
          loading="lazy"
        />
        <div className="absolute left-4 top-4 rounded bg-portal-blackGray px-3 py-1 text-[10px] font-medium text-white">
          {`${(listingCount ?? 0).toString()} ${t('EcomProjectListingConnectedListing')}`}
        </div>
      </div>
      <div className="grid h-20 grid-flow-row p-4">
        <Typography className={`h-5 truncate font-semibold text-primaryColor`}>
          {getProjectName()}
        </Typography>
        <Typography className={`mt-2 h-5 truncate text-sm text-portal-gray`}>{address}</Typography>
      </div>
    </Link>
  );
};

export default CardProject;
