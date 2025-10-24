'use client';

import GoogleMap from '@/components/GoogleMap';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ProjectInfoLocationProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const ProjectInfoLocation: React.FC<ProjectInfoLocationProps> = ({ locale, projectDetail }) => {
  const t = useTranslations('webLabel');

  const center = projectDetail?.location?.location;

  return (
    <div className="h-80 w-full overflow-hidden lg:rounded-3xl">
      <GoogleMap disabled initCenter={center} isMarker listMarker={[center]} />
    </div>
  );
};

export default React.memo(ProjectInfoLocation);
