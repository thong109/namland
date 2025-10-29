import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { getProjectUrl } from '@/utils/urlUtil';
import Link from 'next-intl/link';
import { getTranslator } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

interface Props {
  locale: string;
  project: ProjectDetailModel;
}

const ExploreProjectCard: React.FC<Props> = async ({ locale, project }) => {

  return (
    <Link
      href={getProjectUrl(project.id, project.name)}
      className="relative flex size-full flex-col justify-end text-neutral-0"
    >
      <Image
        src={project.imageUrl}
        alt={'project-image-' + project.name}
        fill
        className="-z-10"
        loading="lazy"
      />
      <div className="bg-green bg-opacity-70">
        <div className="text-center text-base font-bold">{project.name}</div>
        <div className="mb-2 flex justify-center gap-8 text-sm">
          <div className="underline">
            <span>{project.saleCount}</span>
          </div>
          <div className="underline">
            <span>{project.rentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExploreProjectCard;
