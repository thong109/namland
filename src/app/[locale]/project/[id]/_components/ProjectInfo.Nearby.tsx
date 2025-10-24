import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ProjectInfoNearbyProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const ProjectInfoNearby: React.FC<ProjectInfoNearbyProps> = ({ locale, projectDetail }) => {
  const t = useTranslations('webLabel');

  return (
    <div className="flex flex-wrap gap-4">
      {projectDetail?.nearBy?.map((item, index) => (
        <div
          key={index}
          className={clsx(
            'flex h-8 items-center justify-center whitespace-nowrap rounded-3xl border border-cyan px-4 py-2',
            'bg-cyan text-neutral-0',
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProjectInfoNearby);
