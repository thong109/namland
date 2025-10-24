'use client';
import { FC } from 'react';

import ProjectDefault from '@/assets/images/projectDefault.png';
import { languageConst } from '@/libs/appconst';
import ArticleModel from '@/models/articleModel/ArticleModel';
import { Typography } from 'antd';
import moment from 'moment';
import 'moment/locale/ko';
import 'moment/locale/vi';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
export interface CardArticleProps {
  className?: string;
  imageMinHeight?: number;
  article: ArticleModel;
  position?: string;
}

const CardArticle: FC<CardArticleProps> = ({
  className = '',
  imageMinHeight = 190,
  article,
  position,
}) => {
  const t = useTranslations('webLabel');
  const locale = useLocale();
  const { id, titleEn, title, shareLink, shareLinkEn } = article;
  const { push } = useRouter();
  const getArticleName = () => {
    let result =
      locale === languageConst.vn ? title : locale === languageConst.en ? titleEn : titleEn;
    return result ?? title;
  };

  return position == 'horizontal' ? (
    <div className={` ${className}`}>
      <div className="h-38 grid grid-cols-3 gap-5 overflow-hidden rounded border shadow transition-transform duration-300 lg:h-64 lg:grid-cols-12 lg:hover:scale-105">
        <div className="relative overflow-hidden lg:col-span-4">
          <img
            alt="article-image"
            className="aspect-[16/9] w-full object-fill"
            // src={logoUrl || ProjectDefault}
            loading="lazy"
            src={article?.imageUrl || ProjectDefault.src}
          />
        </div>

        <div className="col-span-2 lg:col-span-8">
          <div className="flex h-full flex-col justify-between py-3">
            <div>
              <Typography className={`h-5 truncate font-semibold text-primaryColor`}>
                {getArticleName()}
              </Typography>
              <Typography className={`text-one-line mt-2 h-5 text-sm text-portal-gray lg:!hidden`}>
                {article?.description}
              </Typography>
              <Typography
                className={`mt-2 !hidden h-[150px] overflow-hidden text-sm text-portal-gray lg:!block`}
              >
                {article?.description}
              </Typography>
            </div>
            <div className="text-[12px]">
              {moment(article?.postAt ? article.postAt : article?.createdAt)
                .locale(locale)
                .format(`DD MMMM  , YYYY  [${t('at')}] HH:mm A`)}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      onClick={() => push(`/tin-tuc/${article?.id}`)}
      className={`flex flex-col rounded border border-portal-border pb-2 ${className} h-full transition-transform duration-300 lg:hover:scale-105`}
    >
      <div
        className={`relative w-full flex-shrink-0 overflow-hidden rounded-t border-b border-portal-border`}
      >
        <img
          alt="article-image"
          className={`w-full min-h-[${imageMinHeight}px] aspect-[16/9] object-fill`}
          loading="lazy"
          src={article?.imageUrl || ProjectDefault.src}
        />
      </div>
      <div className="grid h-auto grid-flow-row p-3 text-left">
        <Typography className={`h-5 truncate font-semibold text-primaryColor`}>
          {getArticleName()}
        </Typography>
        <div className="mt-2 line-clamp-3 text-sm text-portal-gray">
          <Typography className={``}>{article?.description}</Typography>
        </div>
      </div>
    </div>
  );
};

export default CardArticle;
