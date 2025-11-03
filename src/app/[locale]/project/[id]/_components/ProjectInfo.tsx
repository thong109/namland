"use client"
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import ArticleInformationDetailsLocation from '@/components/ArticleInformation/ArticleInformationDetailsLocation';
import '@/components/ArticleInformation/ArticleInformationDetails.css';
import { formatArea } from '@/utils/convertUtil';
import CarouselWithArrow from '@/app/[locale]/_components/CarouselWithArrow/CarouselWithArrow';
import Image from 'next/image';
import { assetsImages } from '@/assets/images/package';

interface ProjectInfoProps {
  locale: string;
  projectDetail: ProjectDetailModel;
}

const imagesProject = [
  {
    image: assetsImages.articleImage1,
  },
  {
    image: assetsImages.articleImage2,
  },
  {
    image: assetsImages.articleImage3,
  },
  {
    image: assetsImages.articleImage4,
  },
]

const ProjectInfo: React.FC<ProjectInfoProps> = ({ locale, projectDetail }) => {
  const t = useTranslations('webLabel');
  const [slidesPerRow, setSlidesPerRow] = useState(3);

  const items = useMemo(() => {
    return imagesProject.map((item: any, index) => (
      <div className={clsx('w-[212px] mobile:w-full px-[5px]')} key={index}>
        <div className="relative pt-[calc(133/212*100%)]">
          <Image
            className="absolute inset-0 object-cover w-full h-full"
            src={item.image}
            alt="Image"
            width={212}
            height={133}
          />
        </div>
      </div>
    ));
  }, [imagesProject]);

  return (
    <>
      <div className='article-common-information article-common-information--details article-common-information--details-custom'>
        <div className='article-common-information__wrapper' id='overview'>
          <h1 className='article-common-information__title'>{t('EcomPropertyDetailPageLocationOverview', { name: projectDetail?.name })}</h1>
          <div className='article-common-information__block'>
            <span className='md:col-span-2 article-common-information__title article-common-information__title-small'>{t('EcomProjectDetailProjectDetail')}</span>
            <div className='article-common-information__block-column'>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>{t('EcomProjectDetailProjectName')}</dt>
                <dd className='article-common-information__block-description'>{projectDetail?.name}</dd>
              </dl>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>{t('EcomProjectDetailOwnership')}</dt>
                <dd className='article-common-information__block-description'>{projectDetail?.unitTypeRent?.length ? projectDetail?.unitTypeRent.map(i => i.name).join(', ') : '—'}</dd>
              </dl>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>{t('EcomProjectManagementPageNewHomeConstructionDensity')}</dt>
                <dd className='article-common-information__block-description'>60ha</dd>
              </dl>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>{t('EcomProjectDetailProjectType')}</dt>
                <dd className='article-common-information__block-description'>{formatArea(projectDetail?.totalArea)}</dd>
              </dl>
            </div>
            <div className='article-common-information__block-column'>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>{t('EcomProjectManagementPageNewHomeInvestor')}</dt>
                <dd className='article-common-information__block-description'>{projectDetail?.investor}</dd>
              </dl>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>{t('EcomProjectDetailProjectLocationBay')}</dt>
                <dd className='article-common-information__block-description'>8,6ha</dd>
              </dl>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>{t('EcomProjectDetailProjectLocationSea')}</dt>
                <dd className='article-common-information__block-description'>3,5ha</dd>
              </dl>
              <dl className='article-common-information__block-row'>
                <dt className='article-common-information__block-title'>
                  {Number(projectDetail?.handOverYear)
                    ? t('EcomProjectDetailHandOverYear')
                    : t('EcomPropertyListingDetailPageProgress')}
                </dt>
                <dd className='article-common-information__block-description'>
                  {Number(projectDetail?.handOverYear)
                    ? projectDetail.handOverYear
                    : t('EcomProjectDetailProjectLocationUnderConstruction')}
                </dd>
              </dl>
            </div>
          </div>
          <div className='article-common-information__description'>
            <div className='article-common-information__description-wrapper'>{projectDetail?.description}</div>
          </div>
        </div>
        <div className='article-common-information__wrapper' id='area'>
          <span className='article-common-information__title'>{t('EcomPropertyDetailPageLocation')}</span>
          <ArticleInformationDetailsLocation locale={locale} listingDetail={projectDetail} />
        </div>
        <div className='article-common-information__wrapper' id='amenities'>
          <span className='article-common-information__title'>{t('EcomPropertyDetailPageLocationAmenities', { name: projectDetail?.name })}</span>
          <CarouselWithArrow
            items={items}
            className="block"
            slidesPerRow={slidesPerRow}
          ></CarouselWithArrow>
        </div>
        <div className='article-common-information__wrapper' id='partner'>
          <span className='article-common-information__title'>{t('EcomPropertyDetailPageLocationPartner', { name: projectDetail?.name })}</span>
          <div className="article-common-information__block-partner">
            <div className="article-common-information__block-partner--wrapper">
              <div className="article-common-information__block-partner--inner">
                <div className="article-common-information__block-partner--thumbnail">
                  <Image src={assetsImages.logoImage1} width={109} height={140} loading='eager' alt="BEST HOUSE" className='w-auto h-full' />
                </div>
                <div className="article-common-information__block-partner--content">
                  <span className="article-common-information__block-partner--title">BEST HOUSE</span>
                  <span className="article-common-information__block-partner--phone">+84-909 197 412</span>
                  <span className="article-common-information__block-partner--email">
                    <strong>Email:</strong>
                    <a href="mailto:jenny.besthouse@gmail.com">jenny.besthouse@gmail.com</a>
                  </span>
                </div>
              </div>
            </div>
            <div className="article-common-information__block-partner--wrapper">
              <div className="article-common-information__block-partner--inner">
                <div className="article-common-information__block-partner--thumbnail">
                  <Image src={assetsImages.logoImage2} width={132} height={140} loading='eager' alt="DAI PHAT GROUP" className='w-auto h-full' />
                </div>
                <div className="article-common-information__block-partner--content">
                  <span className="article-common-information__block-partner--title">DAI PHAT GROUP</span>
                  <span className="article-common-information__block-partner--phone">+84-909 197 412</span>
                  <span className="article-common-information__block-partner--email">
                    <strong>Email:</strong>
                    <a href="mailto:congtambds@gmail.com">congtambds@gmail.com</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProjectInfo);
