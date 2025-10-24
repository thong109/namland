'use client';
import IconBath from '@/assets/icon/icon-bath.svg';
import IconBed from '@/assets/icon/icon-bed.svg';
import IconCamera from '@/assets/icon/icon-camera.svg';
import IconHeart from '@/assets/icon/icon-heart.svg';
import IconSquare from '@/assets/icon/icon-square.svg';
import ImageProperties from '@/assets/images/img-properties.png';
import { listingType, priceType, removeDiacritics } from '@/libs/appconst';
import ListingModel from '@/models/listingModel/listingModel';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Link from 'next-intl/link';
import Image from 'next/image';
import { FC, useState } from 'react';
import BtnFavorist from '../Button/FavoriteButton/BtnFavorist';
import BadgeVip from '../CommonComponent/BadgeVip';
import NumberFormatPrice from '../NumberFormatPrice/NumberFormatPrice';
export interface CardItemPropertiesProps {
  className?: string;
  data?: ListingModel;
  size?: 'default' | 'small';
  type?: string;
  layout?: 'vertial' | 'horizontal';
  isReplace?: boolean;
  rightTitle?: string;
  hiddenMonth?: boolean;
  classContent?: string;
  classPadding?: string;
}

const CardItemProperties: FC<CardItemPropertiesProps> = ({
  size = 'default',
  className = '',
  data,
  type,
  layout = 'vertial',
  isReplace,
  rightTitle,
  hiddenMonth,
  classContent,
  classPadding,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('webLabel');
  const [numberFavored, setNumberFavored] = useState<number>(
    data?.listingStatistic?.totalFavored || 0,
  );

  const getPropertyLink = () => {
    let stringNotUniCode = removeDiacritics(data.title);
    let string = stringNotUniCode?.replaceAll(/[^a-zA-Z ]/g, '').replaceAll(/ /g, '-');

    return `/property/${string + '-' + data.id}`;
  };

  const renderImage = () => {
    return (
      <div className="relative h-[220px] w-full">
        {data?.priorityStatus ? <BadgeVip className="absolute left-3 top-3" desc="VIP" /> : null}
        {rightTitle ? (
          <BadgeVip className="absolute right-3 top-3 !bg-[#0D263B] uppercase" desc={rightTitle} />
        ) : null}
        <Link href={getPropertyLink()} replace={isReplace}>
          <img
            src={data?.imageThumbnailUrl || ImageProperties.src}
            loading="lazy"
            alt=""
            width={200}
            height={200}
            className="imgCustom h-full w-full object-cover lg:hidden"
          />
        </Link>
        <Link href={getPropertyLink()} replace={isReplace}>
          <img
            src={data?.imageThumbnailUrl || ImageProperties.src}
            loading="lazy"
            alt=""
            width={320}
            height={200}
            className="imgCustom hidden h-full w-full object-cover lg:block"
          />
        </Link>
        <Link
          className={layout === 'horizontal' ? 'hidden' : ''}
          href={`/agency/${data?.userInfo?.id}`}
        >
          <img
            src={data?.userInfo?.avatarUrl || ImageProperties.src}
            alt=""
            loading="lazy"
            width={40}
            height={40}
            className="z-1 z-1 absolute bottom-[-15px] right-4 h-[42px] w-[42px] overflow-hidden rounded-full border-2 border-white"
          />
        </Link>
        <div className="absolute bottom-4 left-5 flex text-[12px] font-semibold text-white">
          <div className="flex items-center justify-center">
            <img src={IconCamera.src} alt="" loading="lazy"></img>
            <div className="ml-1">{data?.listingStatistic?.totalImages || 0}</div>
          </div>
          <div className="ml-3 flex items-center justify-center">
            <img src={IconHeart.src} alt="" loading="lazy"></img>
            <div className="ml-1">{numberFavored}</div>
          </div>
        </div>
      </div>
    );
  };
  const renderTienIch = () => {
    return (
      <div
        className={
          'flex ' +
          (layout === 'horizontal' ? ' justify-start gap-2 px-3' : ' justify-center') +
          classContent
        }
      >
        <div className="flex flex-col items-center justify-end">
          <span className="inline-block">
            <Image alt="bed" src={IconBed} className="mb-1"></Image>
          </span>
          <span className="whitespace-nowrap text-center text-xs font-bold text-neutral-500 dark:text-neutral-400 xl:text-[10px] 2xl:text-xs">
            {data?.bedrooms} {t('EcomPropertyListingDetailPagePropertyInformationBeds')}
          </span>
        </div>
        {/* ---- */}
        <div
          className={`flex flex-col items-center justify-end px-7 lg:px-3 xl:px-3 2xl:px-7 ${classPadding} `}
        >
          <span className="inline-block">
            <Image alt="bed" src={IconBath} className="mb-1"></Image>
          </span>
          <span className="whitespace-nowrap text-center text-xs font-bold text-neutral-500 dark:text-neutral-400 xl:text-[10px] 2xl:text-xs">
            {data?.bathrooms} {t('EcomPropertyListingDetailPagePropertyInformationBaths')}
          </span>
        </div>
        {/* ---- */}
        <div className="flex flex-col items-center justify-end">
          <span className="inline-block">
            <Image alt="bed" src={IconSquare} className="mb-1"></Image>
          </span>
          <span className="whitespace-nowrap text-center text-xs font-bold text-neutral-500 dark:text-neutral-400 xl:text-[10px] 2xl:text-xs">
            {data?.size} m<sup>2</sup>
          </span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div
        className={
          `flex flex-col ` +
          (layout === 'horizontal'
            ? 'h-full gap-4 pb-[8.5px] pt-[8.5px]'
            : '!h-[150px] justify-between pb-[15px] pt-[15px]')
        }
      >
        <div className="px-3">
          <div className="flex items-center">
            <h2
              className={`text-one-line font-semibold capitalize text-primaryColor dark:text-white ${
                size === 'default' ? 'text-base' : 'text-base'
              }`}
            >
              {data?.title}
            </h2>
          </div>
          <div className="flex items-center pt-2 text-sm text-neutral-500">
            <span className="text-one-line">{data?.location?.formattedAddress}</span>
          </div>
        </div>
        <div>{renderTienIch()}</div>
      </div>
    );
  };
  const renderFooter = () => {
    return (
      <div className="h-[65px]">
        <div className="w-full border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex h-full items-center justify-center px-3">
          <div className="flex w-full items-center justify-between">
            <div>
              <div className="text-base font-semibold text-[#FFD14B]">
                <NumberFormatPrice
                  localeParams="vi"
                  value={
                    data?.type === listingType.sale
                      ? data?.priceVnd
                      : data?.displayPriceType === priceType.month
                        ? data?.priceVnd
                        : data?.priceVndM2
                  }
                ></NumberFormatPrice>
                {/*  displayPriceType = 0 là hiện thị số tiền /m2 còn 1 là hiển thị trên thang */}

                {data?.displayPriceType === 1 ? (
                  hiddenMonth ? (
                    ''
                  ) : data?.type == listingType.sale ? (
                    ''
                  ) : (
                    ' /tháng'
                  )
                ) : data?.type == listingType.sale ? (
                  ''
                ) : (
                  <>
                    {' /m'}
                    <sup>2</sup>
                  </>
                )}
              </div>
              {data?.priceUsd ? (
                <div className="flex text-[12px] text-black">
                  <NumberFormatPrice
                    localeParams="en"
                    value={
                      data?.type === listingType.sale
                        ? data?.priceUsd
                        : data?.displayPriceType === priceType.month
                          ? data?.priceUsd
                          : data?.priceUsdM2
                    }
                  ></NumberFormatPrice>
                  {hiddenMonth ? '' : data?.type == listingType.sale ? '' : '/mth'}
                </div>
              ) : null}
            </div>
            {/* <NumericFormat
              
                displayType={'text'}
                thousandSeparator={true}
                suffix={locale == 'vi' ? ' VND' : ' USD'}
              ></NumericFormat> */}{' '}
            <BtnFavorist
              id={data?.id}
              isLiked={data?.isFavourite}
              changeFavoric={(number) => {
                setNumberFavored(numberFavored + number);
              }}
              className=""
            />
          </div>
        </div>
      </div>
    );
  };
  return layout === 'horizontal' ? (
    <div
      className={`nc-CardItemProperties relative ${className} flex justify-between rounded border border-gray-200 bg-white transition duration-150 ease-in-out hover:scale-[1.03]`}
    >
      <div className="shrink-0 md:w-72">{renderImage()}</div>
      <div className="flex grow flex-col justify-between">
        <Link className="flex-grow" href={getPropertyLink()} replace={isReplace}>
          {renderContent()}
        </Link>
        {renderFooter()}
      </div>
    </div>
  ) : (
    <div
      className={`nc-CardItemProperties relative ${className} flex min-h-[420px] flex-col justify-between rounded border border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:hover:scale-105`}
    >
      <div>{renderImage()}</div>
      <Link href={getPropertyLink()} replace={isReplace} className="h-full">
        {renderContent()}
      </Link>
      <div>{renderFooter()}</div>
    </div>
  );
};

export default CardItemProperties;
