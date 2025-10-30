import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React from 'react';
import ListingDetailedIndoorAmenity from './ListingDetailed.IndoorAmenity';
import ListingDetailedNearby from './ListingDetailed.Nearby';
import ListingDetailedOutdoorAmenity from './ListingDetailed.OutdoorAmenity';
import { YouTubeComponent } from './YoutubeEmbed';
import { assetsImages } from '@/assets/images/package';

const ArticleInformationDetailsLocation = dynamic(() => import('./ArticleInformationDetailsLocation'), { ssr: false });

interface ArticleInformationDetailsProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ArticleInformationDetails: React.FC<ArticleInformationDetailsProps> = ({ locale, listingDetail }) => {
  const t = useTranslations('webLabel');
  const blockTitleClassName = 'text-lg font-medium text-neutral-900 mb-4';
  return (
    <div className='article-common-information article-common-information--details'>
      <div className='article-common-information__wrapper' id='#details'>
        <span className='article-common-information__title'>{t('EcomPropertyDetailPageDetailPropertyDetails')}</span>
        <div className='article-common-information__block'>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Loại sản phẩm:</dt>
            <dd className='article-common-information__block-description'></dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Dự án:</dt>
            <dd className='article-common-information__block-description'></dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Tháp /Tòa:</dt>
            <dd className='article-common-information__block-description'></dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Tầng:</dt>
            <dd className='article-common-information__block-description'></dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Diện tích(m2):</dt>
            <dd className='article-common-information__block-description'>{listingDetail?.size ?? 'ー'}</dd>
          </dl>
        </div>
        <div className='article-common-information__block'>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Phòng ngủ:</dt>
            <dd className='article-common-information__block-description'>{listingDetail?.bedrooms ?? 'ー'}</dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Phòng vệ sinh:</dt>
            <dd className='article-common-information__block-description'>{listingDetail?.bathrooms ?? 'ー'}</dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Trạng thái pháp lý:</dt>
            <dd className='article-common-information__block-description'>Đã có Sổ Hồng</dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Tình trạng nội thất:</dt>
            <dd className='article-common-information__block-description'>Nội thất cơ bản</dd>
          </dl>
          <dl className='article-common-information__block-row'>
            <dt className='article-common-information__block-title'>Hướng nhìn:</dt>
            <dd className='article-common-information__block-description'>Đông Nam</dd>
          </dl>
        </div>
      </div>
      <div className='article-common-information__wrapper' id='#furniture'>
        <span className='article-common-information__title'>Nội thất</span>
        <div className='article-common-information__block'>
          <ul className='list-common-property list-common-property--furniture'>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture.src})`, backgroundSize: `22px auto` }}></span>Bếp điện</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture02.src})`, backgroundSize: `25px auto` }}></span>Lò vi sóng</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture03.src})`, backgroundSize: `22px auto` }}></span>WiFi</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture04.src})`, backgroundSize: `23px auto` }}></span>Bàn ghế ăn</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `25px auto` }}></span>Fitness</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `24px auto` }}></span>Tủ lạnh</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `21px auto` }}></span>Giường</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `27px auto` }}></span>Phòng Tập Yoga</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `21px auto` }}></span>Màn che cửa sổ</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `27px auto` }}></span>Giường + đệm</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `25px auto` }}></span>Phòng Đọc Sách</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconFurniture05.src})`, backgroundSize: `21px auto` }}></span>Giặt, là</li>
          </ul>
        </div>
      </div>
      <div className='article-common-information__wrapper' id='#utilities'>
        <span className='article-common-information__title'>Tiện ích</span>
        <div className='article-common-information__block'>
          <ul className='list-common-property list-common-property--utilities'>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities.src})`, backgroundSize: `24px auto` }}></span>Trường học</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities02.src})`, backgroundSize: `24px auto` }}></span>Công viên</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities03.src})`, backgroundSize: `24px auto` }}></span>Bệnh viện</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities04.src})`, backgroundSize: `24px auto` }}></span>Chợ</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities05.src})`, backgroundSize: `24px auto` }}></span>Trung tâm hành chính</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities06.src})`, backgroundSize: `24px auto` }}></span>Siêu thị</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities07.src})`, backgroundSize: `24px auto` }}></span>Trường đại học</li>
            <li className='list-common-property__item'><span className='list-common-property__item-icon' style={{ backgroundImage: `url(${assetsImages.commonIconUtilities08.src})`, backgroundSize: `24px auto` }}></span>Trung tâm thương mại</li>
          </ul>
        </div>
      </div>
      <div className='article-common-information__wrapper' id='#location'>
        <span className='article-common-information__title'>{t('EcomPropertyDetailPageLocation')}</span>
        <div className='article-common-information__block'>
          <ArticleInformationDetailsLocation locale={locale} listingDetail={listingDetail} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ArticleInformationDetails);
