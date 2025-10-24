'use client';
import GoogleMap from '@/components/GoogleMap';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ProjectInfoLocationProps {
  projectDetail: any;
}

const ProjectNewLocation: React.FC<ProjectInfoLocationProps> = ({ projectDetail }) => {
  const t = useTranslations('webLabel');

  const center = projectDetail?.location?.location;

  return (
    <div className="my-8">
      <div className="flex w-full justify-center text-lg font-semibold">
        {t('EcomProjectDetaiLocation')}
      </div>
      <div className="mt-3 h-60 w-full overflow-hidden lg:rounded-3xl">
        <GoogleMap initCenter={center} isMarker listMarker={[center]} />
      </div>
    </div>
  );
};

export default React.memo(ProjectNewLocation);
