import IconProject from '@/assets/icon/project-icon.svg';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import React, { FC, useMemo } from 'react';
export interface IProps {
  project: any;
  className?: any;
}

const ListingCardProjectInfo: FC<IProps> = ({ project, className }) => {
  const t = useTranslations('enum');

  const label = useMemo(() => {
    return project?.name;
  }, [project, t]);

  return (
    <Link href={project?.url ?? ''} target={'_blank'} className={`hover:text-black`}>
      <div
        className={clsx(
          'absolute z-30 flex cursor-pointer items-center justify-center gap-2 bg-portal-primaryButtonAdmin px-[10px] py-[5px] font-semibold',
          className,
        )}
      >
        <Image alt="" src={IconProject} className="h-[24px] w-[24px]" />
        <span className="cursor-pointer hover:underline"> {label}</span>
      </div>
    </Link>
  );
};

export default React.memo(ListingCardProjectInfo);
