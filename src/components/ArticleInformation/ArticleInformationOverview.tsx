import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useTranslations } from 'next-intl';
import React from 'react';
import FavoriteButton from '@/components/ArticleInformation/ArticleInformationOverview.FavoriteButton';
import ShareButton from '@/components/ArticleInformation/ArticleInformationOverview.ShareButton';
import PropertyInfoBox from '@/components/CardListing/_component/PropertyInfoBox';
import { assetsImages } from '@/assets/images/package';
import ArticleInformationOverviewAbout from './ArticleInformationOverviewAbout';

interface ArticleInformationOverviewProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

const ArticleInformationOverview: React.FC<ArticleInformationOverviewProps> = ({ listingDetail, locale }) => {
  const t = useTranslations('webLabel');

  return (
    <div className='article-common-information article-common-information--overview' id='overview'>
      <h1 className='article-common-information__title'>{listingDetail?.title}</h1>
      <address className='article-common-information__address'><span class='article-common-information__address-icon' ></span>{listingDetail?.location?.formattedAddress}</address>
      <ArticleInformationOverviewAbout locale={locale} listingDetail={listingDetail} />
      <div className='article-common-information__description'>
        <span className='article-common-information__description-label'>Mô tả</span>
        <div className='article-common-information__description-wrapper'>
          <p>Khu đô thị Nam Long do Tập đoàn Nam Long làm chủ đầu tư và được quy hoạch thành các phân khu chức năng: phố thương mại dịch vụ, khu căn hộ cao cấp, cụm nhà hàng khách sạn, khu biệt thự cao cấp,...<br />Đô thị thương mại – dịch vụ Nam Long - Tân Thuận Đông bắt đầu xây dựng từ năm 2002 và trở thành một trong những đô thị tiêu biểu của Q.7. Tọa lạc tại phường Tân Thuận Đông, Quận 7, Tp.HCM, tiếp giáp trục đường chính Huỳnh Tấn Phát, dự án được kết nối với những khu vực lân cận bằng các trục đường huyết mạch: đại lộ Nam Sài Gòn, cầu Tân Thuận 2, cầu Kênh Tẻ, cầu Phú Mỹ, cầu đường Nguyễn Tri Phương nối dài… Nằm dọc theo cầu Phú Mỹ nối hai trung tâm mới của thành phố từ Q.7 sang Q.2, đô thị Nam Long – Tân Thuận Đông cách Q.1 chỉ 4km, cách Phú Mỹ Hưng 1,5km sở hữu một vị trí chiến lược hiếm có.<br />Dự án có quy mô khoảng 31 ha, được khởi công xây dựng cuối năm 2002. Đến tháng 6/2004, Công ty Nam Long đã hoàn thành đầu tư xây dựng cơ sở hạ tầng giai đoạn một gồm: hệ thống cáp điện, cáp viễn thông ngầm; hệ thống cấp nước máy thành phố; hệ thống thoát mưa, thoát nước bẩn riêng biệt; hệ thống chiếu sáng công cộng; các trục đường nội bộ trải bêtông nhựa nóng,…</p>
        </div>
      </div>
    </div>
    // <div className="flex justify-between">
    //   <div className="flex flex-col gap-2">
    //     <h1 className="text-base font-medium">{listingDetail?.title}</h1>
    //     <div className="flex items-center gap-1 text-xs text-neutral-500">
    //       {listingDetail?.location?.formattedAddress}
    //     </div>
    //     <div className="flex justify-between lg:block">
    //       <PropertyInfoBox
    //         listingDetail={listingDetail}
    //         className={'flex gap-3 self-start px-2 py-1'}
    //         overrideBasedStyle
    //       />
    //       <div className="flex flex-col-reverse gap-2 lg:hidden">
    //         <div className="flex gap-8">
    //           <ShareButton listingDetail={listingDetail} locale={locale} />
    //           <FavoriteButton listingDetail={listingDetail} locale={locale} />
    //         </div>
    //         <label className="text-right font-medium text-[#A80707]">
    //           {formatNumber(locale === 'vi' ? listingDetail?.priceVnd : listingDetail?.priceUsd)}{' '}
    //           {listingDetail?.type === listingType.rent && t('/mo')}
    //         </label>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="hidden flex-col gap-2 lg:flex">
    //     <div className="flex gap-8">
    //       <ShareButton listingDetail={listingDetail} locale={locale} />
    //       <FavoriteButton listingDetail={listingDetail} locale={locale} />
    //     </div>
    //     <label className="text-right font-medium text-[#A80707]">
    //       {formatNumber(listingDetail?.priceVnd)} {locale === 'vi' ? 'VNĐ' : 'VNĐ'}
    //       {listingDetail?.type === listingType.rent && t('/mo')}
    //     </label>
    //   </div>
    // </div>
  );
};

export default React.memo(ArticleInformationOverview);
