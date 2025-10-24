import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import SwiperComponent from '@/components/SwiperComponent/SwiperComponent';
import { ProjectGalleryModel } from '@/models/projectModel/projectGalleryModel';
import * as _ from 'lodash';
import { FC, useState } from 'react';
import { useEffectOnce } from 'react-use';

interface PProjectSwiperBlockProps {
  projectId: string;
}

const ProjectSwiperBlock: FC<PProjectSwiperBlockProps> = ({ projectId }) => {
  const [projectGallery, setProjectGallery] = useState<ProjectGalleryModel[]>([]);

  useEffectOnce(() => {
    projectApiService.getProjectGallery(projectId).then((res) => setProjectGallery(res));
  });

  return (
    <SwiperComponent
      listImage={
        projectGallery &&
        _.flatten(projectGallery.map((p) => p.imageUrls)).map((i) => ({
          url: i,
        }))
      }
    ></SwiperComponent>
  );
};

export default ProjectSwiperBlock;
