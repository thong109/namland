import { getEcomEcomProjectGet } from '@/ecom-sadec-api-client';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import { getProjectUrl } from '@/utils/urlUtil';
import { getTranslator } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface LinkedProjectProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const getProjectDetail = async (id: string): Promise<ProjectDetailModel> => {
  try {
    const response = (await getEcomEcomProjectGet({
      id: id,
    })) as ApiResponseModel<ProjectDetailModel>;
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    // console.log(error);
  }
};

const LinkedProject: React.FC<LinkedProjectProps> = async ({ listingDetail, locale }) => {
  const t = await getTranslator(locale, 'webLabel');
  const project = await getProjectDetail(listingDetail?.project.id);

  return (
    <div className="flex flex-col gap-8 px-6 py-4 lg:flex-row lg:rounded-[20px] lg:border lg:border-neutral-200">
      <div className="relative h-80 max-w-full overflow-hidden rounded-[20px] lg:h-[13.25rem] lg:max-h-80 lg:w-96 lg:min-w-96">
        <Image
          src={project?.imageUrl}
          alt={project?.name}
          width={200}
          height={120}
          className="object-cover"
        />
      </div>
      <div className="flex flex-grow-0 flex-col gap-4 overflow-hidden">
        <div className="text-2xl font-bold text-neutral-800">{project?.name}</div>
        <div className="line-clamp-[7] text-neutral-500">{project?.description}</div>
        <Link
          href={getProjectUrl(project?.id, project?.name)}
          className="mt-auto self-end text-portal-primaryLiving underline"
        >
          {t('EcomPropertyDetailPageProjectViewMore')}
        </Link>
      </div>
    </div>
  );
};

export default React.memo(LinkedProject);
